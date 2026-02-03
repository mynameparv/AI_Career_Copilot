import express from 'express';
const router = express.Router();
import {
    getApplications,
    addApplication,
    updateApplication,
    deleteApplication,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getApplications).post(protect, addApplication);
router.route('/:id').put(protect, updateApplication).delete(protect, deleteApplication);

export default router;
