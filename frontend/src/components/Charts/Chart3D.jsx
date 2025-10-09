import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 3D Bar Component
function Bar3D({ position, height, color, label, value }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, height + 0.5, 0]} center>
        <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {label}: {value}
        </div>
      </Html>
    </group>
  );
}

const Chart3D = ({ chartData, metadata }) => {
  const canvasRef = useRef();

  // Process data for 3D visualization
  const processedData = useMemo(() => {
    if (!chartData || !chartData.chartData) return [];

    const data = chartData.chartData;
    if (!Array.isArray(data) || data.length === 0) return [];

    const maxValue = Math.max(...data.map((d) => d.value || d.y || 1));
    const slicedData = data.slice(0, 20); // Limit to 20 bars for performance

    return slicedData.map((item, index) => ({
      x: index - slicedData.length / 2,
      y: Math.max(((item.value || item.y || 0) / maxValue) * 5, 0.1),
      z: 0,
      value: item.value || item.y || 0,
      label: String(item.label || item.x || `Item ${index + 1}`),
      color: `hsl(${(index * 137.508) % 360}, 70%, 60%)`,
    }));
  }, [chartData]);

  const handleDownloadPNG = async () => {
    try {
      if (!canvasRef.current) {
        toast.error("3D Chart not ready for download");
        return;
      }

      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const url = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = url;
      link.download = `3d-chart-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("3D Chart downloaded as PNG!");
    } catch (error) {
      console.error("3D PNG download error:", error);
      toast.error("Failed to download 3D chart");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!canvasRef.current) {
        toast.error("3D Chart not ready for download");
        return;
      }

      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = pdf.internal.pageSize.getWidth() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`3d-chart-${Date.now()}.pdf`);
      toast.success("3D Chart downloaded as PDF!");
    } catch (error) {
      console.error("3D PDF download error:", error);
      toast.error("Failed to download 3D PDF");
    }
  };

  if (processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
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
          <p className="text-gray-500">
            No data available for 3D visualization
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          3D Visualization: {metadata?.yColumn} by {metadata?.xColumn}
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Showing:</span>
            <span className="ml-1 text-purple-600">
              {processedData.length} columns
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Max Value:</span>
            <span className="ml-1 text-blue-600">
              {Math.max(...processedData.map((d) => d.value))}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Type:</span>
            <span className="ml-1 text-green-600">3D Column Chart</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Use mouse to rotate, zoom, and pan the 3D view
        </p>
      </div>

      {/* 3D Canvas */}
      <div
        ref={canvasRef}
        className="bg-gradient-to-b from-blue-50 to-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <Canvas
          style={{ height: "500px", width: "100%" }}
          camera={{ position: [10, 8, 10], fov: 60 }}
          shadows
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <directionalLight position={[-10, 10, 5]} intensity={0.5} />

          {processedData.map((item, index) => (
            <Bar3D
              key={index}
              position={[item.x * 1.2, 0, item.z]}
              height={item.y}
              color={item.color}
              label={item.label}
              value={item.value}
            />
          ))}

          {/* Grid Floor */}
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#f0f0f0" opacity={0.5} transparent />
          </mesh>

          {/* Axis Labels */}
          <Text
            position={[0, -2, -12]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.8}
            color="#666"
            anchorX="center"
            anchorY="middle"
          >
            {metadata?.xColumn || "X-Axis"}
          </Text>

          <Text
            position={[-12, 2, 0]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            fontSize={0.8}
            color="#666"
            anchorX="center"
            anchorY="middle"
          >
            {metadata?.yColumn || "Y-Axis"}
          </Text>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownloadPNG}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
          Download 3D PNG
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
          Download 3D PDF
        </button>
      </div>
    </div>
  );
};

export default Chart3D;
