/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { uploadExcelFile, clearError } from "../../store/excelSlice";

const FileUpload = ({ onUploadSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.excel);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!file) {
        toast.error("No file selected");
        return;
      }

      // ✅ Check auth without logs
      const currentToken = localStorage.getItem("token");
      if (!currentToken || !isAuthenticated) {
        toast.error("Please login to upload files");
        setTimeout(() => (window.location.href = "/login"), 1000);
        return;
      }

      try {
        dispatch(clearError());
        const result = await dispatch(uploadExcelFile(file));

        if (result.type === "excel/uploadFile/fulfilled") {
          toast.success("File uploaded successfully! 🎉");
          if (onUploadSuccess && result.payload?.file) {
            onUploadSuccess(result.payload.file);
          }
        } else if (result.type === "excel/uploadFile/rejected") {
          const errorMessage = result.payload || "Upload failed";

          if (
            errorMessage.includes("login") ||
            errorMessage.includes("Session expired")
          ) {
            toast.error("Please login to continue");
            setTimeout(() => (window.location.href = "/login"), 1500);
          } else {
            toast.error(errorMessage);
          }
        }
      } catch (err) {
        toast.error("Upload failed - please try again");
      }
    },
    [dispatch, onUploadSuccess, isAuthenticated]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      multiple: false,
      maxSize: 10 * 1024 * 1024, // 10MB
      disabled: isLoading || !isAuthenticated,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
      onDropAccepted: () => setIsDragActive(false),
      onDropRejected: (rejectedFiles) => {
        setIsDragActive(false);
        const rejection = rejectedFiles[0]?.errors[0];
        if (rejection?.code === "file-too-large") {
          toast.error("File too large. Maximum size is 10MB");
        } else if (rejection?.code === "file-invalid-type") {
          toast.error("Invalid file type. Please upload .xls or .xlsx files");
        } else {
          toast.error("File rejected. Please check file type and size");
        }
      },
    });

  const getDropzoneClass = () => {
    let baseClass =
      "border-2 border-dashed rounded-lg p-8 text-center transition-colors ";

    if (!isAuthenticated) {
      baseClass += "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50";
    } else if (isLoading) {
      baseClass += "border-blue-300 bg-blue-50 cursor-wait";
    } else if (isDragAccept) {
      baseClass += "border-green-400 bg-green-50 cursor-pointer";
    } else if (isDragReject) {
      baseClass += "border-red-400 bg-red-50 cursor-not-allowed";
    } else if (isDragActive) {
      baseClass += "border-blue-400 bg-blue-50 cursor-pointer";
    } else {
      baseClass += "border-gray-300 hover:border-gray-400 cursor-pointer";
    }

    return baseClass;
  };

  if (!isAuthenticated) {
    return (
      <div className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center bg-red-50">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-lg font-medium">Authentication Required</h3>
          <p className="text-sm mt-2">Please log in to upload Excel files</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div {...getRootProps()} className={getDropzoneClass()}>
        <input {...getInputProps()} />
        <div className="text-gray-600">
          {isLoading ? (
            <>
              <div className="animate-spin mx-auto h-12 w-12 mb-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <h3 className="text-lg font-medium text-blue-600">
                Processing...
              </h3>
              <p className="text-sm">Please wait while we process your file</p>
            </>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h3 className="text-lg font-medium">Upload Excel File</h3>
              <p className="text-sm">
                Drag & drop your .xls or .xlsx file here, or click to browse
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Maximum file size: 10MB • Supported formats: .xls, .xlsx
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
