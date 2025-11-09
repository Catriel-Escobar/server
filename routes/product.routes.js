import express from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { adminMiddleware } from '../middlewares/authHandler.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', adminMiddleware, createProduct);
router.put('/:id', adminMiddleware, updateProduct);
router.delete('/:id', adminMiddleware, deleteProduct);

export default router;
