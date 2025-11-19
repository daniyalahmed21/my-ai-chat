import { streamText } from "ai";
import { createWorkersAI } from "workers-ai-provider";

export class AIService {
  constructor(private env: Env) {}

  buildPrompt(history: string[], userMessage: string) {
    return [
      { role: "system", content: "You are a helpful AI assistant." },
      ...history.map((msg) => ({ role: "user", content: msg })),
      { role: "user", content: userMessage },
    ];
  }

  async streamAIResponse(prompt: string) {
    const workers = createWorkersAI({
      binding: this.env.AI, // Your Workers AI binding
      
    });

    return streamText({
      model: workers("@cf/meta/llama-3-8b-instruct"), // correct model
      prompt,

    });
  }
}
