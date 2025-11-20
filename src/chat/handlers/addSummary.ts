export async function addSummary(state: DurableObjectState, request: Request) {
  const { summary } = await request.json<{ summary: string }>();
  await state.storage.put("summary", summary);
  return new Response(JSON.stringify({ ok: true }));
}