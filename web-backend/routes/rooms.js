import express from "express";
import QRCode from "qrcode";
import { GameRoom } from "../models/GameRoom.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Helper to generate a friendly 6-character code (e.g., PUNE84)
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PUNE";
  for (let i = 0; i < 2; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/rooms/create
// Player 1 creates a new live game room with code and QR code
router.post("/create", optionalAuth, async (req, res) => {
  try {
    const { blockId = "A", location = "FC Road & Deccan", playerName } = req.body;

    const p1Name = playerName?.trim() || req.user?.username || "Player 1";
    const p1UserId = req.user?._id || null;

    // Generate unique room code
    let roomCode = generateRoomCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await GameRoom.findOne({ roomCode, status: { $in: ["waiting", "in-progress"] } });
      if (!existing) break;
      roomCode = generateRoomCode();
      attempts++;
    }

    let clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    if (req.headers.origin) {
      clientUrl = req.headers.origin;
    } else if (req.headers.referer) {
      try {
        const refUrl = new URL(req.headers.referer);
        clientUrl = `${refUrl.protocol}//${refUrl.host}`;
      } catch (e) {}
    } else if (req.hostname && req.hostname !== "localhost" && req.hostname !== "127.0.0.1") {
      clientUrl = `http://${req.hostname}:3000`;
    }

    const joinUrl = `${clientUrl}/play?room=${roomCode}`;

    // Generate QR Code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(joinUrl, {
      margin: 2,
      width: 256,
      color: {
        dark: "#064E3B", // Forest green theme
        light: "#FFFFFF"
      }
    });

    const newRoom = new GameRoom({
      roomCode,
      status: "waiting",
      location: location.trim() || "Pune City Streets",
      qrCodeDataUrl,
      player1: {
        userId: p1UserId,
        name: p1Name,
        blockId: "",
        completedTaskIds: [],
        score: 0,
        ready: false
      },
      player2: {
        userId: null,
        name: "",
        blockId: "",
        completedTaskIds: [],
        score: 0,
        ready: false
      },
      recentActivity: [
        {
          id: "act-" + Date.now(),
          text: `🎯 Room ${roomCode} created by ${p1Name}. Waiting for Player 2 to join...`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          playerName: p1Name
        }
      ]
    });

    await newRoom.save();

    return res.status(201).json({
      success: true,
      message: `Room ${roomCode} created! Share the code or QR with Player 2.`,
      room: newRoom,
      roomCode,
      joinUrl,
      qrCodeDataUrl
    });
  } catch (error) {
    console.error("Create room error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create room" });
  }
});

// POST /api/rooms/join
// Player 2 enters code or scans QR to join room
router.post("/join", optionalAuth, async (req, res) => {
  try {
    const { roomCode, blockId = "B", playerName } = req.body;

    if (!roomCode) {
      return res.status(400).json({ success: false, message: "Room code is required." });
    }

    const cleanCode = roomCode.trim().toUpperCase();
    const room = await GameRoom.findOne({ roomCode: cleanCode });

    if (!room) {
      return res.status(404).json({ success: false, message: `No game room found with code "${cleanCode}".` });
    }

    if (room.status === "completed") {
      return res.status(400).json({ success: false, message: "This game has already finished." });
    }

    if (room.status === "abandoned") {
      return res.status(400).json({ success: false, message: "This game was abandoned." });
    }

    const p2Name = playerName?.trim() || req.user?.username || "Player 2";
    const p2UserId = req.user?._id || null;

    // Check if player is rejoining or joining as player 2
    const isPlayer1 = (p2UserId && room.player1.userId && room.player1.userId.toString() === p2UserId.toString()) ||
                      (room.player1.name === p2Name && room.status === "in-progress");

    if (isPlayer1) {
      // Player 1 re-joining their own game
      return res.json({
        success: true,
        message: "Rejoined room as Player 1",
        room,
        role: "player1"
      });
    }

    const isPlayer2Rejoining = (p2UserId && room.player2.userId && room.player2.userId.toString() === p2UserId.toString()) ||
                              (room.player2.name === p2Name && room.status === "in-progress");

    if (isPlayer2Rejoining) {
      return res.json({
        success: true,
        message: "Rejoined room as Player 2",
        room,
        role: "player2"
      });
    }

    // New Player 2 joining
    if (room.player2.name && room.status === "in-progress") {
      return res.status(400).json({ success: false, message: "This game already has two players in action." });
    }

    // Set player 2 details and transition to block selection
    room.player2.userId = p2UserId;
    room.player2.name = p2Name;
    room.player2.blockId = "";
    room.player2.ready = false;
    room.player1.ready = false;
    room.status = "selecting_blocks";

    room.recentActivity.unshift({
      id: "act-" + Date.now(),
      text: `🚀 ${p2Name} joined room ${cleanCode}! Both players, select your spotting blocks!`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      playerName: p2Name
    });

    if (room.recentActivity.length > 10) {
      room.recentActivity = room.recentActivity.slice(0, 10);
    }

    await room.save();

    // Broadcast through socket if available on app
    const io = req.app.get("io");
    if (io) {
      io.to(cleanCode).emit("player_joined", {
        room,
        player2: room.player2,
        message: `${p2Name} joined! Both players, please select your spotting blocks!`
      });
      io.to(cleanCode).emit("game_updated", room);
    }

    return res.json({
      success: true,
      message: `Joined room ${cleanCode} successfully!`,
      room,
      role: "player2"
    });
  } catch (error) {
    console.error("Join room error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to join room" });
  }
});

// GET /api/rooms/:roomCode
router.get("/:roomCode", async (req, res) => {
  try {
    const cleanCode = req.params.roomCode.trim().toUpperCase();
    const room = await GameRoom.findOne({ roomCode: cleanCode });

    if (!room) {
      return res.status(404).json({ success: false, message: `Room ${cleanCode} not found.` });
    }

    return res.json({ success: true, room });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch room" });
  }
});

// POST /api/rooms/:roomCode/abandon
router.post("/:roomCode/abandon", optionalAuth, async (req, res) => {
  try {
    const cleanCode = req.params.roomCode.trim().toUpperCase();
    const room = await GameRoom.findOne({ roomCode: cleanCode });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    room.status = "abandoned";
    await room.save();

    const io = req.app.get("io");
    if (io) {
      io.to(cleanCode).emit("game_abandoned", {
        roomCode: cleanCode,
        message: "The game challenge was abandoned by a player."
      });
    }

    return res.json({ success: true, message: "Game abandoned" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/rooms/user/active
router.get("/user/active", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const activeRoom = await GameRoom.findOne({
      status: { $in: ["waiting", "in-progress"] },
      $or: [{ "player1.userId": userId }, { "player2.userId": userId }]
    }).sort({ updatedAt: -1 });

    return res.json({ success: true, room: activeRoom || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

