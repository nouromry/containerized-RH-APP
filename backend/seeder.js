import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Application.deleteMany();
    await Job.deleteMany();
    await User.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    
    // Get the recruiter user to assign jobs to them
    const recruiterUser = createdUsers.find(user => user.role === 'recruiter');

    // Create sample jobs assigned to the recruiter
    const sampleJobs = [
        { title: 'Frontend Developer', description: 'Develop amazing UIs.', requiredSkills: ['React', 'CSS'], recruiter: recruiterUser._id },
        { title: 'Backend Engineer', description: 'Build scalable APIs.', requiredSkills: ['Node.js', 'MongoDB', 'Express'], recruiter: recruiterUser._id },
        { title: 'Full Stack Engineer', description: 'Work on both frontend and backend.', requiredSkills: ['React', 'Node.js', 'SQL'], recruiter: recruiterUser._id },
    ];

    await Job.insertMany(sampleJobs);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Application.deleteMany();
    await Job.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}