"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Gamepad2,
  CheckCircle2,
  Circle,
  XCircle,
  Sparkles,
  MapPin,
  Clock,
  QrCode,
  Copy,
  Check,
  Share2,
  Users,
  Wifi,
  Smartphone,
  Zap,
  Flame,
  AlertTriangle,
  PlayCircle,
  ArrowRight,
  Radio,
  Camera,
  Layers,
  Info
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { TASK_BLOCKS } from "@/data/data";
import { getSocket } from "@/lib/api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import QRScanner from "@/components/game/QRScanner";

function PlayPageContent() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room") || "";

  const {
    liveRoom,
    playerRole,
    opponentAlert,
    createLiveRoom,
    joinLiveRoom,
    selectLiveBlock,
    toggleLiveTask,
    abandonLiveRoom
  } = useGame();

  const { user } = useAuth();

  // Active Tab for Room Setup: "create" | "join"
  const [activeTab, setActiveTab] = useState(() => (roomParam ? "join" : "create"));

  // Create Room state
  const [createLocation, setCreateLocation] = useState("FC Road & Deccan");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Join Room state
  const [joinCode, setJoinCode] = useState(roomParam.toUpperCase());
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  // Copy states
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reaction banter
  const [incomingReaction, setIncomingReaction] = useState(null);

  // Confirmation modal state
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Mobile arena view: "myTasks" | "opponent"
  const [mobileArenaTab, setMobileArenaTab] = useState("myTasks");

  // If roomParam arrives via QR scan or URL, switch to join tab
  useEffect(() => {
    if (roomParam) {
      setActiveTab("join");
      setJoinCode(roomParam.toUpperCase());
    }
  }, [roomParam]);

  // Timer effect for active match
  useEffect(() => {
    const currentStartTime = liveRoom?.startTime;
    const isCompleted = liveRoom?.status === "completed";

    if (!currentStartTime || isCompleted || liveRoom?.status !== "in-progress") return;

    const startMs = new Date(currentStartTime).getTime();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startMs) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [liveRoom?.startTime, liveRoom?.status]);

  // Socket reaction listener
  useEffect(() => {
    if (!liveRoom?.roomCode) return;
    const socket = getSocket();

    const handleNewReaction = (data) => {
      setIncomingReaction(data);
      setTimeout(() => setIncomingReaction(null), 3000);
    };

    socket.on("new_reaction", handleNewReaction);
    return () => {
      socket.off("new_reaction", handleNewReaction);
    };
  }, [liveRoom?.roomCode]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    const res = await createLiveRoom({
      location: createLocation,
      playerName: user?.username || "Host Player"
    });

    setCreateLoading(false);
    if (!res.success) {
      setCreateError(res.message || "Failed to create challenge room");
    }
  };

  const executeJoin = async (codeToJoin) => {
    const targetCode = (codeToJoin || joinCode).trim().toUpperCase();
    if (!targetCode) {
      setJoinError("Please enter the 6-character room code");
      return;
    }

    setJoinLoading(true);
    setJoinError("");

    const res = await joinLiveRoom({
      roomCode: targetCode,
      playerName: user?.username || "Player 2"
    });

    setJoinLoading(false);
    if (!res.success) {
      setJoinError(res.message || "Could not find or join room. Please check the code.");
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    executeJoin(joinCode);
  };

  const handleQrScanned = (scannedRoomCode) => {
    setJoinCode(scannedRoomCode);
    setShowScanner(false);
    executeJoin(scannedRoomCode);
  };

  const copyToClipboard = (text, type = "code") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  const sendReaction = (emoji, text) => {
    if (!liveRoom?.roomCode || !playerRole) return;
    const socket = getSocket();
    const myName = liveRoom[playerRole]?.name || user?.username || "Player";
    socket.emit("send_reaction", {
      roomCode: liveRoom.roomCode,
      playerName: myName,
      emoji,
      message: text
    });
  };

  // -------------------------------------------------------------
  // VIEW 1: ACTIVE LIVE ROOM
  // -------------------------------------------------------------
  if (liveRoom) {
    const isWaiting = liveRoom.status === "waiting";
    const isSelectingBlocks =
      liveRoom.status === "selecting_blocks" ||
      (!liveRoom.player1?.blockId || !liveRoom.player2?.blockId) &&
      liveRoom.player2?.name;

    const myRole = playerRole || "player1";
    const oppRole = myRole === "player1" ? "player2" : "player1";
    const myPlayer = liveRoom[myRole] || { name: user?.username || "You", blockId: "", completedTaskIds: [] };
    const oppPlayer = liveRoom[oppRole] || { name: "Opponent", blockId: "", completedTaskIds: [] };

    const joinUrl = typeof window !== "undefined"
      ? `${window.location.origin}/play?room=${liveRoom.roomCode}`
      : `http://localhost:3000/play?room=${liveRoom.roomCode}`;

    // STAGE 1: LOBBY / WAITING FOR PLAYER 2 TO JOIN
    if (isWaiting) {
      return (
        <div className="max-w-xl mx-auto space-y-4 sm:space-y-6 animate-fade-in py-2">
          <div className="glass-card rounded-3xl p-5 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge-green text-xs font-black shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>Room Created • Waiting for Player 2</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Your Challenge Room is Live! 🎯
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-sm mx-auto">
                Player 2 can scan this QR code or enter the code from their device.
              </p>
            </div>

            {/* Room Code Display in Glass Pill Box */}
            <div className="p-4 sm:p-5 rounded-3xl glass-panel-subtle border-2 border-sky-300 shadow-md inline-block w-full max-w-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-900 block mb-0.5">
                Room Number / Code
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-[#0369a1]">
                  {liveRoom.roomCode}
                </span>
                <button
                  onClick={() => copyToClipboard(liveRoom.roomCode, "code")}
                  className="p-2 rounded-xl glass-pill hover:bg-white text-[#0369a1] transition-all active:scale-95 shadow-sm"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-sky-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* QR Code Container with Frosted Glow */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="p-4 bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-sky-200 shadow-2xl inline-block">
                {liveRoom.qrCodeDataUrl ? (
                  <img
                    src={liveRoom.qrCodeDataUrl}
                    alt={`QR Code to join room ${liveRoom.roomCode}`}
                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-2xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-400 text-xs rounded-2xl font-bold">
                    Generating QR Code...
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-slate-700 mt-2.5 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#0284c7]" />
                <span>Player 2 scans this QR code with camera</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
              <button
                onClick={() => copyToClipboard(joinUrl, "link")}
                className="w-full sm:w-auto px-4 py-2 rounded-xl glass-pill hover:bg-white text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Share2 className="w-3.5 h-3.5 text-[#0284c7]" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Direct Join Link"}</span>
              </button>

              <button
                onClick={abandonLiveRoom}
                className="w-full sm:w-auto px-4 py-2 rounded-xl glass-pill hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Room</span>
              </button>
            </div>

            <div className="pt-3 border-t border-white/60 flex items-center justify-center gap-3 text-xs text-slate-500 font-semibold flex-wrap">
              <span>Host: <strong className="text-slate-800">{liveRoom.player1.name}</strong></span>
              <span>•</span>
              <span>Route: <strong className="text-slate-800">{liveRoom.location}</strong></span>
            </div>
          </div>
        </div>
      );
    }

    // STAGE 2: BOTH PLAYERS CONNECTED -> CHOOSE SPOTTING BLOCK STAGE
    if (isSelectingBlocks) {
      const p1Chosen = !!liveRoom.player1?.blockId;
      const p2Chosen = !!liveRoom.player2?.blockId;
      const myBlockChoice = myPlayer.blockId;

      return (
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-fade-in py-2">
          {/* Top Status Banner */}
          <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-2xl text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge-green text-xs font-black shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Both Players Connected in Room {liveRoom.roomCode}!</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Choose Your Spotting Block 🎯
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-lg mx-auto">
                Select which 10-task pack you want to hunt. When both of you pick, the live race begins!
              </p>
            </div>

            {/* Real-time Player Selection Status Bar */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div
                className={`p-3 rounded-2xl border transition-all text-left ${
                  p1Chosen
                    ? "glass-badge-green border-sky-300 shadow-sm"
                    : "glass-panel-subtle border-white/80"
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-500">
                  Player 1 (Host)
                </span>
                <span className="text-xs font-black text-slate-900 block truncate">
                  {liveRoom.player1.name}
                </span>
                <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1 mt-0.5">
                  {p1Chosen ? (
                    <>
                      <Check className="w-3 h-3 text-sky-600" />
                      <span>Selected Block {liveRoom.player1.blockId}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-medium italic">Choosing pack...</span>
                  )}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border transition-all text-left ${
                  p2Chosen
                    ? "glass-badge-green border-sky-300 shadow-sm"
                    : "glass-panel-subtle border-white/80"
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-500">
                  Player 2
                </span>
                <span className="text-xs font-black text-slate-900 block truncate">
                  {liveRoom.player2?.name || "Player 2"}
                </span>
                <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1 mt-0.5">
                  {p2Chosen ? (
                    <>
                      <Check className="w-3 h-3 text-sky-600" />
                      <span>Selected Block {liveRoom.player2.blockId}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-medium italic">Choosing pack...</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Spotting Block Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.values(TASK_BLOCKS).map((block) => {
              const isMyChoice = myBlockChoice === block.id;
              const isOppChoice = oppPlayer.blockId === block.id;

              return (
                <div
                  key={block.id}
                  className={`glass-card rounded-3xl p-4 sm:p-5 shadow-xl border transition-all flex flex-col justify-between ${
                    isMyChoice
                      ? "border-sky-500 ring-2 ring-sky-500/40 shadow-sky-950/10 scale-[1.01]"
                      : "border-white/80 glass-card-hover"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0369a1] to-[#0284c7] text-white flex items-center justify-center font-black text-lg shadow-md">
                          {block.id}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-800">
                            {block.category}
                          </span>
                          <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                            {block.title}
                          </h3>
                        </div>
                      </div>

                      {isMyChoice && (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-black shadow-sm">
                          Your Pick ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {block.description}
                    </p>

                    {/* Preview of top 3 tasks */}
                    <div className="space-y-1 pt-1">
                      {block.tasks.slice(0, 3).map((task, idx) => (
                        <div
                          key={task.id}
                          className="text-[11px] p-1.5 rounded-xl glass-panel-subtle text-slate-700 flex items-start gap-1.5"
                        >
                          <span className="w-3.5 h-3.5 rounded-full bg-sky-100 text-[#0369a1] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="truncate font-medium">{task.text}</span>
                        </div>
                      ))}
                      <span className="text-[10px] text-slate-400 italic block pl-1">
                        + 7 more spotting items
                      </span>
                    </div>
                  </div>

                  {/* Block Selection Button */}
                  <div className="pt-3 border-t border-white/60 mt-3">
                    <button
                      type="button"
                      onClick={() => selectLiveBlock(block.id)}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                        isMyChoice
                          ? "bg-sky-600 text-white ring-2 ring-sky-300 shadow-md"
                          : "glass-button-primary text-white"
                      }`}
                    >
                      {isMyChoice ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected Block {block.id} (Ready!)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7dd3fc]" />
                          <span>Select Block {block.id}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom helper */}
          <div className="text-center text-xs text-slate-500 font-semibold pt-1">
            {myBlockChoice && !oppPlayer.blockId ? (
              <span className="text-emerald-800 animate-pulse">
                ✓ You selected Block {myBlockChoice}! Waiting for {oppPlayer.name || "Opponent"} to pick...
              </span>
            ) : !myBlockChoice && oppPlayer.blockId ? (
              <span className="text-amber-800 font-bold">
                ⚡ {oppPlayer.name || "Opponent"} selected Block {oppPlayer.blockId}! Please choose your block above.
              </span>
            ) : null}
          </div>
        </div>
      );
    }

    // STAGE 3: LIVE MATCH ARENA (Both players connected & blocks selected)
    const myBlock = TASK_BLOCKS[myPlayer.blockId] || TASK_BLOCKS.A;
    const oppBlock = TASK_BLOCKS[oppPlayer.blockId] || TASK_BLOCKS.B;

    const myCompletedIds = myPlayer.completedTaskIds || [];
    const oppCompletedIds = oppPlayer.completedTaskIds || [];

    const myScore = myCompletedIds.length;
    const oppScore = oppCompletedIds.length;

    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in py-2">
        {/* Real-time Opponent Toast alert */}
        {opponentAlert && (
          <div className="glass-hero text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-bounce border border-sky-300/40">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <Zap className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <span>{opponentAlert.text}</span>
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
              Live Feed
            </span>
          </div>
        )}

        {/* Floating live reaction alert */}
        {incomingReaction && (
          <div className="glass-card bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold max-w-sm mx-auto animate-fade-in border border-slate-700">
            <span className="text-2xl">{incomingReaction.emoji}</span>
            <span>
              <strong>{incomingReaction.playerName}:</strong> {incomingReaction.message}
            </span>
          </div>
        )}

        {/* Top Match Header in Glass Panel */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-sky-900 uppercase tracking-widest mb-0.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600" />
              </span>
              <span>Room: {liveRoom.roomCode} • Live 2-Player Match</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-[#0369a1]">{myPlayer.name} (Block {myPlayer.blockId})</span>
              <span className="text-slate-400 font-normal text-xs sm:text-sm">vs</span>
              <span className="text-[#0284c7]">{oppPlayer.name || "Opponent"} (Block {oppPlayer.blockId})</span>
            </h2>

            <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-0.5 font-semibold flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
                {liveRoom.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatTimer(elapsedSeconds)}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-sky-800">
                <Wifi className="w-3 h-3 text-sky-600" />
                Live Socket Sync
              </span>
            </div>
          </div>

          {/* Quick Reaction buttons & Abandon */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden sm:flex items-center gap-1 glass-pill p-1 rounded-2xl">
              <button
                onClick={() => sendReaction("👋", "High Five!")}
                title="Send High Five"
                className="px-2 py-0.5 hover:bg-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                👋
              </button>
              <button
                onClick={() => sendReaction("⚡", "Spotted fast!")}
                title="Send Fast Spot"
                className="px-2 py-0.5 hover:bg-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                ⚡
              </button>
              <button
                onClick={() => sendReaction("☕", "Chai break?")}
                title="Send Chai"
                className="px-2 py-0.5 hover:bg-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                ☕
              </button>
              <button
                onClick={() => sendReaction("🔥", "In the lead!")}
                title="Send Fire"
                className="px-2 py-0.5 hover:bg-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                🔥
              </button>
            </div>

            <button
              onClick={() => setConfirmAbandon(true)}
              className="px-3 py-1.5 rounded-xl glass-pill hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Quit Room</span>
            </button>
          </div>
        </div>

        {/* Abandon Confirmation modal */}
        {confirmAbandon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="glass-card rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-white/80">
              <div className="flex items-center gap-2 text-rose-600 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-extrabold text-sm text-slate-900">Forfeit this match?</h4>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                Leaving room {liveRoom.roomCode} will end the game for both players.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmAbandon(false)}
                  className="px-3.5 py-1.5 rounded-xl glass-pill hover:bg-white text-slate-700 text-xs font-bold"
                >
                  Keep Playing
                </button>
                <button
                  onClick={() => {
                    abandonLiveRoom();
                    setConfirmAbandon(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
                >
                  Abandon Match
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden p-1 glass-panel rounded-2xl gap-1">
          <button
            onClick={() => setMobileArenaTab("myTasks")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileArenaTab === "myTasks"
                ? "glass-button-primary text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>My Tasks ({myScore}/10)</span>
          </button>
          <button
            onClick={() => setMobileArenaTab("opponent")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileArenaTab === "opponent"
                ? "glass-button-primary text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Opponent ({oppScore}/10)</span>
          </button>
        </div>

        {/* ARENA: 2-COLUMN VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* MY PERSONAL CHECKLIST (Interactive) */}
          <div className={`lg:col-span-7 space-y-3 ${mobileArenaTab === "opponent" ? "hidden lg:block" : "block"}`}>
            <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0369a1] glass-badge-green px-2.5 py-0.5 rounded-full inline-block mb-0.5">
                    Your Tasks (Block {myPlayer.blockId})
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {myBlock.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Tap items as you spot them!</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#0369a1]">
                    {myScore}
                    <span className="text-xs font-normal text-slate-400">/10</span>
                  </span>
                  <div className="text-[10px] font-bold text-sky-800">
                    {myScore * 10}% Done
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/60">
                <div
                  className="bg-gradient-to-r from-[#0369a1] to-[#0284c7] h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${(myScore / 10) * 100}%` }}
                />
              </div>

              {/* Task Checklist */}
              <div className="space-y-2 pt-1">
                {myBlock.tasks.map((task, index) => {
                  const isChecked = myCompletedIds.includes(task.id);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleLiveTask(task.id, task.text)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-2.5 active:scale-[0.99] glass-card-hover ${
                        isChecked
                          ? "glass-badge-green border-sky-300 ring-1 ring-sky-300/40"
                          : "glass-panel-subtle hover:bg-white/90 border-white/80"
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-[#0369a1] fill-sky-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-sky-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                            #{index + 1}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-sky-50 text-[#0369a1] border border-sky-200">
                            {task.category}
                          </span>
                          {isChecked && (
                            <span className="text-[9px] font-bold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded-full border border-sky-300/50">
                              ✓ Spotted!
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs sm:text-sm font-bold transition-colors ${
                            isChecked ? "text-slate-500 line-through" : "text-slate-900"
                          }`}
                        >
                          {task.text}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{task.hint}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OPPONENT'S LIVE PROGRESS (Watching Device 2) */}
          <div className={`lg:col-span-5 space-y-3 ${mobileArenaTab === "myTasks" ? "hidden lg:block" : "block"}`}>
            <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-xl space-y-3.5 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-sky-100/90 border border-sky-300 flex items-center justify-center font-black text-xs text-[#0284c7] shadow-sm">
                    {oppPlayer.name ? oppPlayer.name.slice(0, 2).toUpperCase() : "OP"}
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-sky-800 block">
                      Live Opponent
                    </span>
                    <h4 className="font-black text-sm sm:text-base text-slate-900">
                      {oppPlayer.name || "Opponent"}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Block {oppPlayer.blockId}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#0284c7]">
                    {oppScore}
                    <span className="text-xs font-normal text-slate-400">/10</span>
                  </span>
                  <div className="text-[10px] font-bold text-sky-800">
                    {oppScore * 10}% Done
                  </div>
                </div>
              </div>

              {/* Opponent Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Opponent Progress</span>
                  <span className="font-bold text-slate-800">{10 - oppScore} spots remaining</span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/60">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-[#0284c7] h-full rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${(oppScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Standing indicator */}
              <div className="p-3 rounded-2xl glass-panel-subtle border border-sky-200/60">
                {myScore > oppScore ? (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#0369a1]">
                    <Flame className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>You are leading by {myScore - oppScore} spots! Keep looking!</span>
                  </div>
                ) : myScore < oppScore ? (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Opponent leads by {oppScore - myScore} spots! Scan faster!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                    <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
                    <span>Tied at {myScore}/10 spots! Race is on!</span>
                  </div>
                )}
              </div>

              {/* Live Spotting Feed */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#0284c7] animate-pulse" />
                  Live Spotting Activity
                </span>

                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {liveRoom.recentActivity && liveRoom.recentActivity.length > 0 ? (
                    liveRoom.recentActivity.map((act) => (
                      <div
                        key={act.id}
                        className="text-[11px] p-2 rounded-xl glass-panel-subtle border border-white/80 text-slate-700 flex items-center justify-between gap-2 font-medium"
                      >
                        <span className="truncate">{act.text}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono font-semibold">{act.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-2 text-center">
                      Waiting for first spotting event...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: NO GAME RUNNING -> ROOM SETUP (Create Room / Join Room)
  // -------------------------------------------------------------
  const PUNE_HOTSPOTS = [
    "FC Road & Deccan",
    "JM Road",
    "Koregaon Park",
    "Swargate"
  ];

  return (
    <div className="max-w-lg mx-auto space-y-3.5 sm:space-y-5 animate-fade-in py-1 sm:py-3">
      {/* Header */}
      <div className="text-center px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-green text-xs font-black mb-1.5 shadow-sm">
          <Gamepad2 className="w-3.5 h-3.5 text-[#16845B]" />
          <span>Multiplayer Arena</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Play Pune Travel Hunt 🎯
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-xs mx-auto">
          Create a room to get a QR code, or join your friend&apos;s room.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-5">
        {/* Clean Segmented Glass Tab Switcher (100% Mobile Responsive) */}
        <div className="flex p-1 rounded-2xl glass-panel-subtle gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "create"
                ? "glass-button-primary text-white shadow-md"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <QrCode className="w-4 h-4 shrink-0" />
            <span className="truncate">Create Room</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "join"
                ? "glass-button-primary text-white shadow-md"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Camera className="w-4 h-4 shrink-0" />
            <span className="truncate">Join Room</span>
          </button>
        </div>

        {/* TAB 1: CREATE ROOM */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateRoom} className="space-y-3.5">
            {createError && (
              <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Pune Route / Area
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#16845B] absolute left-3 top-3" />
                <input
                  type="text"
                  value={createLocation}
                  onChange={(e) => setCreateLocation(e.target.value)}
                  placeholder="e.g. FC Road & Deccan"
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
                />
              </div>

              {/* Quick Route Hotspots */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <span className="text-[10px] font-bold text-slate-400">Quick Pick:</span>
                {PUNE_HOTSPOTS.map((hotspot) => (
                  <button
                    key={hotspot}
                    type="button"
                    onClick={() => setCreateLocation(hotspot)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all active:scale-95 ${
                      createLocation === hotspot
                        ? "bg-emerald-600 text-white"
                        : "glass-pill text-slate-600 hover:text-[#064E3B]"
                    }`}
                  >
                    {hotspot}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-badge-green flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#16845B] shrink-0" />
              <span className="text-[11px] text-emerald-950 font-medium">
                Host: <strong className="font-extrabold">{user?.username}</strong> • Generates QR Code & Room Code for Player 2.
              </span>
            </div>

            <button
              type="submit"
              disabled={createLoading}
              className="w-full py-3 sm:py-3.5 rounded-2xl glass-button-primary disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20 active:scale-[0.99] transition-all"
            >
              {createLoading ? (
                <span>Generating Room & QR Code...</span>
              ) : (
                <>
                  <span>Create Challenge Room</span>
                  <ArrowRight className="w-4 h-4 text-[#65C49A]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: JOIN ROOM */}
        {activeTab === "join" && (
          <div className="space-y-3.5">
            {joinError && (
              <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{joinError}</span>
              </div>
            )}

            {roomParam && (
              <div className="p-3 rounded-2xl glass-badge-green text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Room code {roomParam} filled from your scan!</span>
              </div>
            )}

            {/* LIVE CAMERA SCANNER VIEW or PROMINENT SCAN BUTTON */}
            {showScanner ? (
              <QRScanner
                onScanSuccess={handleQrScanned}
                onClose={() => setShowScanner(false)}
              />
            ) : (
              <div className="space-y-3.5">
                {/* 1-Tap Camera Scanner CTA */}
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="w-full py-3.5 px-4 rounded-2xl glass-badge-green border-2 border-emerald-400 hover:border-emerald-500 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] text-[#064E3B]"
                >
                  <Camera className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span>Scan QR Code with Camera</span>
                </button>

                {/* Clean subtle divider */}
                <div className="flex items-center gap-3 py-0.5">
                  <div className="flex-1 h-px bg-slate-200/80" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    OR ENTER 6-LETTER CODE
                  </span>
                  <div className="flex-1 h-px bg-slate-200/80" />
                </div>

                {/* Manual Code Input Form */}
                <form onSubmit={handleJoinSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 text-center">
                      Room Number / Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="e.g. PUNE84"
                      className="w-full text-center px-4 py-2.5 sm:py-3 text-lg sm:text-xl font-black font-mono tracking-widest uppercase rounded-xl glass-input text-slate-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={joinLoading}
                    className="w-full py-3 sm:py-3.5 rounded-2xl glass-button-primary disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-950/20 active:scale-[0.99] transition-all"
                  >
                    {joinLoading ? (
                      <span>Connecting to Room...</span>
                    ) : (
                      <>
                        <span>Join Room & Choose Pack</span>
                        <PlayCircle className="w-4 h-4 text-[#65C49A]" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto p-12 text-center text-slate-500 font-semibold">
          Loading Pune Travel Hunt...
        </div>
      }
    >
      <ProtectedRoute title="Sign In to Play Pune Travel Hunt">
        <PlayPageContent />
      </ProtectedRoute>
    </Suspense>
  );
}
