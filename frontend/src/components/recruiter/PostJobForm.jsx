import React, { useState } from 'react';
import { postJob } from '../../services/jobService';
import './recruiter.css';

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    company_field: '',
    location: '',
    job_type: 'Full-time',
    experience_level: 'Mid-level',
    salary_range: '',
    description: '',
    requiredSkills: '',
    soft_skills: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { title, company_name, company_field, location, job_type, experience_level, salary_range, description, requiredSkills, soft_skills } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const jobData = {
      ...formData,
      requiredSkills: requiredSkills.split(',').map(skill => skill.trim()),
      soft_skills: soft_skills.split(',').map(skill => skill.trim()),
    };

    try {
      await postJob(jobData);
      setMessage('Job posted successfully!');
      // Reset form
      setFormData({
        title: '', company_name: '', company_field: '', location: '', job_type: 'Full-time',
        experience_level: 'Mid-level', salary_range: '', description: '', requiredSkills: '', soft_skills: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Post a New Job</h2>
      <form className="post-job-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Job Title</label>
            <input name="title" value={title} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input name="company_name" value={company_name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={location} onChange={onChange} placeholder="e.g., San Francisco, CA" required />
          </div>
          <div className="form-group">
            <label>Company Field</label>
            <input name="company_field" value={company_field} onChange={onChange} placeholder="e.g., Enterprise Software" required />
          </div>
          <div className="form-group">
            <label>Job Type</label>
            <select name="job_type" value={job_type} onChange={onChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label>Experience Level</label>
            <select name="experience_level" value={experience_level} onChange={onChange}>
              <option>Entry-level</option>
              <option>Mid-level</option>
              <option>Senior</option>
              <option>Lead</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Salary Range (Optional)</label>
          <input name="salary_range" value={salary_range} onChange={onChange} placeholder="e.g., $120,000 - $150,000" />
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea name="description" value={description} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Required Skills (comma-separated)</label>
          <input name="requiredSkills" value={requiredSkills} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Soft Skills (comma-separated)</label>
          <input name="soft_skills" value={soft_skills} onChange={onChange} />
        </div>
        <button type="submit" className="form-button">Post Job</button>
        {message && <p className="form-message success">{message}</p>}
        {error && <p className="form-message error">{error}</p>}
      </form>
    </div>
  );
};

export default PostJobForm;