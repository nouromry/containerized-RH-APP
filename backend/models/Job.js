import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // --- NEW & UPDATED FIELDS ---
  company_name: { type: String, required: true },
  company_field: { type: String, required: true },
  company_logo: { type: String }, // URL to the logo
  location: { type: String, required: true },
  job_type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  experience_level: {
    type: String,
    required: true,
    enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead']
  },
  salary_range: { type: String },
  requiredSkills: [{ type: String, required: true }],
  soft_skills: [{ type: String }],
  
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;