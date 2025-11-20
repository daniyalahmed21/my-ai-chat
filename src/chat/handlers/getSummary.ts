export async function getSummary(state: DurableObjectState) {
	const summary = await state.storage.get<string>('summary');
	return new Response(JSON.stringify({ summary }));
}
