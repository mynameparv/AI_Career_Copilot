
import express from 'express';
const router = express.Router();
import {
    getProjects,
    createProject,
    generateProjectRoadmap,
    updateProject,
    deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/generate').post(protect, generateProjectRoadmap);
router.route('/:id').put(protect, updateProject).delete(protect, deleteProject);

export default router;
