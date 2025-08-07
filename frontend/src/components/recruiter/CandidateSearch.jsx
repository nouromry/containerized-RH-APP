import React, { useState, useEffect } from 'react';
import { getJobCandidates, getRecruiterJobs } from '../../services/jobService';
import api from '../../services/api';
import InviteModal from './InviteModal';
import './recruiter.css';

const CandidateSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for managing the invitation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Fetch the recruiter's jobs when the component loads
  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const recruiterJobs = await getRecruiterJobs(); 
        setJobs(recruiterJobs || []);
      } catch (error) {
        console.error("Failed to fetch recruiter jobs", error);
      }
    };
    fetchRecruiterJobs();
  }, []);

  // Fetch candidates when a job is selected from the dropdown
  useEffect(() => {
    if (!selectedJobId) {
      setCandidates([]);
      return;
    }
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const data = await getJobCandidates(selectedJobId);
        // Filter candidates with a score > 6 as required
        const filteredCandidates = data.filter(c => c.score_match && c.score_match > 6);
        setCandidates(filteredCandidates);
      } catch (error) {
        console.error("Failed to fetch candidates", error);
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, [selectedJobId]);

  // Handler to open the modal with the selected candidate's data
  const handleInviteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  // Handler to send the invitation data to the backend
  const handleSendInvite = async (inviteData) => {
    try {
      const { data } = await api.post('/users/invite', inviteData);
      setNotification({ message: data.message, type: 'success' });
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Failed to send invite', type: 'error' });
    } finally {
      setIsModalOpen(false);
      // Clear the notification message after 5 seconds
      setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    }
  };

  // Find the full job object for the selected job ID
  const selectedJob = jobs.find(job => job._id === selectedJobId);

  return (
    <>
      <div className="dashboard-card">
        <h2>Search Candidates (Match Score &gt; 6)</h2>
        
        <div className="job-selector-group">
          <label htmlFor="job-select">Select a job to see applicants</label>
          <div className="select-wrapper">
            <select 
              id="job-select" 
              value={selectedJobId} 
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              <option value="">-- Select a Job --</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>
        </div>

        {notification.message && (
          <div className={`form-message ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        {isLoading && <p>Loading candidates...</p>}

        {!isLoading && selectedJobId && candidates.length > 0 && (
          <ul className="candidate-list">
            {candidates.map(candidate => (
              <li key={candidate._id} className="candidate-item">
                <div className="candidate-info">
                  <p className="candidate-name">{candidate.applicant.name}</p>
                  <p className="candidate-email">{candidate.applicant.email}</p>
                </div>
                <div className="candidate-actions">
                  <span className="candidate-score">{candidate.score_match}/10</span>
                  
                  <a 
                    href={candidate.resume} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="download-button"
                    title="Download Resume"
                  >
                    CV
                  </a>
                  
                  <button className="invite-button" onClick={() => handleInviteClick(candidate)}>
                    Invite
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && selectedJobId && candidates.length === 0 && (
          <p>No candidates with a match score above 6 for this job yet.</p>
        )}
      </div>
      
      {isModalOpen && (
        <InviteModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          candidate={selectedCandidate}
          job={selectedJob}
          onInvite={handleSendInvite}
        />
      )}
    </>
  );
};

export default CandidateSearch;