import React from 'react';
import DashboardStats from '../components/recruiter/DashboardStats';
import CandidateSearch from '../components/recruiter/CandidateSearch';
import PostJobForm from '../components/recruiter/PostJobForm';
import SkillsChart from '../components/recruiter/SkillsChart';
import '../components/recruiter/recruiter.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Recruiter Dashboard</h1>
      <DashboardStats />
      <div className="dashboard-grid">
        <div className="dashboard-main-content">
          <SkillsChart />
          <CandidateSearch />
        </div>
        <div className="dashboard-sidebar">
          <PostJobForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;