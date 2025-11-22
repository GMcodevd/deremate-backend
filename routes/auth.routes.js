import express from 'express';
import authController from '../controller/auth.Controller.js';

const router = express.Router();


//router.post('/register', authController.registerController);
router.post('/login', authController.loginController)

export default router;