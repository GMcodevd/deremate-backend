import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controller/mate.controller.js';

import authMiddleware from '../middleware/authenticationToken.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllProducts);

// Rutas protegidas
router.post('/', authMiddleware, upload.single('imageFile'), createProduct);
router.put('/:id', authMiddleware, upload.single('imageFile'), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
