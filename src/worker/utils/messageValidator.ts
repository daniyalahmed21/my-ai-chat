export function validateMessage(message: unknown) {
  if (!message || typeof message !== 'string') {
    throw new Error('INVALID_MESSAGE');
  }
}
