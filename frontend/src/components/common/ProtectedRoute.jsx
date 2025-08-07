import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * A route guard component.
 * @param {object} props
 * @param {object} props.user - The current user object. If null, user is not logged in.
 * @param {('candidate'|'recruiter')} [props.role] - The required role to access the route.
 * @param {React.ReactNode} props.children - The component to render if authorized.
 */
const ProtectedRoute = ({ user, role, children }) => {
  const location = useLocation();

  // 1. Check if user is logged in
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back there after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if the route requires a specific role and if the user has it
  if (role && user.role !== role) {
    // User is logged in but doesn't have the required role.
    // Redirect them to the home page.
    return <Navigate to="/" replace />;
  }

  // 3. If all checks pass, render the requested component
  return children;
};

export default ProtectedRoute;