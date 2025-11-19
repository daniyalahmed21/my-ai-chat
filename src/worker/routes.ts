import { ChatService } from './chat-service';
import { AIService } from './ai-service';

export async function handleChatPOST(request: Request, env: Env, userId: string) {
	try {
		// -----------------------------
		// 🔹 RATE LIMITING CHECK
		// -----------------------------
		const { success } = await env.MY_RATE_LIMITER.limit({ key: userId });
		if (!success) {
			return new Response('Rate limit exceeded. Try again later.', { status: 429 });
		}

		// -----------------------------
		// 🔹 MESSAGE VALIDATION CHECK
		// -----------------------------
		const { message } = (await request.json()) as { message: string };
		if (!message) return new Response('Invalid message', { status: 400 });

		const chat = new ChatService(env, userId);
		const ai = new AIService(env);

		// Save user message
		await chat.addMessage(message);

		// Load chat history
		const history = await chat.getHistory();

		const messages = ai.buildPrompt(history, message);

		// Flatten to text prompt
		const promptText = messages.map((m) => `${m.role}: ${m.content}`).join('\n');

		// -----------------------------
		// 🔹 STREAMING AI RESPONSE
		// -----------------------------

		const result = await ai.streamAIResponse(promptText);

		// Convert to streaming Response
		const streamResponse = result.toTextStreamResponse({
			headers: {
				'Content-Type': 'text/plain',
				'transfer-encoding': 'chunked',
				'content-encoding': 'identity',
			},
		});

		// Save final text asynchronously without TypeScript errors
		async function saveFinalAIResponse(chat: ChatService, result: any) {
			const finalText = await result.text();
			await chat.addMessage(finalText);
		}

		// Trigger it asynchronously
		saveFinalAIResponse(chat, result);

		return streamResponse;
	} catch (err) {
		console.error('handleChatPOST error:', err);
		return new Response('Internal Error', { status: 500 });
	}
}
