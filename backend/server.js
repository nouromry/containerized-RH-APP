import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import './config/config.js'; // --- NEW: Import this FIRST ---

// This now loads the .env file from the local /backend directory
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => res.status(200).send('OK'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Make uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome route
app.get('/api', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));