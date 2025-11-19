export async function getSize(state: DurableObjectState) {
  const all = await state.storage.list(); 
  const size = all.size;

  return new Response(JSON.stringify({ size }), {
    headers: { "Content-Type": "application/json" }
  });
}
