export function createAppError(status, message, type = 'general', errors = null) {
  const err = new Error(message);
  err.status = status;
  err.type = type;
  err.errors = errors || [{ type, message }];
  return err;
}
