import { handleRequest } from "./worker/index";
export { ChatHistory } from "./chat/index";

export default {
  async fetch(request: Request, env: Env) {
    return handleRequest(request, env);
  }
};
