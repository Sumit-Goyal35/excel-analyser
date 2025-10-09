/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart2D = ({ chartData, chartType, metadata }) => {
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);

  if (!chartData || !chartData.chartData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
            No Chart Data
          </h3>
          <p className="text-gray-500">
            Generate a chart to see visualization here
          </p>
        </div>
      </div>
    );
  }

  const data = chartData.chartData;

  const getChartData = () => {
    if (chartType === "pie") {
      return {
        labels: data.map((item) => item.label),
        datasets: [
          {
            data: data.map((item) => item.value),
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)", // Blue
              "rgba(16, 185, 129, 0.8)", // Green
              "rgba(245, 101, 101, 0.8)", // Red
              "rgba(251, 191, 36, 0.8)", // Yellow
              "rgba(139, 92, 246, 0.8)", // Purple
              "rgba(236, 72, 153, 0.8)", // Pink
              "rgba(6, 182, 212, 0.8)", // Cyan
              "rgba(34, 197, 94, 0.8)", // Emerald
              "rgba(239, 68, 68, 0.8)", // Rose
              "rgba(168, 85, 247, 0.8)", // Violet
              "rgba(14, 165, 233, 0.8)", // Sky
              "rgba(34, 211, 238, 0.8)", // Cyan
            ],
            borderColor: [
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(245, 101, 101)",
              "rgb(251, 191, 36)",
              "rgb(139, 92, 246)",
              "rgb(236, 72, 153)",
              "rgb(6, 182, 212)",
              "rgb(34, 197, 94)",
              "rgb(239, 68, 68)",
              "rgb(168, 85, 247)",
              "rgb(14, 165, 233)",
              "rgb(34, 211, 238)",
            ],
            borderWidth: 2,
          },
        ],
      };
    }

    const labels = data.map((item) => item.x);
    const values = data.map((item) => item.y);

    return {
      labels,
      datasets: [
        {
          label: `${metadata.yColumn} vs ${metadata.xColumn}`,
          data:
            chartType === "scatter"
              ? data.map((item) => ({ x: item.x, y: item.y }))
              : values,
          backgroundColor:
            chartType === "line"
              ? "rgba(59, 130, 246, 0.1)"
              : "rgba(59, 130, 246, 0.8)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 3,
          fill: chartType === "line",
          tension: chartType === "line" ? 0.4 : 0,
          pointBackgroundColor:
            chartType === "line" ? "rgb(59, 130, 246)" : undefined,
          pointBorderColor:
            chartType === "line" ? "rgb(255, 255, 255)" : undefined,
          pointBorderWidth: chartType === "line" ? 2 : undefined,
          pointRadius: chartType === "line" ? 5 : undefined,
          pointHoverRadius: chartType === "line" ? 7 : undefined,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      title: {
        display: true,
        text: `${metadata.yColumn} vs ${metadata.xColumn}`,
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales:
      chartType !== "pie"
        ? {
            x: {
              display: true,
              title: {
                display: true,
                text: metadata.xColumn,
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                drawBorder: false,
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: metadata.yColumn,
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                drawBorder: false,
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          }
        : undefined,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  const handleDownloadPNG = async () => {
    try {
      if (!chartRef.current) {
        toast.error("Chart not ready for download");
        return;
      }

      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${chartType}-chart-${metadata.xColumn}-vs-${
        metadata.yColumn
      }-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("✅ Chart downloaded as PNG!");
    } catch (error) {
      console.error("PNG download error:", error);
      toast.error("Failed to download PNG");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!chartContainerRef.current || !chartRef.current) {
        toast.error("Chart not ready for download");
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");

      // Create a temporary canvas with white background
      const originalCanvas = chartRef.current.canvas;
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = originalCanvas.width;
      tempCanvas.height = originalCanvas.height;

      // Fill with white background
      tempCtx.fillStyle = "#ffffff";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original chart on top
      tempCtx.drawImage(originalCanvas, 0, 0);

      // Convert to image data
      const imgData = tempCanvas.toDataURL("image/png", 1.0);

      // Create PDF
      const pdf = new jsPDF({
        orientation:
          tempCanvas.width > tempCanvas.height ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions to fit PDF
      const pageWidth = pdf.internal.pageSize.getWidth() - 20;
      const pageHeight = pdf.internal.pageSize.getHeight() - 20;
      const imgAspectRatio = tempCanvas.width / tempCanvas.height;

      let imgWidth = pageWidth;
      let imgHeight = pageWidth / imgAspectRatio;

      // If image is too tall, adjust to fit height
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = pageHeight * imgAspectRatio;
      }

      // Add title
      pdf.setFontSize(16);
      pdf.setFont(undefined, "bold");
      pdf.text(`${metadata.yColumn} vs ${metadata.xColumn}`, 10, 15);

      // Add chart
      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, imgHeight);

      // Add metadata
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.text(`Chart Type: ${chartType.toUpperCase()}`, 10, imgHeight + 35);
      pdf.text(`Data Points: ${data.length}`, 10, imgHeight + 45);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, imgHeight + 55);

      // Save PDF
      pdf.save(
        `${chartType}-chart-${metadata.xColumn}-vs-${
          metadata.yColumn
        }-${Date.now()}.pdf`
      );

      toast.dismiss(loadingToast);
      toast.success("✅ Chart downloaded as PDF!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  const renderChart = () => {
    const chartProps = {
      ref: chartRef,
      data: getChartData(),
      options,
      height: 400,
    };

    switch (chartType) {
      case "bar":
        return <Bar {...chartProps} />;
      case "line":
        return <Line {...chartProps} />;
      case "pie":
        return <Pie {...chartProps} />;
      case "scatter":
        return <Scatter {...chartProps} />;
      default:
        return <Bar {...chartProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Chart Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {chartType.toUpperCase()}
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1">
            Chart Type
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-700">
            {data.length}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Data Points
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
          <div className="text-2xl font-bold text-purple-700">2D</div>
          <div className="text-xs text-purple-600 font-medium mt-1">
            Visualization
          </div>
        </div>
      </div>

      {/* Enhanced Chart Container */}
      <div
        ref={chartContainerRef}
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
      >
        <div className="h-96 relative">{renderChart()}</div>
      </div>

      {/* Enhanced Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownloadPNG}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Download PNG
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Chart2D;
