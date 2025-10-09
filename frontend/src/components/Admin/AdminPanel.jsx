/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getAllUsers,
  toggleUserStatus,
  logoutUser,
} from "../../features/authSlice";

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, users, isLoading, error } = useSelector((state) => state.auth);

  const [isReady, setIsReady] = useState(false);

  // ✅ BULLETPROOF: Use localStorage to track fetch status
  const STORAGE_KEY = "admin_users_fetched";

  useEffect(() => {
    // ✅ Set ready flag after a short delay to ensure component is stable
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return; // Wait until component is ready

    const hasFetched = localStorage.getItem(STORAGE_KEY);

    console.log("🔍 [AdminPanel] Check fetch status:", {
      userRole: user?.role,
      hasFetched: !!hasFetched,
      usersLength: users?.length,
      isLoading,
      isReady,
    });

    // ✅ Only fetch if user is admin AND haven't fetched before AND not loading
    if (user?.role === "admin" && !hasFetched && !isLoading) {
      console.log("🚀 [AdminPanel] FETCHING USERS - Setting localStorage flag");

      // ✅ IMMEDIATELY set localStorage to prevent duplicate calls
      localStorage.setItem(STORAGE_KEY, "true");

      dispatch(getAllUsers())
        .unwrap()
        .then((users) => {
          console.log("✅ [AdminPanel] SUCCESS - Users loaded:", users?.length);
          toast.success(`✅ Loaded ${users?.length || 0} users`);
        })
        .catch((error) => {
          console.error("❌ [AdminPanel] ERROR:", error);
          toast.error("Failed to load users");
          // ✅ Remove localStorage flag on error so user can retry
          localStorage.removeItem(STORAGE_KEY);
        });
    }
  }, [user?.role, isReady, isLoading, dispatch]);

  // ✅ Manual refresh function
  const handleManualRefresh = () => {
    console.log("🔄 [AdminPanel] Manual refresh - Clearing localStorage");
    localStorage.removeItem(STORAGE_KEY); // Clear flag
    toast.loading("Refreshing users...", { id: "refresh" });

    dispatch(getAllUsers())
      .unwrap()
      .then((users) => {
        localStorage.setItem(STORAGE_KEY, "true"); // Set flag again
        toast.success(`✅ Refreshed - ${users?.length || 0} users`, {
          id: "refresh",
        });
      })
      .catch((error) => {
        console.error("❌ [AdminPanel] Manual refresh error:", error);
        toast.error("Failed to refresh", { id: "refresh" });
        localStorage.removeItem(STORAGE_KEY);
      });
  };

  // ✅ Clear storage when logging out
  const handleLogout = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await dispatch(logoutUser());
    toast.success("Logged out!");
    navigate("/login");
  };

  // ✅ Error handling
  useEffect(() => {
    if (error) {
      console.error("❌ [AdminPanel] Error state:", error);
      toast.error(error);
    }
  }, [error]);

  const handleToggleUserStatus = async (userId) => {
    try {
      await dispatch(toggleUserStatus(userId));
      toast.success("User status updated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // ✅ Access control
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            You need admin permissions to access this panel.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
            >
              📊 Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasFetched = localStorage.getItem(STORAGE_KEY);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">👑</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-gray-600">
                  Manage users and system settings
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Debug Status */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm">
                <div className="font-bold text-blue-800 mb-2">
                  🔧 System Status
                </div>
                <div className="space-y-1 text-blue-700">
                  <div>
                    👥 Users:{" "}
                    <span className="font-semibold">{users?.length || 0}</span>
                  </div>
                  <div>
                    ⚡ Loading:{" "}
                    <span className="font-semibold">
                      {isLoading ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    ✅ Fetched:{" "}
                    <span className="font-semibold">
                      {hasFetched ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    🏁 Ready:{" "}
                    <span className="font-semibold">
                      {isReady ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    👤 Role: <span className="font-semibold">{user?.role}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <span>{isLoading ? "⏳" : "🔄"}</span>
                <span>{isLoading ? "Loading..." : "Refresh Users"}</span>
              </button>

              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
              >
                📊 Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Users
                </h3>
                <p className="text-4xl font-bold text-blue-600">
                  {users?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Active Users
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {users?.filter((u) => u.isActive !== false)?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Admins
                </h3>
                <p className="text-4xl font-bold text-purple-600">
                  {users?.filter((u) => u.role === "admin")?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Users Management ({users?.length || 0} users)
            </h3>
          </div>

          <div className="p-8">
            {isLoading && users?.length === 0 ? (
              <div className="text-center py-16">
                <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                <p className="text-xl font-medium text-gray-700">
                  Loading users...
                </p>
                <p className="text-gray-500 mt-2">
                  Please wait while we fetch the user data
                </p>
              </div>
            ) : users?.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  No Users Found
                </h3>
                <p className="text-gray-600 mb-8">
                  Either there are no users in the system or they couldn't be
                  loaded.
                </p>
                <button
                  onClick={handleManualRefresh}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium"
                >
                  🔄 Try Loading Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((userItem) => (
                  <div
                    key={userItem._id}
                    className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {userItem.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {userItem.name}
                        </p>
                        <p className="text-gray-600">{userItem.email}</p>
                      </div>
                      <span
                        className={`px-4 py-2 text-sm font-medium rounded-full ${
                          userItem.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {userItem.role === "admin" ? "👑 Admin" : "👤 User"}
                      </span>
                      <span
                        className={`px-4 py-2 text-sm font-medium rounded-full ${
                          userItem.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {userItem.isActive !== false
                          ? "✅ Active"
                          : "❌ Inactive"}
                      </span>
                    </div>

                    {userItem._id !== user._id && (
                      <button
                        onClick={() => handleToggleUserStatus(userItem._id)}
                        className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          userItem.isActive !== false
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {userItem.isActive !== false
                          ? "🔒 Deactivate"
                          : "🔓 Activate"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
