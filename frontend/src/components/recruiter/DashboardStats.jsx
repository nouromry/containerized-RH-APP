import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './recruiter.css';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats/dashboard');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  return (
    <div className="stats-container">
      <div className="stat-card">
        <p className="stat-number">{stats.totalJobs}</p>
        <p className="stat-label">Jobs Posted</p>
      </div>
      <div className="stat-card">
        <p className="stat-number">{stats.totalApplications}</p>
        <p className="stat-label">Total Applications</p>
      </div>
      <div className="stat-card">
        <p className="stat-number">{stats.averageScore}</p>
        <p className="stat-label">Avg. Match Score</p>
      </div>
    </div>
  );
};

export default DashboardStats;