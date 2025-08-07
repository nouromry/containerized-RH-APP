import React, { useState, useEffect } from 'react';
import { getSavedJobs } from '../services/userService';
import JobCard from '../components/jobs/JobCard';

const SavedJobs = ({ savedJobIds, onToggleSave }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const data = await getSavedJobs();
        setSavedJobs(data);
      } catch (error) {
        console.error("Failed to fetch saved jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [savedJobIds]); // Re-fetches when the list of saved IDs changes

  return (
    <div className="job-list-container">
      <h1 style={{marginBottom: '2rem'}}>My Saved Jobs</h1>
      {loading && <p>Loading saved jobs...</p>}
      {!loading && savedJobs.length === 0 && <p>You have not saved any jobs yet.</p>}
      {!loading && savedJobs.map(job => (
        <JobCard 
          key={job._id} 
          job={job}
          isSaved={savedJobIds.has(job._id)}
          onToggleSave={onToggleSave}
          user={{ role: 'candidate' }} // Pass user prop to show save button
        />
      ))}
    </div>
  );
};

export default SavedJobs;