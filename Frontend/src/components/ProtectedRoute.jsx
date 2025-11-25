import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticating } = useAuth();
  const location = useLocation();

  if (isAuthenticating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Checking access...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;


