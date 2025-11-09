import express from 'express';
import userController from '../controllers/user.controller.js';
import { adminMiddleware } from '../middlewares/authHandler.js';

const router = express.Router();

// Rutas públicas de autenticación
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

// Rutas para usuarios - Solo accesibles para usuarios con role ADMIN
router.get('/', adminMiddleware, userController.getAllUsers);
router.get('/:id', adminMiddleware, userController.getUserById);
router.get('/email/:email', adminMiddleware, userController.getUserByEmail);
router.post('/', adminMiddleware, userController.createUser);
router.put('/:id', adminMiddleware, userController.updateUser);
router.delete('/:id', adminMiddleware, userController.deleteUser);

export default router;
