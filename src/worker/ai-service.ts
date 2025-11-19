export class AIService {
  env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  buildPrompt(history: string[], message: string) {
    console.log("buildPrompt:", { history, message });
    return `
You are a helpful AI.
Chat history:
${history.join("\n")}
User: ${message}
AI:
    `.trim();
  }

  async getAIResponse(prompt: string) {
    const aiResponse = await this.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      prompt,
      max_tokens: 50
    });

    return aiResponse.response;
  }
}
