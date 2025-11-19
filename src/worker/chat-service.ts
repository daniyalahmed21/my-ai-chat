export class ChatService {
	env: Env;
	userId: string;

	constructor(env: Env, userId: string) {
		this.env = env;
		this.userId = userId;
	}

	getDO() {
		const id = this.env.CHAT_HISTORY.idFromName(this.userId);
		return this.env.CHAT_HISTORY.get(id);
	}

	async addMessage(message: string) {
		const obj = this.getDO();
		await obj.fetch(
			new Request('https://dummy/chat', {
				method: 'POST',
				body: JSON.stringify({ message }),
				headers: { 'Content-Type': 'application/json' },
			})
		);
	}

	async getHistory(): Promise<string[]> {
		const obj = this.getDO();
		const res = await obj.fetch(new Request('https://dummy/chat/history', { method: 'GET' }));
		const text = await res.text();

		try {
			const data = JSON.parse(text) as { history: string[] };
			return data.history || [];
		} catch {
			return [];
		}
	}
}
