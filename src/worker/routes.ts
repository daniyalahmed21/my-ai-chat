import { ChatService } from './chat-service';
import { AIService } from './ai-service';

export async function handleChatPOST(request: Request, env: Env) {
	try {
		const { message } = await request.json<{ message: string }>();
		if (!message || typeof message !== 'string') {
			return new Response('Invalid message', { status: 400 });
		}

		const chat = new ChatService(env);
		const ai = new AIService(env);

		// Save user message via DO
		await chat.addMessage(message);

		// Fetch full history via DO
		const history = await chat.getHistory();

		// Build AI prompt and get reply
		const prompt = ai.buildPrompt(history, message);
		const reply = await ai.getAIResponse(prompt);

		if (!reply) {
			return new Response('AI response is empty', { status: 500 });
		}

		// Save AI reply via DO
		await chat.addMessage(reply);

		// Return AI reply to client
		return Response.json({ reply });
	} catch (err) {
		console.error('Error in handleChatPOST:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
}
