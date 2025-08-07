import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './common.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">DiceClone</Link>
      <ul className="navbar-links">
        {user ? (
          // Links for logged-in users
          <>
            <li><NavLink to="/">Jobs</NavLink></li>
            {user.role === 'recruiter' ? (
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            ) : (
              // Links for Candidates
              <>
                <li><NavLink to="/saved-jobs">Saved Jobs</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
              </>
            )}
            <li><button onClick={onLogout}>Logout</button></li>
          </>
        ) : (
          // Links for guests
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;