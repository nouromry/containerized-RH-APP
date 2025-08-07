import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleSaveJob } from '../../services/userService';
import './jobs.css';

const JobCard = ({ job, score, isSaved, onToggleSave, user }) => {
  const navigate = useNavigate();

  const handleSaveClick = async (e) => {
    e.stopPropagation(); // Prevent card click from navigating
    
    // Ensure onToggleSave is a function before calling
    if (user && user.role === 'candidate' && typeof onToggleSave === 'function') {
      try {
        await toggleSaveJob(job._id);
        onToggleSave(job._id); // Update the state in App.js
      } catch (error) {
        console.error("Failed to save job", error);
        alert("Failed to save job. Please try again.");
      }
    }
  };

  const formatSalary = (salary) => {
    if (!salary || isNaN(parseInt(salary))) return salary;
    return `${parseInt(salary).toLocaleString()} TND`;
  };

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
      <div className="job-card-main-info">
        <div className="company-logo-placeholder">
          <i className="fas fa-briefcase fa-lg"></i>
        </div>
        <div className="job-card-title-area">
          <h3>{job.title}</h3>
          <p className="job-card-company">{job.company_name}</p>
        </div>
        
        {user?.role === 'candidate' && (
          <button onClick={handleSaveClick} className={`save-job-button ${isSaved ? 'saved' : ''}`} title={isSaved ? 'Unsave Job' : 'Save Job'}>
            <i className={isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
          </button>
        )}
      </div>

      <div className="job-card-details">
        <span className="job-tag"><i className="fas fa-map-marker-alt"></i> {job.location}</span>
        <span className="job-tag"><i className="fas fa-clock"></i> {job.job_type}</span>
        <span className="job-tag"><i className="fas fa-user-tie"></i> {job.experience_level}</span>
        {job.salary_range && <span className="job-tag"><i className="fas fa-coins"></i> {formatSalary(job.salary_range)}</span>}
        
        <span className="job-tag applicants">
          <i className="fas fa-users"></i>
          {job.applicationCount} {job.applicationCount === 1 ? 'Applicant' : 'Applicants'}
        </span>
      </div>

      {(score !== undefined && score !== null) && (
        <div className="job-card-match-container">
          <div className="job-card-match">
            <span className="score">{score}/10</span>
            <p>Your Match Score</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;