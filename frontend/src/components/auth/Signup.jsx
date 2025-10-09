import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearError, signupUser } from "../../features/authSlice";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const result = await dispatch(
      signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    if (result.type === "auth/signup/fulfilled") {
      toast.success(
        "🎉 Account created successfully! Welcome to Excel Analytics!"
      );
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6)
      return { strength: 25, text: "Weak", color: "text-red-500" };
    if (password.length < 10)
      return { strength: 50, text: "Fair", color: "text-yellow-500" };
    if (password.length < 12)
      return { strength: 75, text: "Good", color: "text-blue-500" };
    return { strength: 100, text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 sm:px-6 lg:px-8">
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
            Join Excel Analytics! 🚀
          </h2>
          <p className="text-gray-600 font-medium">
            Create your account to start analyzing data
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></span>
              Free Forever
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-teal-500 rounded-full mr-2"></span>
              AI-Powered
            </span>
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
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
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      Password Strength
                    </span>
                    <span
                      className={`text-xs font-bold ${passwordStrength.color}`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 25
                          ? "bg-red-500"
                          : passwordStrength.strength <= 50
                          ? "bg-yellow-500"
                          : passwordStrength.strength <= 75
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-4 bg-gray-50 border-2 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    formData.confirmPassword &&
                    formData.password === formData.confirmPassword
                      ? "border-green-300 focus:ring-green-500"
                      : formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-emerald-500"
                  } focus:border-transparent`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
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
              {formData.confirmPassword && (
                <div className="mt-1 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <span className="text-green-600 font-medium">
                      ✅ Passwords match!
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ❌ Passwords don't match
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  isLoading || formData.password !== formData.confirmPassword
                }
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating your account...
                  </>
                ) : (
                  <>🎉 Create My Account</>
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                >
                  Sign in here →
                </Link>
              </span>
            </div>
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              100% Free
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
              No Credit Card
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
              Instant Setup
            </span>
          </div>
          <p className="text-xs text-gray-500">
            🔐 By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
