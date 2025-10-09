import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import ExcelData from "../models/excelData.model.js";
import User from "../models/user.model.js";
import XLSX from "xlsx";

const router = express.Router();

// Apply auth middleware
router.use(auth);

// ✅ BULLETPROOF: Upload route with memory processing
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("📁 Processing uploaded file:", req.file.originalname);
    console.log("📊 File size:", req.file.size, "bytes");

    // ✅ CRITICAL: Read from memory buffer (no file system issues)
    let workbook;
    try {
      workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      console.log("✅ Excel file read successfully from memory");
    } catch (fileReadError) {
      console.error("❌ Failed to read Excel file:", fileReadError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid Excel file or file is corrupted",
      });
    }

    const sheetNames = workbook.SheetNames;
    console.log("📋 Found sheets:", sheetNames);

    // Process all sheets
    const processedData = {};
    let totalRows = 0;
    let totalColumns = 0;

    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      if (jsonData.length > 0) {
        processedData[sheetName] = {
          headers: jsonData[0] || [],
          data: jsonData.slice(1) || [],
          rowCount: jsonData.length - 1,
          columnCount: (jsonData[0] || []).length,
        };

        totalRows += jsonData.length - 1;
        totalColumns = Math.max(totalColumns, (jsonData[0] || []).length);

        console.log(
          `✅ Sheet "${sheetName}": ${jsonData.length - 1} rows, ${
            (jsonData[0] || []).length
          } columns`
        );
      }
    });

    // Save to database
    const excelData = new ExcelData({
      userId: req.user._id,
      fileName: `excel-${Date.now()}-${req.file.originalname}`,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      sheetNames: sheetNames,
      data: processedData,
      totalRows: totalRows,
      totalColumns: totalColumns,
    });

    await excelData.save();
    console.log("✅ Excel data saved to database with ID:", excelData._id);

    res.json({
      success: true,
      message: "File uploaded and processed successfully",
      file: {
        _id: excelData._id,
        originalName: excelData.originalName,
        fileName: excelData.fileName,
        fileSize: excelData.fileSize,
        sheetNames: excelData.sheetNames,
        data: excelData.data,
        totalRows: excelData.totalRows,
        totalColumns: excelData.totalColumns,
        createdAt: excelData.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Upload processing error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing file",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Chart generation route
router.post("/generate-chart", async (req, res) => {
  try {
    const { fileId, sheetName, xColumn, yColumn, chartType, aggregation } =
      req.body;

    if (!fileId || !sheetName || xColumn === "" || yColumn === "") {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    const excelFile = await ExcelData.findOne({
      _id: fileId,
      userId: req.user._id,
    });

    if (!excelFile) {
      return res.status(404).json({
        success: false,
        message: "Excel file not found",
      });
    }

    const sheetData = excelFile.data[sheetName];
    if (!sheetData) {
      return res.status(400).json({
        success: false,
        message: "Sheet data not found",
      });
    }

    const headers = sheetData.headers;
    const data = sheetData.data;

    let chartData = [];
    if (chartType === "pie") {
      const groupedData = {};

      data.forEach((row) => {
        const label = String(row[xColumn] || "Unknown");
        const value = parseFloat(row[yColumn]) || 0;
        if (!groupedData[label]) groupedData[label] = [];
        groupedData[label].push(value);
      });

      Object.keys(groupedData).forEach((label) => {
        const values = groupedData[label];
        let aggregatedValue = values.reduce((a, b) => a + b, 0);

        if (aggregation === "average") {
          aggregatedValue = aggregatedValue / values.length;
        }

        chartData.push({ label: label, value: aggregatedValue });
      });
    } else {
      chartData = data
        .map((row) => ({
          x: row[xColumn] || "",
          y: parseFloat(row[yColumn]) || 0,
        }))
        .filter((item) => item.x !== "" && !isNaN(item.y));
    }

    await ExcelData.findByIdAndUpdate(fileId, {
      $inc: { analysisCount: 1 },
      lastAnalyzed: new Date(),
    });

    res.json({
      success: true,
      chartData: chartData,
      metadata: {
        xColumn: headers[xColumn],
        yColumn: headers[yColumn],
        chartType: chartType,
        totalPoints: chartData.length,
      },
    });
  } catch (error) {
    console.error("❌ Chart generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate chart data",
    });
  }
});

// Get files route
router.get("/files", async (req, res) => {
  try {
    const files = await ExcelData.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select(
        "originalName fileName fileSize sheetNames data totalRows totalColumns createdAt"
      );

    res.json({
      success: true,
      files: files.map((file) => ({
        _id: file._id,
        originalName: file.originalName,
        fileName: file.fileName,
        fileSize: file.fileSize,
        sheetNames: file.sheetNames,
        data: file.data,
        totalRows: file.totalRows,
        totalColumns: file.totalColumns,
        createdAt: file.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching files",
    });
  }
});

// Get specific file
router.get("/files/:id", async (req, res) => {
  try {
    const file = await ExcelData.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete file
router.delete("/files/:id", async (req, res) => {
  try {
    const file = await ExcelData.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
