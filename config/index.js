import dotenv from 'dotenv';

dotenv.config();

// Configuración general de la aplicación
const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Configuración de la base de datos
  database: {
    url: process.env.DATABASE_URL,
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: '24h',
  },

  // Otras configuraciones
};

// CORS configuration is handled in config/cors/cors.js
export default config;
