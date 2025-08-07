import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job',
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  resume: { type: String, required: true },
  
  // --- THIS IS THE CORRECTED LINE ---
  // Changed minimum allowed score from 1 to 0
  score_match: { type: Number, required: true, min: 0, max: 10 },

}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;