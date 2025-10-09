import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";

const AIInsights = ({ fileId, fileName }) => {
  const { user } = useSelector((state) => state.auth);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const handleGenerateInsights = async () => {
    if (!fileId) {
      toast.error("No file selected");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🚀 Generating insights for file:", fileId);

      const response = await axiosInstance.post("/ai/insights", {
        fileId,
      });

      console.log("✅ AI insights response:", response.data);

      if (response.data.success) {
        setInsights(response.data);
        setShowInsights(true);
        toast.success("✨ AI insights generated successfully!");
      } else {
        toast.error(response.data.message || "Failed to generate insights");
      }
    } catch (error) {
      console.error("❌ AI insights error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to generate insights"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowInsights(false);
    setInsights(null);
  };

  if (!fileId) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              AI-Powered Insights
            </h3>
            <p className="text-purple-100 text-sm">Powered by Google Gemini</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!showInsights ? (
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                Get comprehensive analysis and insights for your data
              </p>
              <p className="text-sm text-gray-500">
                File:{" "}
                <span className="font-medium text-gray-700">{fileName}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                User: {user?.name} ({user?.email})
              </p>
            </div>

            <button
              onClick={handleGenerateInsights}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                  <span>Analyzing data...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Generate AI Insights</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>100% Free</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Google Gemini AI</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  Analysis Results
                </h4>
                <p className="text-sm text-gray-500">
                  File: {fileName} • Generated:{" "}
                  {new Date(insights.analysisDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                {insights.insights}
              </div>
            </div>

            {insights.dataInfo && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {insights.dataInfo.totalRows}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    Total Rows
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {insights.dataInfo.totalColumns}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    Columns
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">✨</div>
                  <div className="text-xs text-green-600 font-medium">
                    AI Analyzed
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Powered by Google Gemini AI - Free Tier</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
