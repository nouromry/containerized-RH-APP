import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobById } from '../../services/jobService';
import ApplyButton from './ApplyButton'; // CORRECTED PATH
import './jobs.css';                   // CORRECTED PATH

const JobDetail = ({ user }) => {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { jobId } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (err) {
        setError('Job not found.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (isLoading) return <p style={{ textAlign: 'center' }}>Loading job details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!job) return null;

  return (
    <div className="job-detail-container">
      <div className="job-detail-header">
        <h1>{job.title}</h1>
        <p>{job.company_name} · {job.location}</p>
      </div>

      <div className="job-detail-grid">
        <div className="job-detail-main">
          <div className="detail-section">
            <h3>Job Description</h3>
            <p className="job-description-text">{job.description}</p>
          </div>

          <div className="detail-section">
            <h3>Required Skills</h3>
            <div className="skills-container">
              {job.requiredSkills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {job.soft_skills && job.soft_skills.length > 0 && (
             <div className="detail-section">
              <h3>Soft Skills</h3>
              <div className="skills-container">
                {job.soft_skills.map((skill, index) => (
                  <span key={index} className="skill-tag soft-skill">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="job-detail-sidebar">
          <div className="sidebar-card">
            <h3>Job Overview</h3>
            <ul>
              <li><strong>Experience:</strong> {job.experience_level}</li>
              <li><strong>Job Type:</strong> {job.job_type}</li>
              {job.salary_range && <li><strong>Salary:</strong> {job.salary_range}</li>}
              <li><strong>Field:</strong> {job.company_field}</li>
            </ul>
            {user?.role === 'candidate' && <ApplyButton jobId={job._id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;