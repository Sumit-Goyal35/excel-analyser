import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/user.model.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/signup
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const user = new User({ name, email, password });
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // ✅ CRITICAL FIX: Send token in response body
      res.status(201).json({
        success: true,
        message: "User created successfully",
        token: token, // ✅ Frontend needs this!
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user || !user.isActive) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken(user._id);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // ✅ CRITICAL FIX: Send token in response body
      res.json({
        success: true,
        message: "Login successful",
        token: token, // ✅ Frontend needs this!
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// @route GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        uploadHistory: req.user.uploadHistory,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
