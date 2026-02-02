
import express from 'express';
const router = express.Router();
import { authUser, registerUser, googleAuth } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);

export default router;

