import { addMessage } from './handlers/addMessage';
import { clearHistory } from './handlers/clearHistory';
import { getHistory } from './handlers/getHistory';
import { getSize } from './handlers/getSize';

export async function routeChat(state: DurableObjectState, request: Request) {
	const url = new URL(request.url);
	const path = url.pathname.replace(/\/+$/, '');
    const method = request.method.toUpperCase();

	switch (true) {
		case path === '/chat' && method === 'POST':
			return addMessage(state, request);

		case path === '/chat/history' && method === 'GET':
			return getHistory(state);

		case path === '/chat/history' && method === 'DELETE':
			return clearHistory(state);

		case path === '/chat/size':
			return getSize(state);

		default:
			return new Response('Not found', { status: 404 });
	}
}
