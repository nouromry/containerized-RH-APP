import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JobDetail from './components/jobs/JobDetail';
import SavedJobs from './pages/SavedJobs';

import { setToken, getToken, removeToken } from './utils/token';
import { getSavedJobs } from './services/userService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  const fetchUserSavedJobs = useCallback(async () => {
    try {
      const savedJobsList = await getSavedJobs();
      setSavedJobIds(new Set(savedJobsList.map(job => job._id)));
    } catch (error) {
      console.error("Could not fetch saved jobs", error);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        if (decodedUser.role === 'candidate') {
          fetchUserSavedJobs();
        }
      } catch (error) {
        removeToken();
      }
    }
  }, [fetchUserSavedJobs]);

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
    if (userData.role === 'candidate') {
      fetchUserSavedJobs();
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setSavedJobIds(new Set());
  };
  
  const handleToggleSave = (jobId) => {
    const newSavedJobIds = new Set(savedJobIds);
    if (newSavedJobIds.has(jobId)) {
      newSavedJobIds.delete(jobId);
    } else {
      newSavedJobIds.add(jobId);
    }
    setSavedJobIds(newSavedJobIds);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            {/* --- ALL ROUTES, INCLUDING THE MISSING ONES --- */}
            <Route path="/" element={<Home user={user} savedJobIds={savedJobIds} onToggleSave={handleToggleSave} />} />
            <Route path="/jobs/:jobId" element={<JobDetail user={user} savedJobIds={savedJobIds} onToggleSave={handleToggleSave} />} />
            
            {/* Add Login and Register routes and pass the handleLogin prop */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />

            {/* Candidate Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute user={user} role="candidate">
                  <Profile user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/saved-jobs" 
              element={
                <ProtectedRoute user={user} role="candidate">
                  <SavedJobs savedJobIds={savedJobIds} onToggleSave={handleToggleSave} />
                </ProtectedRoute>
              } 
            />

            {/* Recruiter Protected Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={user} role="recruiter">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;