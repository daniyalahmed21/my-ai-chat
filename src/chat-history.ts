// src/chat-history.ts

export class ChatHistory {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
  }

  // Helper to get current messages
  private async getHistory(): Promise<string[]> {
    return (await this.state.storage.get<string[]>('messages')) || [];
  }

  // Helper to save messages
  private async saveHistory(history: string[]): Promise<void> {
    // Keep only the last 10 messages
    const trimmed = history.slice(-10);
    await this.state.storage.put('messages', trimmed);
  }

  async fetch(request: Request) {
    switch (request.method) {
      case 'POST': {
        const { message } = (await request.json()) as { message: string };

        // Read current history, add new message, save
        const history = await this.getHistory();
        history.push(message);
        await this.saveHistory(history);

        return new Response(JSON.stringify({ status: 'ok', history }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'GET': {
        const history = await this.getHistory();
        return new Response(JSON.stringify({ history }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response('Method not allowed', { status: 405 });
    }
  }
}
