import express from 'express';
import {
  actualizarEstado,
  createOrder,
  createOrderDB,
  getPedidos,
  receiveWebhook,
  success,
  getTodayPayments,
} from '../controllers/payment.controller.js';
import { authHandler } from "../middlewares/authHandler.js"

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/create-order-db', createOrderDB);
router.get('/create-order-db', getPedidos);
router.patch('/create-order-db/:id', actualizarEstado);
router.get('/success', success);

router.get('/failure', (req, res) => res.json({ message: 'Failure' }));

router.get('/pending', (req, res) => res.json({ message: 'Pending' }));

router.post('/webhook', receiveWebhook);

router.get("/today", authHandler, getTodayPayments);

export default router;
