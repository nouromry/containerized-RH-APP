import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { getJobs } from '../../services/jobService';
import JobCard from './JobCard';
import './jobs.css';

const JobList = ({ user, savedJobIds, onToggleSave }) => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ skills: '', location: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- WRAP fetchJobs in useCallback ---
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v)
      );
      const data = await getJobs(activeFilters);
      setJobs(data.jobs || []);
    } catch (err) {
      setError('Could not fetch jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Dependency is 'filters' because fetchJobs uses it

  // Initial fetch when component mounts
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]); // --- ADD fetchJobs to dependency array ---

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="job-list-container">
      <form className="job-filters" onSubmit={handleFilterSubmit}>
        <input 
          type="text" 
          name="skills"
          placeholder="Filter by skills (e.g., React, Node.js)" 
          value={filters.skills}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input 
          type="text" 
          name="location"
          placeholder="Filter by location (e.g., Tunis)" 
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <button type="submit" className="filter-button">Filter</button>
      </form>
      
      {isLoading && <p>Loading jobs...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="job-list-results">
        {!isLoading && jobs.length === 0 && <p>No jobs found matching your criteria.</p>}
        {jobs.map(job => (
          <JobCard 
            key={job._id} 
            job={job} 
            isSaved={savedJobIds && savedJobIds.has(job._id)} 
            onToggleSave={onToggleSave}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default JobList;