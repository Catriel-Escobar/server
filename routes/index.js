import express from 'express';
import userRoutes from './user.routes.js';
import paymentRoutes from './payment.routes.js';
import productRoutes from './product.routes.js';
import mesaRoutes from './mesa.routes.js';
import orderRoutes from './order.routes.js';
// import productRoutes from './product.routes.js';
// import authRoutes from './auth.routes.js';

const router = express.Router();

// Ruta de prueba
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date(),
  });
});

// Configurar rutas específicas
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/products', productRoutes);
router.use('/mesas', mesaRoutes);
router.use('/orders', orderRoutes);
// router.use('/products', productRoutes);
// router.use('/auth', authRoutes);

export default router;
