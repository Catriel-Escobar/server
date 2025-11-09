import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const SALT_ROUNDS = 10;

// Funciones de utilidad para autenticación
const authUtils = {
  // Hash de contraseña
  hashPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Error(`Error al hashear contraseña: ${error.message}`);
    }
  },

  // Verificar contraseña
  verifyPassword: async (password, hashedPassword) => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Error al verificar contraseña: ${error.message}`);
    }
  },

  // Generar token JWT
  generateToken: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    } catch (error) {
      throw new Error(`Error al generar token: ${error.message}`);
    }
  },

  // Verificar token JWT
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error(`Token inválido: ${error.message}`);
    }
  },
};

export default authUtils;
