"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  PlayCircle,
  LogIn,
  UserPlus,
  ArrowRight,
  Wifi,
  Sparkles,
  History,
  Target
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { liveRoom, activeGame } = useGame();

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 glass-card rounded-3xl text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-700">Loading Pune Travel Hunt...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 1: LOGGED IN USER -> CLEAN COMPACT DASHBOARD
  // -------------------------------------------------------------
  if (user) {
    const isGameActive = !!(liveRoom || activeGame);

    return (
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 py-2 sm:py-4 animate-fade-in">
        {/* ONE Main Dashboard Block About the Game in Frosted Glass */}
        <div className="glass-card rounded-3xl p-5 sm:p-8 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0369a1] via-[#0284c7] to-[#0ea5e9] text-white flex items-center justify-center font-black text-base shadow-md shadow-sky-950/20">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-900 glass-badge-green px-2.5 py-0.5 rounded-full inline-block">
                  Explorer Dashboard
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Welcome back, {user.username}!
                </h2>
              </div>
            </div>

            {isGameActive && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge-green text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                <span>
                  {liveRoom ? `Room ${liveRoom.roomCode} live` : "Match active"}
                </span>
              </div>
            )}
          </div>

          {/* About Game Section - Compact & Punchy */}
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0284c7]" />
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  About Pune Travel Hunt
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1 font-medium">
                Real-time 2-player spotting race across Pune. One player hosts a room with a QR code, the other joins on their phone, and both compete to spot 10 Pune landmarks first!
              </p>
            </div>

            {/* Quick 3-step feature summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 sm:p-3.5 rounded-2xl glass-panel-subtle border border-sky-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-[#0369a1] uppercase tracking-wider block">
                  1. Create Room
                </span>
                <p className="text-[11px] text-slate-600 font-medium leading-snug">
                  Host gets 6-digit Room Code & QR.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl glass-panel-subtle border border-cyan-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-[#0284c7] uppercase tracking-wider block">
                  2. Player 2 Joins
                </span>
                <p className="text-[11px] text-slate-600 font-medium leading-snug">
                  Player 2 enters code or scans QR on their phone.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl glass-panel-subtle border border-sky-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-[#0369a1] uppercase tracking-wider block">
                  3. Live Spotting
                </span>
                <p className="text-[11px] text-slate-600 font-medium leading-snug">
                  Check off items live. First to 10 wins!
                </p>
              </div>
            </div>

            {/* If game is active, show quick resume banner */}
            {isGameActive ? (
              <div className="p-3.5 rounded-2xl glass-badge-green border border-sky-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm">
                <div>
                  <p className="text-xs font-extrabold text-[#0369a1] flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                    {liveRoom
                      ? `Active Room: ${liveRoom.roomCode}`
                      : "Pass & Play in progress"}
                  </p>
                  <p className="text-[11px] text-sky-900 font-medium">
                    Your match is live. Open the Play screen to check tasks as you spot them.
                  </p>
                </div>
                <Link
                  href="/play"
                  className="px-4 py-2 rounded-xl glass-button-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm active:scale-95 transition-all"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-[#7dd3fc]" />
                  <span>Resume Game</span>
                </Link>
              </div>
            ) : null}

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <Link
                href="/play"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-button-primary text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950/20 active:scale-95 transition-all"
              >
                <PlayCircle className="w-4 h-4 text-[#7dd3fc]" />
                <span>Play Game (Create or Join Room)</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
              </Link>

              <Link
                href="/history"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl glass-pill hover:bg-white/90 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <History className="w-4 h-4 text-[#0284c7]" />
                <span>View My Game History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: NOT LOGGED IN -> LAPTOP & MOBILE FRIENDLY EXPLAINER
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 py-2 sm:py-6 animate-fade-in">
      {/* Hero Explainer Banner - Sky Theme */}
      <div className="relative overflow-hidden rounded-3xl glass-hero text-white p-5 sm:p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-[#38bdf8]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-52 h-52 rounded-full bg-[#0284c7]/20 blur-3xl pointer-events-none" />

        <div className="relative space-y-3 sm:space-y-4 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#7dd3fc] text-[11px] font-black uppercase tracking-wider shadow-inner">
            <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>2-Player Real-Time Game</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Pune Travel Hunt 🎯
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-sky-50 leading-relaxed font-normal">
            A real-time 2-player spotting race across Pune! Host creates a challenge room with a QR code, Player 2 joins on their phone, and both race to spot 10 Pune landmarks first.
          </p>

          {/* Quick highlight chips on mobile & laptop */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-sky-100 text-[11px] font-bold border border-white/20">
              📱 2 Phones
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-sky-100 text-[11px] font-bold border border-white/20">
              ⚡ Live Sync
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-sky-100 text-[11px] font-bold border border-white/20">
              🏆 First to 10 Spots
            </span>
          </div>

          {/* Sign In / Sign Up Call To Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-white text-[#0369a1] hover:bg-sky-50 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-950/30 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 text-[#0284c7]" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-[#7dd3fc]" />
              <span>Sign Up (Create Account)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* How it Works: 3 Steps (Mobile & Laptop Friendly) */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="text-center max-w-md mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0369a1] glass-badge-green px-2.5 py-0.5 rounded-full">
            Game Logic
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            How The Game Works
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Play across two phones with real-time socket tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border-2 border-sky-200 space-y-2 ">
            <div className="w-8 h-8 rounded-xl bg-blue-300 text-white flex items-center justify-center font-black text-xs shadow-md">
              1
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Player 1 Creates Room
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Click <strong>Create Room</strong> in Play Game. A <strong>QR Code and 6-letter room number</strong> are generated automatically.
            </p>
          </div>

          <div className="p-4 rounded-2xl border-2 border-sky-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-300 text-white flex items-center justify-center font-black text-xs shadow-md">
              2
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Player 2 Scans or Enters No
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              On their own phone, Player 2 scans the QR code or types the room number in <strong>Join Room</strong>. Both enter the live match.
            </p>
          </div>

          <div className="p-4 rounded-2xl border-2 border-sky-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-300 text-white flex items-center justify-center font-black text-xs shadow-md">
              3
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Real-Time Task Sync
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              As you travel, tap tasks the moment you spot them. Your opponent&apos;s screen updates live! First to spot 10 items wins.
            </p>
          </div>
        </div>
      </div>

      {/* Spotting Packs Overview in Glass Card */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card border border-white/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0284c7]" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Authentic Pune City Spotting Tasks
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            PMPML buses, auto-rickshaws, Chitale Bakarwadi, Misal Pav stalls, college backpacks, and Marathi notices!
          </p>
        </div>

        <Link
          href="/login"
          className="px-5 py-2 rounded-xl glass-button-primary text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
        </Link>
      </div>
    </div>
  );
}
