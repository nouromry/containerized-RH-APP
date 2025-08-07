import React, { useState, useEffect } from 'react';
import JobCard from '../components/jobs/JobCard';
import api from '../services/api';

const profilePageStyles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
    },
    header: {
        color: '#333',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
    },
    content: {
        marginTop: '20px'
    }
};

const Profile = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/users/applications');
        setApplications(data);
      } catch (error) {
        console.error("Could not fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === 'candidate') {
        fetchApplications();
    }
  }, [user]);

  return (
    <div style={profilePageStyles.container}>
      <h1 style={profilePageStyles.header}>My Profile</h1>
      <div style={profilePageStyles.content}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h2 style={{...profilePageStyles.header, marginTop: '40px'}}>My Applications</h2>
      <div style={profilePageStyles.content}>
        {loading && <p>Loading applications...</p>}
        {!loading && applications.length === 0 && <p>You have not applied to any jobs yet.</p>}
        {!loading && applications.map(app => (
          app.job && <JobCard 
            key={app._id} 
            job={app.job} 
            score={app.score_match} 
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;