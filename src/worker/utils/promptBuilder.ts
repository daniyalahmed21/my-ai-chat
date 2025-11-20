export function buildPrompt(history: string[], message: string, summary?: string) {
  const prompt: { role: string; content: string }[] = [
    { role: "system", content: "You are a helpful AI assistant." }
  ];

  if (summary) {
    prompt.push({
      role: "system",
      content: `Summary of previous conversation: ${summary}`
    });
  }

  history.forEach(msg => prompt.push({ role: "user", content: msg }));
  prompt.push({ role: "user", content: message });

  return prompt;
}

export function flattenPrompt(messages: { role: string; content: string }[]) {
  return messages.map(m => `${m.role}: ${m.content}`).join("\n");
}
