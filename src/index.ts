import handleRequest from './worker/index';
export { ChatHistory } from './chat/index';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handleRequest.fetch(request, env, ctx);
  },
};