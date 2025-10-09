/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateChartData, clearChartData } from "../../store/excelSlice";
import { toast } from "react-hot-toast";
import Chart2D from "../Charts/Chart2D";
import Chart3D from "../Charts/Chart3D";
import AIInsights from "../AI/AIInsights";

const ChartConfiguration = ({ file }) => {
  const dispatch = useDispatch();
  const { isLoading, chartData } = useSelector((state) => state.excel);
  const [config, setConfig] = useState({
    sheetName: "",
    xColumn: "",
    yColumn: "",
    chartType: "bar",
    aggregation: "sum",
  });
  const [activeView, setActiveView] = useState(null);

  // Debug: Log the file object to see its structure
  useEffect(() => {
    console.log("🔍 ChartConfiguration received file:", file);
    if (file) {
      console.log("📊 File data structure:", Object.keys(file));
      console.log("📋 File sheets:", file.sheetNames);
      console.log("💾 File data:", file.data);
    }
  }, [file]);

  useEffect(() => {
    if (file && file.sheetNames && file.sheetNames.length > 0) {
      setConfig((prev) => ({
        ...prev,
        sheetName: file.sheetNames[0],
      }));
    }
  }, [file]);

  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (activeView) {
      setActiveView(null);
    }
  };

  const handleGenerate2DChart = async () => {
    if (!config.xColumn || !config.yColumn) {
      toast.error("Please select both X and Y columns");
      return;
    }

    const params = {
      fileId: file._id,
      ...config,
    };

    try {
      const result = await dispatch(generateChartData(params));
      if (result.type === "excel/generateChartData/fulfilled") {
        setActiveView("2d");
        toast.success("🎉 2D Chart generated successfully!");
      }
    } catch (err) {
      console.error("Chart generation error:", err);
      toast.error("Failed to generate chart");
    }
  };

  const handleGenerate3DChart = async () => {
    if (!config.xColumn || !config.yColumn) {
      toast.error("Please select both X and Y columns");
      return;
    }

    const params = {
      fileId: file._id,
      ...config,
      chartType: "3d-column",
    };

    try {
      const result = await dispatch(generateChartData(params));
      if (result.type === "excel/generateChartData/fulfilled") {
        setActiveView("3d");
        toast.success("🎉 3D Chart generated successfully!");
      }
    } catch (err) {
      console.error("3D Chart generation error:", err);
      toast.error("Failed to generate 3D chart");
    }
  };

  const handleClearCharts = () => {
    setActiveView(null);
    dispatch(clearChartData());
    toast.success("Charts cleared");
  };

  const getCurrentSheet = () => {
    if (!file || !file.data || !config.sheetName) {
      console.warn("⚠️ Missing file data or sheet name:", {
        file: !!file,
        data: !!file?.data,
        sheetName: config.sheetName,
      });
      return null;
    }

    const sheet = file.data[config.sheetName];
    console.log("📊 Current sheet data:", sheet);
    return sheet;
  };

  const currentSheet = getCurrentSheet();

  if (!file) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="h-10 w-10 text-gray-400"
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
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          No File Selected
        </h3>
        <p className="text-gray-600">
          Please select an Excel file from "My Files" tab to start creating
          beautiful charts and visualizations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Debug Panel (only in development) */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <h4 className="font-bold text-yellow-800 mb-2">🔧 Debug Info</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>File ID: {file._id}</div>
            <div>File Name: {file.originalName}</div>
            <div>
              Sheets: {file.sheetNames ? file.sheetNames.join(", ") : "None"}
            </div>
            <div>Selected Sheet: {config.sheetName}</div>
            <div>
              Current Sheet Data: {currentSheet ? "Available" : "Missing"}
            </div>
            <div>
              Headers:{" "}
              {currentSheet?.headers ? currentSheet.headers.join(", ") : "None"}
            </div>
            <div>Row Count: {currentSheet?.data?.length || 0}</div>
          </div>
        </div>
      )} */}

      {/* Chart Configuration Panel */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            Chart Configuration
          </h2>
          <p className="text-indigo-100 mt-2">
            Configure your data visualization settings
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Sheet Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              📊 Select Data Sheet
            </label>
            <select
              value={config.sheetName}
              onChange={(e) => handleConfigChange("sheetName", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              <option value="">Select a sheet...</option>
              {file.sheetNames?.map((sheetName) => (
                <option key={sheetName} value={sheetName}>
                  📈 {sheetName}
                </option>
              ))}
            </select>
          </div>

          {/* Column Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* X-Axis Column */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                🗂️ X-Axis Column (Categories)
              </label>
              <select
                value={config.xColumn}
                onChange={(e) => handleConfigChange("xColumn", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                disabled={!currentSheet?.headers}
              >
                <option value="">Select X-Axis Column</option>
                {currentSheet?.headers?.map((header, index) => (
                  <option key={index} value={index}>
                    📝 {header}
                  </option>
                ))}
              </select>
              {!currentSheet?.headers && (
                <p className="mt-1 text-xs text-red-600">
                  ⚠️ Please select a sheet first
                </p>
              )}
            </div>

            {/* Y-Axis Column */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                📊 Y-Axis Column (Values)
              </label>
              <select
                value={config.yColumn}
                onChange={(e) => handleConfigChange("yColumn", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium"
                disabled={!currentSheet?.headers}
              >
                <option value="">Select Y-Axis Column</option>
                {currentSheet?.headers?.map((header, index) => (
                  <option key={index} value={index}>
                    📈 {header}
                  </option>
                ))}
              </select>
              {!currentSheet?.headers && (
                <p className="mt-1 text-xs text-red-600">
                  ⚠️ Please select a sheet first
                </p>
              )}
            </div>
          </div>

          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              🎨 2D Chart Type Selection
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  value: "bar",
                  label: "Bar Chart",
                  icon: "📊",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  value: "line",
                  label: "Line Chart",
                  icon: "📈",
                  color: "from-emerald-400 to-emerald-600",
                },
                {
                  value: "pie",
                  label: "Pie Chart",
                  icon: "🥧",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  value: "scatter",
                  label: "Scatter Plot",
                  icon: "🔘",
                  color: "from-rose-400 to-rose-600",
                },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleConfigChange("chartType", type.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 transform hover:scale-105 ${
                    config.chartType === type.value
                      ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg`
                      : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-semibold">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Data Preview */}
          {currentSheet && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-indigo-600 mr-2">🔍</span>
                Data Preview
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-xl p-3 border border-indigo-200">
                  <div className="text-2xl font-bold text-indigo-600">
                    {currentSheet.data?.length || 0}
                  </div>
                  <div className="text-xs text-indigo-500 font-medium">
                    Total Rows
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentSheet.headers?.length || 0}
                  </div>
                  <div className="text-xs text-purple-500 font-medium">
                    Columns
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-pink-200">
                  <div className="text-2xl font-bold text-pink-600">
                    {file.sheetNames?.length || 0}
                  </div>
                  <div className="text-xs text-pink-500 font-medium">
                    Sheets
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600">
                    {currentSheet?.headers &&
                    config.xColumn !== "" &&
                    config.yColumn !== ""
                      ? "✅"
                      : "⏳"}
                  </div>
                  <div className="text-xs text-emerald-500 font-medium">
                    Ready
                  </div>
                </div>
              </div>

              {/* Show available columns */}
              {currentSheet?.headers && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200">
                  <p className="text-sm font-semibold text-indigo-700 mb-2">
                    📋 Available Columns:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentSheet.headers.map((header, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
                      >
                        {header}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Show selection status */}
              {config.xColumn !== "" &&
                config.yColumn !== "" &&
                currentSheet?.headers && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-green-200">
                    <p className="text-sm text-green-700 font-semibold">
                      📊 Selected:{" "}
                      <span className="text-green-900">
                        {currentSheet.headers[config.xColumn]}
                      </span>{" "}
                      vs{" "}
                      <span className="text-green-900">
                        {currentSheet.headers[config.yColumn]}
                      </span>
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGenerate2DChart}
              disabled={isLoading || !config.xColumn || !config.yColumn}
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading && activeView !== "3d" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6"
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
                  Generating 2D Chart...
                </>
              ) : (
                <>
                  <svg
                    className="h-6 w-6 mr-2"
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
                  Generate 2D Chart
                </>
              )}
            </button>

            <button
              onClick={handleGenerate3DChart}
              disabled={isLoading || !config.xColumn || !config.yColumn}
              className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading && activeView === "3d" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6"
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
                  Generating 3D Chart...
                </>
              ) : (
                <>
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Generate 3D Chart
                </>
              )}
            </button>

            {activeView && (
              <button
                onClick={handleClearCharts}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                🗑️ Clear Charts
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart Display */}
      {activeView === "2d" && chartData && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-3">📊</span>
              2D Visualization:{" "}
              {config.chartType.charAt(0).toUpperCase() +
                config.chartType.slice(1)}{" "}
              Chart
            </h3>
            <p className="text-gray-600">
              Data Analysis:{" "}
              <span className="font-semibold text-gray-800">
                {chartData.metadata?.xColumn}
              </span>{" "}
              vs{" "}
              <span className="font-semibold text-gray-800">
                {chartData.metadata?.yColumn}
              </span>
            </p>
          </div>

          <Chart2D
            chartData={chartData}
            chartType={config.chartType}
            metadata={chartData.metadata}
          />
        </div>
      )}

      {activeView === "3d" && chartData && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-emerald-600 mr-3">🎲</span>
              3D Visualization: Interactive Column Chart
            </h3>
            <p className="text-gray-600">
              Immersive 3D Analysis:{" "}
              <span className="font-semibold text-gray-800">
                {chartData.metadata?.xColumn}
              </span>{" "}
              vs{" "}
              <span className="font-semibold text-gray-800">
                {chartData.metadata?.yColumn}
              </span>
            </p>
          </div>

          <Chart3D chartData={chartData} metadata={chartData.metadata} />
        </div>
      )}

      {/* AI Insights */}
      <AIInsights fileId={file._id} fileName={file.originalName} />
    </div>
  );
};

export default ChartConfiguration;
