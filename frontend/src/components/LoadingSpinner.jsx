/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";

const LoadingSpinner = () => {
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
          <svg
            className="h-8 w-8 text-white animate-spin"
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
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Excel Analytics Platform
        </h3>
        <p className="text-gray-600 animate-pulse">
          Initializing your dashboard...
        </p>

        {/* Loading time indicator */}
        <div className="mt-4 text-sm text-gray-500">
          Loading for {loadingTime} seconds...
          {loadingTime > 10 && (
            <div className="text-orange-600 font-medium mt-2">
              ⚠️ Taking longer than expected...
            </div>
          )}
          {loadingTime > 15 && (
            <div className="text-red-600 font-medium mt-2">
              🔄 Please refresh the page if it doesn't load soon
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center space-x-1">
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-pink-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded text-xs">
          <div>🔧 Debug Info:</div>
          <div>• Loading time: {loadingTime}s</div>
          <div>• Check browser console for errors</div>
          <div>• Server should be running on port 8000</div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
