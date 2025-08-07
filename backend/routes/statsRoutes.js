import express from 'express';
import { getDashboardStats, getSkillsChartData } from '../controllers/statsController.js';
import { protect, recruiter } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/dashboard').get(protect, recruiter, getDashboardStats);
router.route('/skills-chart').get(protect, recruiter, getSkillsChartData);

export default router;