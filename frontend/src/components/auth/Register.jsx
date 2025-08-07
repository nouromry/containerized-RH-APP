import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import './auth.css';

const Register = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await register({ name, email, password, role });
      onLogin(token, user);
      // Redirect based on role after successful registration
      const redirectPath = user.role === 'recruiter' ? '/dashboard' : '/';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Sign up as a:</label>
          <div className="role-selector">
            <label>
              <input 
                type="radio" 
                name="role" 
                value="candidate" 
                checked={role === 'candidate'} 
                onChange={() => setRole('candidate')} 
              />
              <span className="role-option">Candidate</span>
            </label>
            <label>
              <input 
                type="radio" 
                name="role" 
                value="recruiter" 
                checked={role === 'recruiter'} 
                onChange={() => setRole('recruiter')} 
              />
              <span className="role-option">Recruiter</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="auth-button">Sign Up</button>
        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;