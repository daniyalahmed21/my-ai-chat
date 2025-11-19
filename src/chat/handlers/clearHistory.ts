export async function clearHistory(state: DurableObjectState) {
  await state.storage.deleteAll();
  return new Response(JSON.stringify({ ok: true }));
}