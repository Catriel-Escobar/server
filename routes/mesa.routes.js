import express from 'express';
import {
  createMesa,
  getMesas,
  getMesaById,
  updateMesa,
  deleteMesa,
} from '../controllers/mesa.controller.js';
import { adminMiddleware } from '../middlewares/authHandler.js';

const router = express.Router();

router.get('/', getMesas);
router.get('/:id', getMesaById);
router.post('/', adminMiddleware, createMesa);
router.put('/:id', adminMiddleware, updateMesa);
router.delete('/:id', adminMiddleware, deleteMesa);

export default router;
