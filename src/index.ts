import { ChatHistory } from './chat-history';

export { ChatHistory };

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'POST') {
			const { message } = await request.json<{ message: string }>();

			// Get the Durable Object ID (singleton)
			const id = env.CHAT_HISTORY.idFromName('main');
			const obj = env.CHAT_HISTORY.get(id);

			// Add user message to history
			await obj.fetch(
				new Request('https://dummy', {
					method: 'POST',
					body: JSON.stringify({ message }),
					headers: { 'Content-Type': 'application/json' },
				})
			);

			// Fetch full chat history
			const historyResponse = await obj.fetch(new Request('https://dummy', { method: 'GET' }));
			const data = (await historyResponse.json()) as { history: string[] };
			const history = data.history;

			// Build AI prompt
			const prompt = `You are a helpful AI. Here is the chat history: ${history.join('\n')}\nUser: ${message}\nAI:`;

			const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
				prompt,
				max_tokens: 50,
			});

			await obj.fetch(
				new Request('https://dummy', {
					method: 'POST',
					body: JSON.stringify({ message: aiResponse.response }),
					headers: { 'Content-Type': 'application/json' },
				})
			);

			return new Response(JSON.stringify({ reply: aiResponse.response }, null, 2), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response('Send a POST with { "message": "your prompt" }', { status: 200 });
	},
} satisfies ExportedHandler<Env>;
