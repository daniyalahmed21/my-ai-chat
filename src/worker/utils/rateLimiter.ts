export async function checkRateLimit(env: Env, userId: string) {
  const { success } = await env.MY_RATE_LIMITER.limit({ key: userId });
  if (!success) {
    throw new Error('RATE_LIMIT_EXCEEDED');
  }
}
