import cors from 'cors';
import { corsConfig } from '../config/cors/cors.js';

// Middleware de CORS que usa la configuración unificada
export function corsHandler(req, res, next) {
  // ...existing code...
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  // Si hay credenciales, ajusta Access-Control-Allow-Origin y Access-Control-Allow-Credentials en consecuencia
  if (req.method === "OPTIONS") {
    // responder preflight inmediatamente
    return res.sendStatus(204);
  }
  next();
}
