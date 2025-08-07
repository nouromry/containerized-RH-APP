import express from 'express';
import { 
  getMyApplications, 
  inviteCandidate,
  toggleSaveJob,   // --- NEW
  getSavedJobs     // --- NEW
} from '../controllers/userController.js';
import { protect, recruiter } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/applications').get(protect, getMyApplications);
router.route('/invite').post(protect, recruiter, inviteCandidate);

// --- NEW ROUTES ---
router.route('/save-job').post(protect, toggleSaveJob);
router.route('/saved-jobs').get(protect, getSavedJobs);

export default router;