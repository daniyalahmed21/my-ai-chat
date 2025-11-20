import { AIService } from '../services/ai-service';

export async function getAIStream(
  ai: AIService,
  history: string[],
  message: string,
  summary?: string
) {
  // Stream AI response
  const streamResult = await ai.streamAIResponse(history, message, summary);

  // Get the text promise BEFORE converting to response
  const finalTextPromise = streamResult.text;

  // Convert to streaming Response
  const streamResponse = streamResult.toTextStreamResponse({
    headers: {
      'Content-Type': 'text/plain',
      'transfer-encoding': 'chunked',
      'content-encoding': 'identity',
    },
  });

  return {
    streamResponse,
    finalTextPromise,
  };
}