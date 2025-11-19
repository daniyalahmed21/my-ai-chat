export async function addMessage(state: DurableObjectState, request: Request) {
  const { message } = await request.json<{ message: string }>();
  await state.storage.put(crypto.randomUUID(), message);

  // Trim to last 10 messages
  const all = await state.storage.list();
  const entries = Array.from(all.entries());

  if (entries.length > 50) {
  const toDelete = entries.slice(0, entries.length - 50);
  for (const [key] of toDelete) await state.storage.delete(key);
}

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
