import express from "express";
import { GameRoom } from "../models/GameRoom.js";
import { User } from "../models/User.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/games/history
// Returns completed games for the player
router.get("/history", optionalAuth, async (req, res) => {
  try {
    const filter = { status: "completed" };

    if (req.user) {
      filter.$or = [
        { "player1.userId": req.user._id },
        { "player2.userId": req.user._id },
        { "player1.name": req.user.username },
        { "player2.name": req.user.username }
      ];
    }

    const games = await GameRoom.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ success: true, games });
  } catch (error) {
    console.error("Fetch games error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/games/leaderboard
// Aggregates player stats across all completed games
router.get("/leaderboard", async (req, res) => {
  try {
    // 1. First attempt to pull directly from registered Users who have played games
    const users = await User.find({ gamesPlayed: { $gt: 0 } })
      .sort({ gamesWon: -1, tasksCompleted: -1 })
      .limit(20);

    if (users.length > 0) {
      const formatted = users.map((u) => ({
        name: u.username,
        played: u.gamesPlayed,
        won: u.gamesWon,
        lost: Math.max(0, u.gamesPlayed - u.gamesWon),
        winRate: u.gamesPlayed > 0 ? Math.round((u.gamesWon / u.gamesPlayed) * 100) : 0,
        tasksCompleted: u.tasksCompleted,
        favBlock: "A"
      }));

      return res.json({ success: true, leaderboard: formatted });
    }

    // 2. Fallback: Aggregate from completed GameRooms (even if players didn't have user accounts)
    const completedRooms = await GameRoom.find({ status: "completed" });
    const map = {};

    completedRooms.forEach((game) => {
      [game.player1, game.player2].forEach((p) => {
        if (!p || !p.name) return;
        const key = p.name.trim();
        if (!map[key]) {
          map[key] = {
            name: key,
            played: 0,
            won: 0,
            lost: 0,
            tasksCompleted: 0,
            blocks: {}
          };
        }
        map[key].played += 1;
        map[key].tasksCompleted += p.score || 0;
        if (game.winnerName === key) {
          map[key].won += 1;
        } else if (!game.isTie) {
          map[key].lost += 1;
        }
        const b = p.blockId || "A";
        map[key].blocks[b] = (map[key].blocks[b] || 0) + 1;
      });
    });

    const list = Object.values(map)
      .map((item) => {
        let favBlock = "A";
        let maxCount = -1;
        Object.entries(item.blocks).forEach(([blk, cnt]) => {
          if (cnt > maxCount) {
            maxCount = cnt;
            favBlock = blk;
          }
        });
        return {
          name: item.name,
          played: item.played,
          won: item.won,
          lost: item.lost,
          winRate: item.played > 0 ? Math.round((item.won / item.played) * 100) : 0,
          tasksCompleted: item.tasksCompleted,
          favBlock
        };
      })
      .sort((a, b) => b.won - a.won || b.winRate - a.winRate);

    return res.json({ success: true, leaderboard: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

