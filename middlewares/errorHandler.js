import { createAppError } from "../utils/createAppError.js";

export function notFoundHandler(req, res, next) {
  return next(createAppError(404, "Route not found", "router"));
}

//eslint-disable-next-line
export function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: "error",
    errors: Array.isArray(err.errors)
      ? err.errors
      : [
          {
            type: err.type || "general",
            message: err.message?.trim() || "Internal server error.",
          },
        ],
  });
}
