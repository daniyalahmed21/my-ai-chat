import { AIService } from "./services/ai-service";
import { ChatService } from "./services/chat-service";
import { validateMessage } from "./utils/messageValidator";
import { buildPrompt } from "./utils/promptBuilder";
import { checkRateLimit } from "./utils/rateLimiter";
import { getAIStream } from "./utils/streaming";

export async function handleChatPOST(
  request: Request,
  env: Env,
  userId: string
) {
  try {
    // 🔹 Rate limiting
    await checkRateLimit(env, userId);

    // 🔹 Validate user input
    const { message } = (await request.json()) as { message: string };
    validateMessage(message);

    const chat = new ChatService(env, userId);
    const ai = new AIService(env);

    // Save user message
    await chat.addMessage(message);

    // Load chat history & summary
    const history = await chat.getHistory();
    const summary = await chat.getSummary();

    // -----------------------------
    // 🔹 STREAMING AI RESPONSE
    // -----------------------------
    const { streamResponse, finalTextPromise } = await getAIStream(
      ai,
      history,
      message,
      summary || undefined
    );

    // ✅ Use waitUntil to save final response without blocking the stream
    if (env.ctx?.waitUntil) {
      env.ctx.waitUntil(
        (async () => {
          try {
            const finalText = await finalTextPromise;
            await chat.addMessage(finalText);

            // Generate and save new summary
            const updatedHistory = await chat.getHistory();
            const messages = buildPrompt(updatedHistory, finalText, summary || undefined);
            const newSummary = await ai.generateSummary(messages.map((m) => m.content));
            await chat.saveSummary(newSummary);
          } catch (error) {
            console.error('Error saving AI response:', error);
          }
        })()
      );
    } else {
      // Fallback for environments without waitUntil (like local dev)
      finalTextPromise.then(async (finalText) => {
        try {
          await chat.addMessage(finalText);
          const updatedHistory = await chat.getHistory();
          const messages = buildPrompt(updatedHistory, finalText, summary || undefined);
          const newSummary = await ai.generateSummary(messages.map((m) => m.content));
          await chat.saveSummary(newSummary);
        } catch (error) {
          console.error('Error saving AI response:', error);
        }
      });
    }

    return streamResponse;
  } catch (err) {
    console.error('handleChatPOST error:', err);
    return new Response('Internal Error', { status: 500 });
  }
}