import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "pune_travel_hunt_jwt_secret_key_2026_super_secure";

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide username, email, and password." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    // Check existing username or email
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }]
    });

    if (existing) {
      if (existing.email.toLowerCase() === email.toLowerCase().trim()) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
      }
      return res.status(400).json({ success: false, message: "This username is already taken. Pick another." });
    }

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await newUser.save();
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: newUser.toJSON()
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: error.message || "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Please enter your username/email and password." });
    }

    const cleanId = identifier.trim();
    const user = await User.findOne({
      $or: [{ email: cleanId.toLowerCase() }, { username: cleanId }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials. User not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password. Please check and try again." });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Welcome back, ${user.username}!`,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user data" });
  }
});

export default router;

