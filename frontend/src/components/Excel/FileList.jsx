/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFiles } from "../../store/excelSlice";
import { toast } from "react-hot-toast";

const FileList = ({ onFileSelect }) => {
  const dispatch = useDispatch();
  // ✅ Proper state access with debugging
  const excelState = useSelector((state) => state.excel);
  const { userFiles, isLoading, error } = excelState;

  const [selectedFileId, setSelectedFileId] = useState(null);

  // ✅ Debug the Redux state
  useEffect(() => {
    console.log("🔍 FileList component mounted");
    console.log("📊 Excel state:", excelState);
    console.log("📁 User files:", userFiles);
    console.log("⏳ Is loading:", isLoading);
    console.log("❌ Error:", error);
  }, [excelState, userFiles, isLoading, error]);

  useEffect(() => {
    console.log("🚀 Dispatching fetchUserFiles...");
    dispatch(fetchUserFiles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("❌ FileList error:", error);
      toast.error(error);
    }
  }, [error]);

  const handleAnalyze = (file) => {
    console.log("🔍 File selected for analysis:", file);

    // ✅ Validate file data structure
    if (!file.data || Object.keys(file.data).length === 0) {
      toast.error("❌ File data is missing. Please re-upload this file.");
      console.error("❌ Missing file data structure:", file);
      return;
    }

    if (!file.sheetNames || file.sheetNames.length === 0) {
      toast.error("❌ No sheets found in this file. Please re-upload.");
      console.error("❌ Missing sheet names:", file);
      return;
    }

    console.log("✅ File validation passed. Selecting file...");
    setSelectedFileId(file._id);
    onFileSelect(file);
    toast.success(`📊 Selected: ${file.originalName}`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ✅ Enhanced loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
          <p className="text-gray-600 font-medium">Loading your files...</p>
          <p className="text-sm text-gray-500 mt-1">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  // ✅ Enhanced error state
  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-red-800 mb-2">
          Error Loading Files
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchUserFiles())}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // ✅ Enhanced empty state with debug info
  if (!userFiles || userFiles.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-bold text-yellow-800 mb-2">🔧 Debug Info:</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>User Files Array: {JSON.stringify(userFiles)}</div>
              <div>Array Length: {userFiles?.length || 0}</div>
              <div>Is Loading: {isLoading ? "Yes" : "No"}</div>
              <div>Error: {error || "None"}</div>
              <div>Redux State Keys: {Object.keys(excelState).join(", ")}</div>
            </div>
          </div>
        )}

        <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Files Yet
        </h3>
        <p className="text-gray-600 mb-4">
          Upload your first Excel file to get started with data analysis.
        </p>
        <p className="text-sm text-gray-500">
          Go to "Upload File" tab to begin.
        </p>

        <button
          onClick={() => dispatch(fetchUserFiles())}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Refresh Files
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ✅ Debug panel for development */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-green-800 mb-2">
            ✅ Debug: Files Found
          </h4>
          <div className="text-sm text-green-700">
            <div>Files Count: {userFiles.length}</div>
            <div>Files: {userFiles.map((f) => f.originalName).join(", ")}</div>
          </div>
        </div>
      )} */}

      {userFiles.map((file) => (
        <div
          key={file._id}
          className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
            selectedFileId === file._id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {file.originalName}
                  </h3>

                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                        />
                      </svg>
                      {formatFileSize(file.fileSize)}
                    </span>

                    <span className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2h2z"
                        />
                      </svg>
                      {file.sheetNames?.length || 0} sheets
                    </span>

                    <span className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* ✅ Show data validation status */}
                  <div className="mt-3 flex items-center space-x-2">
                    {file.data && Object.keys(file.data).length > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                        ✅ Data Available ({file.totalRows || 0} rows)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                        ❌ Data Missing
                      </span>
                    )}

                    {file.analysisCount && file.analysisCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        📊 Analyzed {file.analysisCount} times
                      </span>
                    )}
                  </div>

                  {/* ✅ Show available sheets */}
                  {file.sheetNames && file.sheetNames.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {file.sheetNames.slice(0, 3).map((sheetName, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          📋 {sheetName}
                        </span>
                      ))}
                      {file.sheetNames.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-200 text-gray-600">
                          +{file.sheetNames.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAnalyze(file)}
                disabled={!file.data || Object.keys(file.data).length === 0}
                className={`ml-4 px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedFileId === file._id
                    ? "bg-blue-600 text-white shadow-lg"
                    : file.data && Object.keys(file.data).length > 0
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedFileId === file._id ? (
                  <>
                    <svg
                      className="inline h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Selected
                  </>
                ) : file.data && Object.keys(file.data).length > 0 ? (
                  <>
                    <svg
                      className="inline h-4 w-4 mr-1"
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
                    Analyze
                  </>
                ) : (
                  <>⚠️ Re-upload Required</>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
