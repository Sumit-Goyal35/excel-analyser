import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    // ✅ Verify token with proper error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }

    // ✅ Find user and attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

// ✅ Admin middleware
export const adminAuth = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  next();
};
