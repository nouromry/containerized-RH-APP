import React, { useState } from 'react';
import { applyToJob } from '../../services/jobService';
import './jobs.css';

const ApplyButton = ({ jobId }) => {
  const [showForm, setShowForm] = useState(false);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApplyClick = () => {
    setShowForm(!showForm);
    setMessage('');
    setError('');
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please select a resume to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      const response = await applyToJob(jobId, formData);
      setMessage(response.message || 'Application successful!');
      setError('');
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed.');
      setMessage('');
    }
  };

  return (
    <div className="apply-button-container">
      <button className="apply-button" onClick={handleApplyClick}>
        Easy Apply
      </button>

      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      {showForm && (
        <form className="apply-form" onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} required accept=".pdf,.doc,.docx" />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default ApplyButton;