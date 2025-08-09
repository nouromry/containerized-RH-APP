import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import {
  createJob,
  getJobs,
  getJobById,
  applyToJob,
  getJobCandidates,
  getMyJobs
} from '../controllers/jobController.js';
import { protect, recruiter } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `temp-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// --- THIS IS THE CORRECTED MIDDLEWARE ---
const renameFile = (req, res, next) => {
  // The 'protect' middleware runs first. If the user is not authenticated,
  // req.user will be undefined. We must stop the process here.
  if (!req.user) {
    // This can happen if the token is missing or invalid.
    return res.status(401).json({ message: 'Not authorized, no token or token failed' });
  }

  // Also, check if a file was actually uploaded.
  if (!req.file) {
    return next();
  }

  const newFilename = `resume-${req.user._id}-${Date.now()}${path.extname(req.file.originalname)}`;
  const newPath = path.join('uploads', newFilename);
  
  try {
    fs.renameSync(req.file.path, newPath);
    req.file.filename = newFilename;
    req.file.path = newPath;
    next();
  } catch (error) {
    console.error('Error renaming file:', error);
    next(error);
  }
};


// Define routes
router.route('/')
  .post(protect, recruiter, createJob)
  .get(getJobs);

router.route('/my-jobs').get(protect, recruiter, getMyJobs);

router.route('/:id')
  .get(getJobById);

router.route('/:id/apply')
  .post(protect, upload.single('resume'), renameFile, applyToJob);
  
router.route('/:id/candidates')
  .get(protect, recruiter, getJobCandidates);

export default router;