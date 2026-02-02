
import express from 'express';
const router = express.Router();
import { getAIChatResponse } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

// Open to protected users only to prevent abuse
router.post('/chat', protect, getAIChatResponse);

export default router;
