import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import ExcelData from "../models/excelData.model.js";
import User from "../models/user.model.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Initialize Gemini AI lazily (only when needed)
const getGeminiAI = async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    // Dynamic import to avoid initialization issues
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (error) {
    console.error("❌ Failed to initialize Gemini AI:", error.message);
    throw error;
  }
};

// @route POST /api/ai/insights
// @desc Generate AI insights for Excel data using Gemini
// @access Private
router.post("/insights", async (req, res) => {
  try {
    console.log("🔍 AI Insights request from user:", req.user._id);

    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    console.log("📊 Processing file:", fileId);

    // Find the Excel file
    const excelFile = await ExcelData.findOne({
      _id: fileId,
      userId: req.user._id,
    });

    if (!excelFile) {
      return res.status(404).json({
        success: false,
        message: "File not found or access denied",
      });
    }

    // Initialize Gemini AI when needed
    let genAI;
    try {
      genAI = await getGeminiAI();
      console.log("✅ Gemini AI initialized successfully");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Gemini AI service is not available. Please check API key configuration.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    // Prepare data for AI analysis
    const primarySheet = Object.keys(excelFile.data)[0];
    const sheetData = excelFile.data[primarySheet];

    // Limit data size for API call (first 20 rows to avoid token limits)
    const limitedData = {
      headers: sheetData.headers.slice(0, 10), // Limit columns too
      data: sheetData.data.slice(0, 20),
      totalRows: sheetData.data.length,
      totalColumns: sheetData.headers.length,
    };

    // Create simplified AI prompt
    const prompt = `
        Analyze this Excel dataset:

        **File:** ${excelFile.originalName}
        **Rows:** ${limitedData.totalRows}
        **Columns:** ${limitedData.totalColumns}
        **Headers:** ${limitedData.headers.join(", ")}

        **Sample Data:**
        ${JSON.stringify(limitedData.data.slice(0, 3), null, 1)}

        Provide a brief analysis with:
        1. **Data Summary** (2 lines)
        2. **Key Patterns** (3 bullet points)
        3. **Recommended Charts** (2-3 chart types)
        4. **Business Insights** (2-3 actionable points)

        Keep response under 300 words.
        `;

    console.log("🤖 Sending request to Gemini AI...");

    // Call Gemini AI with error handling
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    console.log("✅ Gemini AI response received");

    // Update analysis count
    excelFile.analysisCount += 1;
    excelFile.lastAnalyzed = new Date();
    await excelFile.save();

    // Update user's upload history
    const user = await User.findById(req.user._id);
    const uploadRecord = user.uploadHistory.find(
      (record) => record.fileId.toString() === fileId
    );

    if (uploadRecord) {
      uploadRecord.analysisCount += 1;
      uploadRecord.lastAnalyzed = new Date();
      await user.save();
    }

    res.json({
      success: true,
      insights,
      fileName: excelFile.originalName,
      analysisDate: new Date(),
      dataInfo: {
        totalRows: limitedData.totalRows,
        totalColumns: limitedData.totalColumns,
        sheetName: primarySheet,
      },
    });
  } catch (error) {
    console.error("❌ Gemini AI insights error:", error);

    // Handle specific API errors
    if (error.message?.includes("API key")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Gemini API key. Please check configuration.",
      });
    }

    if (error.message?.includes("quota") || error.message?.includes("limit")) {
      return res.status(429).json({
        success: false,
        message: "AI service rate limit exceeded. Please try again later.",
      });
    }

    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: "Invalid request to AI service. Please try again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate insights. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route POST /api/ai/summary
// @desc Generate quick summary
// @access Private
router.post("/summary", async (req, res) => {
  try {
    const { fileId } = req.body;

    const excelFile = await ExcelData.findOne({
      _id: fileId,
      userId: req.user._id,
    });

    if (!excelFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Initialize Gemini AI when needed
    let genAI;
    try {
      genAI = await getGeminiAI();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "AI service not available",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    const primarySheet = Object.keys(excelFile.data)[0];
    const sheetData = excelFile.data[primarySheet];

    const prompt = `Summarize this Excel data in 2-3 sentences:
        File: ${excelFile.originalName}
        Rows: ${sheetData.data.length}
        Columns: ${sheetData.headers.length}
        
        Focus on the most important insights.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({
      success: true,
      summary,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ AI summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate summary",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
