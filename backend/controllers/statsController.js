import Job from '../models/Job.js';
import Application from '../models/Application.js';
import mongoose from 'mongoose';

// @desc    Get main dashboard stats (KPIs)
// @route   GET /api/stats/dashboard
// @access  Private/Recruiter
const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ recruiter: recruiterId }).select('_id');
    const jobIds = jobs.map(job => job._id);

    const totalJobs = jobIds.length;
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

    const avgScoreResult = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: null, avgScore: { $avg: '$score_match' } } }
    ]);
    
    const averageScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

    res.json({
      totalJobs,
      totalApplications,
      averageScore: averageScore.toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get data for top required skills chart
// @route   GET /api/stats/skills-chart
// @access  Private/Recruiter
const getSkillsChartData = async (req, res) => {
  try {
    const skillsData = await Job.aggregate([
      { $match: { recruiter: req.user._id } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);
    res.json(skillsData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getDashboardStats, getSkillsChartData };