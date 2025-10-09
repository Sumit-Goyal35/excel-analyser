import mongoose from "mongoose";

const excelDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    // ✅ Store sheet names as array
    sheetNames: [
      {
        type: String,
      },
    ],
    // ✅ Store actual Excel data with proper structure
    data: {
      type: mongoose.Schema.Types.Mixed, // Flexible schema for Excel data
      required: true,
      default: {},
    },
    // Additional metadata
    totalRows: {
      type: Number,
      default: 0,
    },
    totalColumns: {
      type: Number,
      default: 0,
    },
    analysisCount: {
      type: Number,
      default: 0,
    },
    lastAnalyzed: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Add index for better performance
excelDataSchema.index({ userId: 1, createdAt: -1 });

const ExcelData = mongoose.model("ExcelData", excelDataSchema);

export default ExcelData;
