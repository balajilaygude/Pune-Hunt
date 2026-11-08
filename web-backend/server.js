import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env before any other imports
dotenv.config();

import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import gameRoutes from "./routes/games.js";
import { initializeGameSocket } from "./socket/gameSocket.js";

const app = express();
const server = http.createServer(app);

// Render automatically assigns process.env.PORT
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "*";

// Body parser & CORS
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Database connection
let cached = false;

async function dbConnect() {
  if (cached && mongoose.connection.readyState === 1) return;

  const mongoUri =
    process.env.MONGO_URL ||
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/pune_travel_hunt";

  await mongoose.connect(mongoUri);
  cached = true;
  console.log("✅ MongoDB Connected successfully");
}

// Middleware to ensure DB connection is ready for any route
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed: " + err.message
    });
  }
});

// Health check endpoints for Render uptime monitoring
app.get("/", (req, res) => {
  return res.json({
    status: "healthy",
    message: "Connect jhalo! Pune Travel Hunt Backend is running 🎯",
    time: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  return res.json({
    status: "healthy",
    game: "Pune Travel Hunt Backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting",
    time: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/games", gameRoutes);

// Socket.IO for persistent Real-Time Multiplayer
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
},
  pingTimeout: 60000,
  pingInterval: 25000
});

app.set("io", io);
initializeGameSocket(io);

// Start listening (Render, Railway, or Local standalone server)
server.listen(PORT, "0.0.0.0", async () => {
  console.log(`🚀 Pune Travel Hunt Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO real-time server ready for WebSockets`);
  console.log(`🌐 Allowed Client URL: ${CLIENT_URL}`);
  try {
    await dbConnect();
  } catch (err) {
    console.warn("⚠️ Initial DB connection will retry on first request:", err.message);
  }
});

export default app;
