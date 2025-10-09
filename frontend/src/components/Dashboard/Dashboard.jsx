/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import { toast } from "react-hot-toast";

import FileUpload from "../Excel/FileUpload";
import FileList from "../Excel/FileList";
import ChartConfiguration from "../Excel/ChartConfiguration";
import UploadHistory from "../User/UploadHistory";

const Dashboard = ({ initialTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Determine active tab based on route or initialTab prop
  const getActiveTabFromRoute = () => {
    const path = location.pathname;
    switch (path) {
      case "/upload":
        return "upload";
      case "/files":
        return "files";
      case "/analyze":
        return "analyze";
      case "/history":
        return "history";
      default:
        return initialTab || "upload";
    }
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromRoute());
  const [currentFile, setCurrentFile] = useState(null);

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(getActiveTabFromRoute());
  }, [location.pathname, initialTab]);

  // Update URL when tab changes programmatically
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const routes = {
      upload: "/upload",
      files: "/files",
      analyze: "/analyze",
      history: "/history",
    };
    navigate(routes[tab] || "/", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success("👋 Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleFileSelect = (file) => {
    setCurrentFile(file);
    // Automatically switch to analyze tab when file is selected
    handleTabChange("analyze");
  };

  const tabs = [
    { id: "upload", label: "Upload File", icon: "📁" },
    { id: "files", label: "My Files", icon: "📋" },
    { id: "analyze", label: "Analyze & Chart", icon: "📊" },
    { id: "history", label: "Upload History", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Excel Analytics Platform
                </h1>
                <p className="text-sm text-gray-600">
                  Professional Data Analysis & Visualization
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    Welcome, {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Route Display */}
        {/* <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Current Section:</strong>{" "}
                {tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
                <span className="ml-2 text-blue-500">
                  (URL: {location.pathname})
                </span>
              </p>
            </div>
          </div>
        </div> */}

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "upload" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                📁 <span className="ml-2">Upload Excel File</span>
              </h2>
              <FileUpload onUploadSuccess={handleFileSelect} />

              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Platform Features:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-600">
                      Excel files (.xls, .xlsx)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-600">
                      Multiple sheets support
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-600">
                      Interactive 2D charts
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-600">
                      3D visualization
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-600">
                      Download charts (PNG/PDF)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span className="text-sm text-gray-600">
                      Upload history tracking
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">🤖</span>
                    <span className="text-sm text-gray-600">
                      AI-powered insights
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">🔒</span>
                    <span className="text-sm text-gray-600">
                      Secure authentication
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                📋 <span className="ml-2">My Files</span>
              </h2>
              <FileList onFileSelect={handleFileSelect} />
            </div>
          )}

          {activeTab === "analyze" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                📊 <span className="ml-2">Analyze & Chart</span>
              </h2>
              {currentFile ? (
                <ChartConfiguration file={currentFile} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No File Selected
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Please select a file from "My Files" tab to start analyzing.
                  </p>
                  <button
                    onClick={() => handleTabChange("files")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    📋 Go to My Files
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                📈 <span className="ml-2">Upload History</span>
              </h2>
              <UploadHistory />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
