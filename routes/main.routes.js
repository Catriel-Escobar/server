import express from 'express';
import indexRoutes from './index.js';
import orderRoutes from './order.routes.js';

const router = express.Router();

// Configurar rutas principales
router.use('/', indexRoutes);
router.use('/orders', orderRoutes);

export default router;