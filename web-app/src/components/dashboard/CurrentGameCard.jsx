"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  PlayCircle,
  XCircle,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Wifi,
  QrCode,
  Users,
  Copy,
  Check,
  Zap,
  Smartphone,
  AlertTriangle,
  Flame,
  Radio,
  ExternalLink
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { TASK_BLOCKS } from "@/data/data";

export default function CurrentGameCard() {
  const router = useRouter();
  const {
    activeGame,
    liveRoom,
    playerRole,
    opponentAlert,
    createLiveRoom,
    joinLiveRoom,
    toggleLiveTask,
    abandonLiveRoom,
    startNewGame,
    abandonGame
  } = useGame();

  const { user } = useAuth();

  // Mode switcher for empty state: "create" | "join" | "offline"
  const [onlineTab, setOnlineTab] = useState("create");

  // Create Room state
  const [createBlock, setCreateBlock] = useState("A");
  const [createLocation, setCreateLocation] = useState("FC Road & Deccan");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Join Room state
  const [joinCode, setJoinCode] = useState("");
  const [joinBlock, setJoinBlock] = useState("B");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Single Device Quick Game state
  const [p1Name, setP1Name] = useState("Aarav");
  const [p2Name, setP2Name] = useState("Tanvi");
  const [p1Block, setP1Block] = useState("A");
  const [p2Block, setP2Block] = useState("B");
  const [location, setLocation] = useState("Swargate to Deccan");

  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Handlers
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    const res = await createLiveRoom({
      blockId: createBlock,
      location: createLocation,
      playerName: user?.username || "Aarav"
    });

    setCreateLoading(false);
    if (!res.success) {
      setCreateError(res.message || "Failed to create challenge room");
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinError("Please enter the 6-character room code");
      return;
    }

    setJoinLoading(true);
    setJoinError("");

    const res = await joinLiveRoom({
      roomCode: joinCode.trim().toUpperCase(),
      blockId: joinBlock,
      playerName: user?.username || "Tanvi"
    });

    setJoinLoading(false);
    if (!res.success) {
      setJoinError(res.message || "Could not join room. Verify the code.");
    }
  };

  const handleStartQuickGame = (e) => {
    e.preventDefault();
    startNewGame({
      player1Name: p1Name,
      player1Block: p1Block,
      player2Name: p2Name,
      player2Block: p2Block,
      location: location
    });
  };

  const copyCode = (code) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const isAnyGameActive = !!(liveRoom || activeGame);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-sm mb-8">
      {/* Real-time Opponent Toast Banner */}
      {opponentAlert && (
        <div className="mb-4 bg-gradient-to-r from-emerald-600 to-[#064E3B] text-white px-4 py-2.5 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Zap className="w-4 h-4 text-[#65C49A] shrink-0" />
            <span>{opponentAlert.text}</span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
            Live Update
          </span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] border border-emerald-100 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-[#16845B]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              Game Arena & Challenge Hub
              {liveRoom && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Live Room: {liveRoom.roomCode}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {liveRoom
                ? `Trail: ${liveRoom.location} • Real-time 2-device multiplayer active`
                : activeGame
                ? `Trail: ${activeGame.location} • Single device pass & play active`
                : "Create a challenge room or join a friend's room with code or QR scan!"}
            </p>
          </div>
        </div>

        {isAnyGameActive && (
          <div className="flex items-center gap-2">
            <Link
              href="/play"
              className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#65C49A]" />
              <span>Full Screen Arena</span>
            </Link>

            <button
              onClick={() => setShowConfirmEnd(true)}
              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
            >
              Quit Game
            </button>
          </div>
        )}
      </div>

      {/* Abandon Confirmation modal */}
      {showConfirmEnd && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-rose-900">Forfeit and quit this match?</p>
            <p className="text-xs text-rose-700">Opponent will be notified that the game was abandoned.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (liveRoom) abandonLiveRoom();
                if (activeGame) abandonGame();
                setShowConfirmEnd(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
            >
              Yes, Quit
            </button>
            <button
              onClick={() => setShowConfirmEnd(false)}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 text-xs font-medium hover:bg-rose-100/50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. ACTIVE LIVE ROOM: WAITING FOR PLAYER 2 LOBBY               */}
      {/* ------------------------------------------------------------- */}
      {liveRoom && liveRoom.status === "waiting" && (
        <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Room Created • Waiting for Player 2</span>
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-slate-900">
              Share Room Code or Scan QR Code
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Player 2 should enter this code in their dashboard or scan the QR code with their mobile camera to connect.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Room Code Box */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm inline-block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Room Code
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black font-mono tracking-widest text-[#064E3B]">
                  {liveRoom.roomCode}
                </span>
                <button
                  onClick={() => copyCode(liveRoom.roomCode)}
                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] transition-colors"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* QR Code */}
            {liveRoom.qrCodeDataUrl && (
              <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm">
                <img
                  src={liveRoom.qrCodeDataUrl}
                  alt="QR Code"
                  className="w-36 h-36 mx-auto rounded-lg object-contain"
                />
                <span className="text-[10px] font-semibold text-slate-500 block mt-1">
                  Scan to Join
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
            <span>Route: <strong>{liveRoom.location}</strong></span>
            <span>•</span>
            <span>Host: <strong>{liveRoom.player1.name} (Block {liveRoom.player1.blockId})</strong></span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ACTIVE LIVE ROOM: MATCH IN PROGRESS (LIVE MULTIPLAYER)      */}
      {/* ------------------------------------------------------------- */}
      {liveRoom && liveRoom.status === "in-progress" && (() => {
        const myRole = playerRole || "player1";
        const oppRole = myRole === "player1" ? "player2" : "player1";
        const myPlayer = liveRoom[myRole] || { name: "You", blockId: "A", completedTaskIds: [] };
        const oppPlayer = liveRoom[oppRole] || { name: "Opponent", blockId: "B", completedTaskIds: [] };

        const myBlock = TASK_BLOCKS[myPlayer.blockId] || TASK_BLOCKS.A;
        const oppBlock = TASK_BLOCKS[oppPlayer.blockId] || TASK_BLOCKS.B;

        const myScore = myPlayer.completedTaskIds?.length || myPlayer.score || 0;
        const oppScore = oppPlayer.completedTaskIds?.length || oppPlayer.score || 0;

        return (
          <div className="space-y-6">
            {/* Split cards for 2 devices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* My Progress Card (with quick interactive task tapping) */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {myPlayer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{myPlayer.name} (You)</h4>
                      <span className="text-[11px] font-semibold text-[#064E3B]">
                        {myBlock.title}
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-black text-[#064E3B]">
                    {myScore}<span className="text-xs font-normal text-slate-400">/10</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#064E3B] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(myScore / 10) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{myScore * 10}% Spotted</span>
                  <span>{10 - myScore} remaining</span>
                </div>

                {/* Quick 3-task inline list */}
                <div className="space-y-1.5 pt-1">
                  {myBlock.tasks.slice(0, 3).map((task) => {
                    const isDone = (myPlayer.completedTaskIds || []).includes(task.id);
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleLiveTask(task.id, task.text)}
                        className={`w-full text-left p-2 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                          isDone
                            ? "bg-emerald-100/70 border-emerald-300 text-slate-500 line-through"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{task.text}</span>
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/play"
                  className="block text-center text-xs font-bold text-[#064E3B] hover:underline pt-1"
                >
                  View all 10 tasks in Arena →
                </Link>
              </div>

              {/* Opponent's Progress Card (Live Watching Device 2) */}
              <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#16845B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {oppPlayer.name ? oppPlayer.name.slice(0, 2).toUpperCase() : "OP"}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{oppPlayer.name || "Opponent"}</h4>
                      <span className="text-[11px] font-semibold text-[#16845B]">
                        Hunting Block {oppPlayer.blockId}
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-black text-[#16845B]">
                    {oppScore}<span className="text-xs font-normal text-slate-400">/10</span>
                  </span>
                </div>

                {/* Opponent Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#16845B] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(oppScore / 10) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{oppScore * 10}% Spotted</span>
                  <span>{10 - oppScore} remaining</span>
                </div>

                {/* Match standing status */}
                <div className="p-2.5 rounded-xl bg-white border border-teal-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
                  {myScore > oppScore ? (
                    <>
                      <Flame className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>You are leading by {myScore - oppScore} points!</span>
                    </>
                  ) : myScore < oppScore ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Opponent is leading by {oppScore - myScore} points!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>Both players tied at {myScore}/10 spots!</span>
                    </>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Updates automatically when opponent taps on their phone!</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------- */}
      {/* 3. NO ACTIVE GAME: DASHBOARD CHALLENGE LAUNCH HUB              */}
      {/* ------------------------------------------------------------- */}
      {!isAnyGameActive && (
        <div className="space-y-6">
          {/* Sub-Tabs: Create Room vs Join Room vs Pass & Play */}
          <div className="flex border-b border-slate-200 gap-4">
            <button
              onClick={() => setOnlineTab("create")}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                onlineTab === "create"
                  ? "border-[#064E3B] text-[#064E3B]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Create Challenge Room (Host)</span>
            </button>

            <button
              onClick={() => setOnlineTab("join")}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                onlineTab === "join"
                  ? "border-[#064E3B] text-[#064E3B]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Join with Room Code / QR</span>
            </button>

            <button
              onClick={() => setOnlineTab("offline")}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                onlineTab === "offline"
                  ? "border-[#064E3B] text-[#064E3B]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pass & Play (1 Device)</span>
            </button>
          </div>

          {/* TAB A: CREATE CHALLENGE ROOM */}
          {onlineTab === "create" && (
            <form onSubmit={handleCreateRoom} className="space-y-4">
              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Challenge Pack
                  </label>
                  <select
                    value={createBlock}
                    onChange={(e) => setCreateBlock(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  >
                    <option value="A">Block A — Pune Mixed Hunt (10 Tasks)</option>
                    <option value="B">Block B — Pune Mixed Hunt (10 Tasks)</option>
                    <option value="C">Block C — Pune Mixed Hunt (10 Tasks)</option>
                    <option value="D">Block D — Pune Mixed Hunt (10 Tasks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pune Exploration Route
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#16845B] shrink-0" />
                    <input
                      type="text"
                      value={createLocation}
                      onChange={(e) => setCreateLocation(e.target.value)}
                      placeholder="e.g. FC Road & Swargate"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#16845B] shrink-0" />
                  <span>
                    Logged in as <strong>{user?.username || "Aarav"}</strong>. Creating generates a <strong>QR Code & 6-letter room code</strong> for Player 2 to join.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] disabled:opacity-50 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-sm transition-all"
                >
                  {createLoading ? (
                    <span>Creating Room...</span>
                  ) : (
                    <>
                      <span>Create Challenge</span>
                      <ArrowRight className="w-4 h-4 text-[#65C49A]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB B: JOIN CHALLENGE ROOM */}
          {onlineTab === "join" && (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              {joinError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Enter 6-Character Room Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. PUNE84"
                    className="w-full px-4 py-2.5 text-base font-black font-mono tracking-widest uppercase rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Challenge Pack
                  </label>
                  <select
                    value={joinBlock}
                    onChange={(e) => setJoinBlock(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
                  >
                    <option value="B">Block B — Pune Mixed Hunt (10 Tasks)</option>
                    <option value="A">Block A — Pune Mixed Hunt (10 Tasks)</option>
                    <option value="C">Block C — Pune Mixed Hunt (10 Tasks)</option>
                    <option value="D">Block D — Pune Mixed Hunt (10 Tasks)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#16845B] shrink-0" />
                  <span>
                    Joining as <strong>{user?.username || "Tanvi"}</strong>. Both dashboards will sync in real time!
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={joinLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#16845B] hover:bg-[#126b4a] disabled:opacity-50 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-sm transition-all"
                >
                  {joinLoading ? (
                    <span>Connecting...</span>
                  ) : (
                    <>
                      <span>Enter Live Room</span>
                      <PlayCircle className="w-4 h-4 text-[#65C49A]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB C: PASS & PLAY (1 DEVICE) */}
          {onlineTab === "offline" && (
            <form onSubmit={handleStartQuickGame} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700">Player 1</span>
                  <input
                    type="text"
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    placeholder="Player 1 Name"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
                  />
                  <select
                    value={p1Block}
                    onChange={(e) => setP1Block(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
                  >
                    <option value="A">Block A (10 Mixed Tasks)</option>
                    <option value="B">Block B (10 Mixed Tasks)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700">Player 2</span>
                  <input
                    type="text"
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                    placeholder="Player 2 Name"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
                  />
                  <select
                    value={p2Block}
                    onChange={(e) => setP2Block(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300"
                  >
                    <option value="B">Block B (10 Mixed Tasks)</option>
                    <option value="A">Block A (10 Mixed Tasks)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold flex items-center gap-2"
                >
                  <span>Start Pass & Play</span>
                  <PlayCircle className="w-4 h-4 text-[#65C49A]" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
