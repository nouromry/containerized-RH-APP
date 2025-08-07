import Job from '../models/Job.js';
import Application from '../models/Application.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// We have REMOVED the cloudinary.config({...}) block from here to fix the loading error.

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res) => {
  const { 
    title, description, requiredSkills: rawRequiredSkills, company_name, company_field,
    company_logo, location, job_type, experience_level, salary_range, soft_skills: rawSoftSkills
  } = req.body;

  const requiredSkills = rawRequiredSkills ? rawRequiredSkills.filter(skill => skill && skill.trim() !== '') : [];
  const soft_skills = rawSoftSkills ? rawSoftSkills.filter(skill => skill && skill.trim() !== '') : [];

  const job = new Job({
    title,
    description,
    company_name,
    company_field,
    company_logo,
    location,
    job_type,
    experience_level,
    salary_range,
    requiredSkills,
    soft_skills,
    recruiter: req.user._id,
  });

  try {
    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating job' });
  }
};

// @desc    Get all jobs with optional filters and application counts
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  const { skills, location } = req.query;
  const matchQuery = {};

  if (skills) {
    const skillsRegex = skills.split(',').map(skill => new RegExp(skill.trim(), 'i'));
    matchQuery.requiredSkills = { $in: skillsRegex };
  }

  if (location) {
    matchQuery.location = { $regex: location, $options: 'i' };
  }

  try {
    const jobs = await Job.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'applications'
        }
      },
      {
        $addFields: {
          applicationCount: { $size: '$applications' }
        }
      },
      {
        $project: {
          applications: 0
        }
      }
    ]);
    
    res.json({ jobs });

  } catch (error) {
    console.error("Error fetching jobs with counts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Candidate
const applyToJob = async (req, res) => {
  const jobId = req.params.id;
  const applicantId = req.user._id;

  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Only candidates can apply for jobs' });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const alreadyApplied = await Application.findOne({ job: jobId, applicant: applicantId });
  if (alreadyApplied) {
    return res.status(400).json({ message: 'You have already applied for this job' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required' });
  }

  try {
    // --- THIS IS THE FIX ---
    // Configure Cloudinary right before using it to ensure .env variables are loaded.
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // 1. Upload resume to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'resumes',
      resource_type: 'raw',
    });
    const resumeUrl = cloudinaryResult.secure_url;

    // 2. Call the AI Service for scoring
    const form = new FormData();
    form.append('resume', fs.createReadStream(req.file.path));
    form.append('job_description', job.description);
    form.append('required_skills', JSON.stringify(job.requiredSkills));
    
    const aiServiceResponse = await axios.post('http://localhost:5001/api/score', form, {
      headers: { ...form.getHeaders() },
    });
    const { score } = aiServiceResponse.data;

    // 3. Save application to database with the Cloudinary URL
    const application = new Application({
      job: jobId,
      applicant: applicantId,
      resume: resumeUrl,
      score_match: score,
    });
    await application.save();

    // 4. Clean up the temporary local file
    fs.unlinkSync(req.file.path);
    
    res.status(201).json({ 
        message: 'Application submitted successfully',
        matchResult: aiServiceResponse.data 
    });

  } catch (error) {
    console.error('Error during application process:', error);
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error during application process' });
  }
};

// @desc    Get candidates for a specific job
// @route   GET /api/jobs/:id/candidates
// @access  Private/Recruiter
const getJobCandidates = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view candidates for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .lean();

    res.json(applications);
  } catch (error) {
    console.error('Server error in getJobCandidates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private/Recruiter
const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id });
  res.json(jobs);
};

export { createJob, getJobs, getJobById, applyToJob, getJobCandidates, getMyJobs };