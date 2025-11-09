/**
 * Errores estandarizados para la API
 */

// Clase base para errores de la API
class ApiError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error 400: Bad Request
class BadRequestError extends ApiError {
  constructor(message = 'Solicitud inválida', errorCode = 'BAD_REQUEST') {
    super(message, 400, errorCode);
  }
}

// Error 401: Unauthorized
class UnauthorizedError extends ApiError {
  constructor(message = 'No autorizado', errorCode = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

// Error 403: Forbidden
class ForbiddenError extends ApiError {
  constructor(message = 'Acceso prohibido', errorCode = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

// Error 404: Not Found
class NotFoundError extends ApiError {
  constructor(message = 'Recurso no encontrado', errorCode = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

// Error 409: Conflict
class ConflictError extends ApiError {
  constructor(message = 'Conflicto con el estado actual', errorCode = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

// Error 422: Unprocessable Entity
class ValidationError extends ApiError {
  constructor(message = 'Error de validación', errorCode = 'VALIDATION_ERROR', details = null) {
    super(message, 422, errorCode);
    this.details = details;
  }
}

// Error 500: Internal Server Error
class InternalServerError extends ApiError {
  constructor(message = 'Error interno del servidor', errorCode = 'INTERNAL_SERVER_ERROR') {
    super(message, 500, errorCode);
  }
}

// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.errorCode,
        ...(err.details && { details: err.details }),
      },
    });
  }

  // Error no controlado
  return res.status(500).json({
    success: false,
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};

export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  errorHandler,
};