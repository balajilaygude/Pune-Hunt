import { GameRoom } from "../models/GameRoom.js";
import { User } from "../models/User.js";

export function initializeGameSocket(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a specific game room by code
    socket.on("join_room", async ({ roomCode, playerName, userId }) => {
      if (!roomCode) return;
      const cleanCode = roomCode.trim().toUpperCase();
      socket.join(cleanCode);
      socket.roomCode = cleanCode;
      socket.playerName = playerName;

      console.log(`👥 ${playerName || "A player"} joined room socket: ${cleanCode}`);

      try {
        const room = await GameRoom.findOne({ roomCode: cleanCode });
        if (room) {
          socket.emit("room_state", room);
          socket.to(cleanCode).emit("player_online", {
            playerName,
            userId,
            message: `${playerName || "Opponent"} is connected!`
          });
        }
      } catch (err) {
        console.error("Error sending room state on join:", err);
      }
    });

    // Real-time block selection after both players connect
    socket.on("select_block", async ({ roomCode, playerRole, blockId }) => {
      if (!roomCode || !playerRole || !blockId) return;
      const cleanCode = roomCode.trim().toUpperCase();

      try {
        const room = await GameRoom.findOne({ roomCode: cleanCode });
        if (!room) return socket.emit("error_message", "Room not found");
        if (!room[playerRole]) return socket.emit("error_message", "Invalid player role");

        room[playerRole].blockId = blockId;
        room[playerRole].ready = true;

        const pName = room[playerRole].name || playerRole;
        room.recentActivity.unshift({
          id: "act-" + Date.now(),
          text: `📦 ${pName} selected Block ${blockId}!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          playerName: pName
        });

        // When both players have picked their blocks:
        if (room.player1.blockId && room.player2.blockId && room.player1.ready && room.player2.ready) {
          room.status = "in-progress";
          if (!room.startTime) room.startTime = new Date();
          room.recentActivity.unshift({
            id: "act-" + Date.now() + "-start",
            text: `🏁 Both players chosen! Match is now LIVE!`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            playerName: "System"
          });
        }

        if (room.recentActivity.length > 10) {
          room.recentActivity = room.recentActivity.slice(0, 10);
        }

        await room.save();
        io.to(cleanCode).emit("block_selected", {
          playerRole,
          blockId,
          room
        });
        io.to(cleanCode).emit("game_updated", room);
      } catch (err) {
        console.error("select_block socket error:", err);
      }
    });

    // Real-time task completion toggle
    socket.on("toggle_task", async ({ roomCode, playerRole, taskId, taskText }) => {
      if (!roomCode || !playerRole || !taskId) return;
      const cleanCode = roomCode.trim().toUpperCase();

      try {
        const room = await GameRoom.findOne({ roomCode: cleanCode });
        if (!room) {
          return socket.emit("error_message", "Room not found");
        }

        if (room.status === "completed") {
          return socket.emit("error_message", "This game has already completed");
        }

        const player = room[playerRole];
        if (!player) {
          return socket.emit("error_message", "Invalid player role");
        }

        const alreadyChecked = player.completedTaskIds.includes(taskId);
        if (alreadyChecked) {
          player.completedTaskIds = player.completedTaskIds.filter((id) => id !== taskId);
        } else {
          player.completedTaskIds.push(taskId);
        }

        player.score = player.completedTaskIds.length;

        // Activity log
        const activityItem = {
          id: "act-" + Date.now() + Math.random(),
          text: alreadyChecked
            ? `${player.name} unchecked "${(taskText || taskId).slice(0, 32)}..."`
            : `🎯 ${player.name} spotted "${(taskText || taskId).slice(0, 32)}..." (${player.score}/10)`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          playerName: player.name
        };

        room.recentActivity.unshift(activityItem);
        if (room.recentActivity.length > 10) {
          room.recentActivity = room.recentActivity.slice(0, 10);
        }

        // Check for WIN condition: first to 10 spots
        if (player.score === 10) {
          const otherRole = playerRole === "player1" ? "player2" : "player1";
          const otherPlayer = room[otherRole];
          const isTie = otherPlayer && otherPlayer.score === 10;

          room.status = "completed";
          room.winnerName = isTie ? "Tie / Draw" : player.name;
          room.winnerUserId = !isTie && player.userId ? player.userId : null;
          room.isTie = isTie;
          room.endTime = new Date();

          if (room.startTime) {
            room.durationMinutes = Math.max(
              1,
              Math.round((room.endTime.getTime() - new Date(room.startTime).getTime()) / 60000)
            );
          } else {
            room.durationMinutes = 1;
          }

          // Update user statistics if registered
          try {
            if (player.userId) {
              await User.findByIdAndUpdate(player.userId, {
                $inc: {
                  gamesPlayed: 1,
                  gamesWon: isTie ? 0 : 1,
                  tasksCompleted: player.score
                }
              });
            }
            if (otherPlayer && otherPlayer.userId) {
              await User.findByIdAndUpdate(otherPlayer.userId, {
                $inc: {
                  gamesPlayed: 1,
                  gamesWon: isTie ? 0 : 0,
                  tasksCompleted: otherPlayer.score
                }
              });
            }
          } catch (statErr) {
            console.error("Failed to update user stats:", statErr);
          }

          await room.save();

          // Broadcast WIN celebration to both players
          io.to(cleanCode).emit("game_over", {
            winnerName: room.winnerName,
            isTie,
            durationMinutes: room.durationMinutes,
            room
          });
          io.to(cleanCode).emit("game_updated", room);
          return;
        }

        // Save progress
        await room.save();

        // Broadcast real-time update to everyone in room
        io.to(cleanCode).emit("game_updated", room);

        // Targeted event so opponent sees instant notification
        socket.to(cleanCode).emit("opponent_task_updated", {
          playerRole,
          playerName: player.name,
          score: player.score,
          completedTaskIds: player.completedTaskIds,
          taskText,
          alreadyChecked
        });
      } catch (err) {
        console.error("Error handling toggle_task:", err);
        socket.emit("error_message", "Failed to update task");
      }
    });

    // Real-time quick reaction/chat
    socket.on("send_reaction", ({ roomCode, playerName, emoji, message }) => {
      if (!roomCode) return;
      const cleanCode = roomCode.trim().toUpperCase();
      io.to(cleanCode).emit("new_reaction", {
        playerName,
        emoji,
        message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

