/* eslint-disable no-undef */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { getCurrentUser, forceInitialize } from "./features/authSlice";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminPanel from "./components/Admin/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, initialized, authCheckAttempted } =
    useSelector((state) => state.auth);

  useEffect(() => {
    let timeoutId;

    const initializeAuth = async () => {
      if (!initialized && !authCheckAttempted) {
        console.log("🚀 Starting authentication check...");

        // Set a fallback timeout
        timeoutId = setTimeout(() => {
          console.warn(
            "⚠️ Auth check taking too long, forcing initialization..."
          );
          dispatch(forceInitialize());
        }, 15000); // 15 seconds max

        try {
          await dispatch(getCurrentUser());
        } catch (error) {
          console.error("Auth error:", error);
          dispatch(forceInitialize());
        }

        clearTimeout(timeoutId);
      }
    };

    initializeAuth();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dispatch, initialized, authCheckAttempted]);

  // Show loading screen while checking authentication
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Debug info in development */}
       {/* eslint-disable-next-line no-undef */}
        {/* {process.env.NODE_ENV === "development" && (
          <div className="fixed top-0 right-0 bg-black text-white p-2 text-xs z-50">
            Auth: {isAuthenticated ? "✅" : "❌"} | Init:{" "}
            {initialized ? "✅" : "❌"} | Loading: {isLoading ? "⏳" : "✅"}
          </div>
        )} */}

        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? <Signup /> : <Navigate to="/" replace />
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="upload" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="files" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="analyze" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Dashboard initialTab="history" />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;
