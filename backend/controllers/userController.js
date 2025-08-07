import Application from '../models/Application.js';
import User from '../models/User.js'; // Import User model
import Job from '../models/Job.js';   // Import Job model
import sendEmail from '../utils/sendEmail.js'; // Import email utility
// @desc    Get a candidate's application history
// @route   GET /api/users/applications
// @access  Private/Candidate
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company_name location') // Populate job details
      .lean();

    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Invite a candidate for an interview or test
// @route   POST /api/users/invite
// @access  Private/Recruiter
const inviteCandidate = async (req, res) => {
  const { candidateId, jobId, inviteType, details } = req.body;

  try {
    const candidate = await User.findById(candidateId);
    const job = await Job.findById(jobId);

    if (!candidate || !job) {
      return res.status(404).json({ message: 'Candidate or Job not found' });
    }

    let subject, html;

    if (inviteType === 'test') {
      subject = `Technical Test Invitation for the ${job.title} position`;
      html = `
        <p>Hello ${candidate.name},</p>
        <p>Following your application for the <strong>${job.title}</strong> position at <strong>${job.company_name}</strong>, we would like to invite you to complete a technical test.</p>
        <p>Please complete the test by the following date: <strong>${new Date(details.date).toLocaleDateString()}</strong>.</p>
        <p>Further instructions for the test will be sent in a separate email.</p>
        <p>Best regards,</p>
        <p>The ${job.company_name} Hiring Team</p>
      `;
    } else if (inviteType === 'interview') {
      subject = `Interview Invitation for the ${job.title} position`;
      if (details.interviewType === 'online') {
        html = `
          <p>Hello ${candidate.name},</p>
          <p>We were impressed with your application for the <strong>${job.title}</strong> position and would like to invite you for an online interview.</p>
          <p>Please join us using the following link: <a href="${details.link}">${details.link}</a></p>
          <p>Best regards,</p>
          <p>The ${job.company_name} Hiring Team</p>
        `;
      } else { // In-person
        html = `
          <p>Hello ${candidate.name},</p>
          <p>We were impressed with your application for the <strong>${job.title}</strong> position and would like to invite you for an in-person interview.</p>
          <p>The interview will be held at our office located at <strong>${job.location}</strong>.</p>
          <p>Your scheduled time is: <strong>${details.time}</strong>.</p>
          <p>Best regards,</p>
          <p>The ${job.company_name} Hiring Team</p>
        `;
      }
    } else {
      return res.status(400).json({ message: 'Invalid invitation type' });
    }

    await sendEmail({
      to: candidate.email,
      subject,
      html
    });

    res.status(200).json({ message: 'Invitation sent successfully' });

  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Server error while sending invitation' });
  }
};


// @desc    Add or remove a job from saved jobs
// @route   POST /api/users/save-job
// @access  Private/Candidate
const toggleSaveJob = async (req, res) => {
  const { jobId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const jobIndex = user.savedJobs.indexOf(jobId);

  if (jobIndex > -1) {
    // Job is already saved, so remove it
    user.savedJobs.splice(jobIndex, 1);
  } else {
    // Job is not saved, so add it
    user.savedJobs.push(jobId);
  }

  await user.save();
  res.json({ savedJobs: user.savedJobs });
};

// @desc    Get all saved jobs for a user
// @route   GET /api/users/saved-jobs
// @access  Private/Candidate
const getSavedJobs = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedJobs',
    model: 'Job'
  });

  if (user) {
    res.json(user.savedJobs);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export { getMyApplications, inviteCandidate, toggleSaveJob, getSavedJobs };