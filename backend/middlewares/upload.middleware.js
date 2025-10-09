import multer from "multer";
import path from "path";

// ✅ BULLETPROOF: Use MEMORY storage to avoid file system issues
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  console.log("🔍 [Upload] File filter check:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
  });

  const allowedMimes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const allowedExtensions = [".xls", ".xlsx"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    console.log("✅ [Upload] File accepted:", file.originalname);
    cb(null, true);
  } else {
    console.error("❌ [Upload] File rejected - Invalid file type");
    cb(
      new Error("Invalid file type. Only .xls and .xlsx files are allowed."),
      false
    );
  }
};

// ✅ BULLETPROOF: Memory storage with proper limits
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    fieldSize: 25 * 1024 * 1024,
    fields: 10,
    files: 1,
  },
  fileFilter,
});

export default upload;
