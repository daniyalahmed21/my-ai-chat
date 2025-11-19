export class ChatService {
  env: Env;

  constructor(env: Env) { this.env = env; }

  getDO() {
    const id = this.env.CHAT_HISTORY.idFromName("main");
    return this.env.CHAT_HISTORY.get(id);
  }

  async addMessage(message: string) {
    const obj = this.getDO();
    await obj.fetch(new Request("https://dummy/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: { "Content-Type": "application/json" }
    }));
  }

  async getHistory(): Promise<string[]> {
    const obj = this.getDO();
    const res = await obj.fetch(new Request("https://dummy/chat/history", { method: "GET" }));
    const data = await res.json<{ history: string[] }>();
    return data.history || [];
  }
}
