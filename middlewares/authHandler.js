import { createAppError } from '../utils/createAppError.js';
import { verifyToken } from '../utils/jwt.js';

export function authMiddleware(allowedRoles = ['user']) {
  return async (req, res, next) => {
    try {
      // aceptar token desde cookie o headers (Authorization / x-access-token)
      let token = req.cookies?.token || req.headers.authorization || req.headers['x-access-token'] || null;
      if (typeof token === 'string' && token.toLowerCase().startsWith('bearer ')) {
        token = token.slice(7);
      }
      if (!token) {
        return next(createAppError(401, 'Authorization denied', 'auth'));
      }

      const decoded = await verifyToken(token);
      req.user = decoded;

      if (!allowedRoles.includes(decoded.role)) {
        return next(createAppError(403, 'Insufficient permissions', 'auth'));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

// Middleware específico para verificar que el usuario sea ADMIN
export function adminMiddleware(req, res, next) {
  return authMiddleware(['ADMIN'])(req, res, next);
}

export async function authHandler(req, res, next) {
  // DEBUG: saber cuándo se invoca y qué llega
  console.log('--- authHandler invoked ---', { method: req.method, url: req.originalUrl });

  try {
    console.log('>>> incoming headers (subset):', {
      authorization: req.headers.authorization,
      'x-access-token': req.headers['x-access-token'],
      cookie: req.headers.cookie,
    });

    let raw = req.headers.authorization || req.headers['x-access-token'] || null;
    console.log('>>> raw token header:', raw);

    if (!raw) {
      console.warn('authHandler: no token header found');
      return next(createAppError(401, 'Authorization denied', 'auth'));
    }

    // quitar "Bearer " si existe
    let token = raw;
    if (typeof raw === 'string' && raw.toLowerCase().startsWith('bearer ')) {
      token = raw.slice(7);
    }
    console.log('>>> token after strip:', token ? `${token.slice(0,10)}...` : null);

    let decoded;
    try {
      decoded = await verifyToken(token);
    } catch (verifyErr) {
      console.error('authHandler: verifyToken failed:', verifyErr?.message || verifyErr);
      return next(createAppError(401, 'Authorization denied', 'auth'));
    }

    console.log('>>> token decoded:', { id: decoded?.id, email: decoded?.email, role: decoded?.role });

    req.user = decoded;

    if (!['user', 'ADMIN'].includes(decoded.role))
      return next(createAppError(403, 'Insufficient permissions', 'auth'));

    next();
  } catch (err) {
    console.error('authHandler unexpected error:', err);
    next(err);
  }
}
