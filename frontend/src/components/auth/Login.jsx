import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser, clearError } from "../../features/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const errorShownRef = useRef(false);
  const lastErrorTimeRef = useRef(null);

  const dispatch = useDispatch();
  const { isLoading, error, lastErrorTime } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Only show error toast if:
    // 1. There's an actual error
    // 2. It's a new error (different timestamp)
    // 3. We haven't shown this error already
    if (
      error &&
      lastErrorTime &&
      lastErrorTime !== lastErrorTimeRef.current &&
      !errorShownRef.current
    ) {
      toast.error(error);
      errorShownRef.current = true;
      lastErrorTimeRef.current = lastErrorTime;

      // Clear the error after showing toast
      setTimeout(() => {
        dispatch(clearError());
        errorShownRef.current = false;
      }, 100);
    }
  }, [error, lastErrorTime, dispatch]);

  // Reset error shown flag when error is cleared
  useEffect(() => {
    if (!error) {
      errorShownRef.current = false;
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error shown flag before new login attempt
    errorShownRef.current = false;

    try {
      const result = await dispatch(loginUser(formData));
      if (result.type === "auth/login/fulfilled") {
        toast.success("🎉 Welcome back to Excel Analytics!", {
          duration: 2000,
        });
      }
    } catch (error) {
      // Error will be handled by useEffect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <svg
              className="h-10 w-10 text-white"
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
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 font-medium">
            Sign in to your Excel Analytics Platform
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Secure Authentication
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
              AI-Powered Analytics
            </span>
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                📧 Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                🔒 Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>🚀 Sign In to Dashboard</>
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Create one here →
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></span>
              HTTP-Only Cookies
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
              End-to-End Encryption
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
              GDPR Compliant
            </span>
          </div>
          <p className="text-xs text-gray-500">
            🔐 Your data is secure and protected with enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
