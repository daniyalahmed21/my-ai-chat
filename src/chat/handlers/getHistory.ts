export async function getHistory(state: DurableObjectState) {
  const all = await state.storage.list(); 
  const history: string[] = Array.from(all.values()).map(v => v as string);
  return new Response(JSON.stringify({ history }), {
    headers: { "Content-Type": "application/json" }
  });
}
