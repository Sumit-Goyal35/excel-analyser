import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import excelRoutes from "./routes/excel.routes.js";
import aiRoutes from "./routes/ai.routes.js";

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDatabase();

// ✅ Fix EventEmitter warning
process.setMaxListeners(0);

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ CRITICAL: Increase limits to prevent payload errors
app.use(
  express.json({
    limit: "100mb",
    parameterLimit: 1000000,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 1000000,
    fieldSize: 100 * 1024 * 1024,
    fields: 50000,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/ai", aiRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Excel Analytics Platform API",
    version: "1.0.0",
    status: "active",
  });
});

// ✅ Better error handling
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "File too large",
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error",
  });
});

export default app;
