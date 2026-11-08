import mongoose from "mongoose";

const gameRoomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: ["waiting", "selecting_blocks", "in-progress", "completed", "abandoned"],
      default: "waiting"
    },
    location: {
      type: String,
      default: "Pune City Streets"
    },
    player1: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: {
        type: String,
        required: true
      },
      blockId: {
        type: String,
        default: ""
      },
      completedTaskIds: {
        type: [String],
        default: []
      },
      score: {
        type: Number,
        default: 0
      },
      ready: {
        type: Boolean,
        default: false
      }
    },
    player2: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
      name: {
        type: String,
        default: ""
      },
      blockId: {
        type: String,
        default: ""
      },
      completedTaskIds: {
        type: [String],
        default: []
      },
      score: {
        type: Number,
        default: 0
      },
      ready: {
        type: Boolean,
        default: false
      }
    },
    winnerName: {
      type: String,
      default: null
    },
    winnerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    isTie: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    durationMinutes: {
      type: Number,
      default: 0
    },
    qrCodeDataUrl: {
      type: String,
      default: ""
    },
    recentActivity: [
      {
        id: String,
        text: String,
        time: String,
        playerName: String
      }
    ]
  },
  {
    timestamps: true
  }
);

export const GameRoom = mongoose.model("GameRoom", gameRoomSchema);

