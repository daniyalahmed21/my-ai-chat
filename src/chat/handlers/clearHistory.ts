export async function clearHistory(state: DurableObjectState) {
  await state.storage.delete('messages');
  return Response.json({ status: "cleared" });
}
