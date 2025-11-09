import express from 'express';
import { authHandler } from '../middlewares/authHandler.js';
import { getPedidos } from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/', authHandler, getPedidos);

export default router;