import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// ✅ CRITICAL: Completely rewrite admin users endpoint
router.get("/users", auth, async (req, res) => {
  try {
    console.log("🔍 [ADMIN] GET /users endpoint hit");
    console.log("👤 [ADMIN] Request user:", req.user);
    console.log("🔑 [ADMIN] User role:", req.user?.role);
    console.log("🆔 [ADMIN] User ID:", req.user?._id);

    // ✅ Check admin role
    if (req.user.role !== "admin") {
      console.error("❌ [ADMIN] Access denied - not admin");
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    // ✅ Fetch ALL users with explicit query
    console.log("📊 [ADMIN] Fetching all users from database...");
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    console.log("✅ [ADMIN] Users found in DB:", users.length);
    console.log(
      "📋 [ADMIN] User details:",
      users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
      }))
    );

    // ✅ Always return consistent format
    const response = {
      success: true,
      message: "Users fetched successfully",
      users: users,
      count: users.length,
    };

    console.log("📤 [ADMIN] Sending response:", response);
    res.json(response);
  } catch (error) {
    console.error("❌ [ADMIN] Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      users: [], // ✅ Always include users array
      count: 0,
    });
  }
});

// ✅ Add toggle user status route
router.put("/users/:userId/toggle-status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    const { userId } = req.params;
    console.log("🔄 [ADMIN] Toggling status for user:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    console.log("✅ [ADMIN] User status updated:", {
      userId,
      isActive: user.isActive,
    });

    res.json({
      success: true,
      message: "User status updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("❌ [ADMIN] Error toggling user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
