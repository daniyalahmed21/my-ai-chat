export async function getHistory(state: DurableObjectState) {
	const history = (await state.storage.get<string[]>('messages')) || [];
	return Response.json({ history });
}
