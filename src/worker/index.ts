import { handleChatPOST } from './routes';

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const userId = request.headers.get('x-user-id') || 'default';

    if (url.pathname.startsWith('/chat') && request.method === 'POST') {
      return handleChatPOST(request, env, userId);
    }

    if (url.pathname.startsWith('/chat/history') && request.method === 'GET') {
      // Directly fetch history from DO for this user
      const id = env.CHAT_HISTORY.idFromName(userId);
      const stub = env.CHAT_HISTORY.get(id);
      return stub.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
}
