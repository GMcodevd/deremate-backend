import express from 'express';
import {
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController
} from '../controller/mate.controller.js';

import authMiddleware from '../middleware/authenticationToken.js';
import { upload } from '../middleware/uploadMiddleware.js'; // importamos multer

const router = express.Router();

// Rutas públicas
router.get('/', getAllProductsController);

// Rutas protegidas
// agregamos `upload.single('imageFile')`
router.post('/', authMiddleware, upload.single('imageFile'), createProductController);
router.put('/:id', authMiddleware, upload.single('imageFile'), updateProductController);
router.delete('/:id', authMiddleware, deleteProductController);

export default router;
