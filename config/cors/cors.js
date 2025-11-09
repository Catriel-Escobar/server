import dotenv from 'dotenv';
dotenv.config();

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173', // Frontend local
  'https://proyecto-final-pp-4.vercel.app', // Frontend producción
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []), // URL adicional desde env
];

export const corsConfig = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
