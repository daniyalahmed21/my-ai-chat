import { streamText, generateText } from 'ai';
import { createWorkersAI } from 'workers-ai-provider';
import { buildPrompt, flattenPrompt } from '../utils/promptBuilder';
import { AI_MODEL, SUMMARY_PROMPT } from '../config/aiConfig';

export class AIService {
  constructor(private env: Env) {}

  async streamAIResponse(history: string[], message: string, summary?: string) {
    const messages = buildPrompt(history, message, summary);
    const prompt = flattenPrompt(messages);

    const workers = createWorkersAI({ binding: this.env.AI });

    return streamText({
      model: workers(AI_MODEL),
      prompt,
    });
  }

  async generateSummary(messages: string[]): Promise<string> {
    const workers = createWorkersAI({ binding: this.env.AI });

    const text = await generateText({
      model: workers(AI_MODEL),
      prompt: SUMMARY_PROMPT + messages.join('\n'),
    });

    return text.text;
  }

  async getAIResponse(prompt: string): Promise<string> {
    const workers = createWorkersAI({ binding: this.env.AI });

    const result = await generateText({
      model: workers(AI_MODEL),
      prompt,
    });

    return result.text;
  }
}
