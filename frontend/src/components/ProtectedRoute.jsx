import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, initialized, isLoading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Show loading while authentication is being determined
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login with current location as return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin permission
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
