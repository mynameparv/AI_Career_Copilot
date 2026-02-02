
import express from 'express';
import { analyzeResume } from '../controllers/resumeController.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js'; // Optional: Use if you want to protect this route

const router = express.Router();

// Route: POST /api/resume/analyze
// Uses 'file' as the key for the file upload
router.post('/analyze', upload.single('file'), analyzeResume);

export default router;
