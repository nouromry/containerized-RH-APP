import React from 'react';
import JobList from '../components/jobs/JobList';

const Home = ({ user, savedJobIds, onToggleSave }) => {
  return (
    <div>
      <JobList user={user} savedJobIds={savedJobIds} onToggleSave={onToggleSave} />
    </div>
  );
};

export default Home;