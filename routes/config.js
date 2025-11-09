import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL
export const SCHEMA = process.env.SCHEMA || 'public'
export const NODE_ENV = process.env.NODE_ENV 
export const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN
export const MERCADOPAGO_BASE_URL = process.env.MERCADOPAGO_BASE_URL
export const MERCADOPAGO_NOTIFY_URL = process.env.MERCADOPAGO_NOTIFY_URL
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';