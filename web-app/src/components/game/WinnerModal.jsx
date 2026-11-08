"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  RotateCcw,
  LayoutDashboard,
  MapPin,
  Clock,
  History
} from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function WinnerModal() {
  const {
    winnerModalOpen,
    setWinnerModalOpen,
    latestFinishedGame,
    restartSameMatch
  } = useGame();

  if (!winnerModalOpen || !latestFinishedGame) return null;

  const {
    winnerName,
    isTie,
    player1,
    player2,
    location,
    durationMinutes
  } = latestFinishedGame;

  const isP1Winner = player1?.winner || (!isTie && winnerName === player1?.name);
  const isP2Winner = player2?.winner || (!isTie && winnerName === player2?.name);
  const p1Score = typeof player1?.score === "number" ? player1.score : (player1?.completedTaskIds?.length || 0);
  const p2Score = typeof player2?.score === "number" ? player2.score : (player2?.completedTaskIds?.length || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/80 relative overflow-hidden transform transition-all scale-100 max-h-[92vh] overflow-y-auto">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Winner Badge and Trophy */}
        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#064E3B] via-[#0b684f] to-[#16845B] text-white shadow-xl shadow-emerald-900/30 mb-4 animate-bounce">
            <Trophy className="w-10 h-10 text-[#65C49A]" />
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full glass-badge-green text-xs font-black tracking-widest uppercase mb-2 shadow-sm">
            {isTie ? "Incredible Simultaneous Finish!" : "Victory Achieved! 🏆"}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isTie ? "It's a Magnificent Tie!" : `${winnerName} Wins!`}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-xs mx-auto">
            {isTie
              ? "Both explorers successfully spotted all 10 items across Pune!"
              : `Fastest eyes in Pune! 10 spotting tasks completed before the rival.`}
          </p>
        </div>

        {/* Match Breakdown Card in Frosted Glass */}
        <div className="relative my-6 p-4 rounded-2xl glass-panel-subtle border border-white/80 shadow-inner">
          <div className="grid grid-cols-2 gap-3.5 pb-3 mb-3 border-b border-white/60 text-center">
            {/* Player 1 Card */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                isP1Winner
                  ? "glass-badge-green border-emerald-300 ring-2 ring-emerald-300/60 shadow-md"
                  : "glass-pill border-white/60"
              }`}
            >
              <div className="text-xs font-black text-slate-800 truncate">{player1?.name || "Player 1"}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Block {player1?.blockId || "A"}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {p1Score}
                <span className="text-xs font-normal text-slate-400">/10</span>
              </div>
              {isP1Winner && (
                <span className="inline-block mt-1 text-[10px] font-black text-emerald-900 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm">
                  Champion
                </span>
              )}
            </div>

            {/* Player 2 Card */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                isP2Winner
                  ? "glass-badge-green border-emerald-300 ring-2 ring-emerald-300/60 shadow-md"
                  : "glass-pill border-white/60"
              }`}
            >
              <div className="text-xs font-black text-slate-800 truncate">{player2?.name || "Player 2"}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Block {player2?.blockId || "B"}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {p2Score}
                <span className="text-xs font-normal text-slate-400">/10</span>
              </div>
              {isP2Winner && (
                <span className="inline-block mt-1 text-[10px] font-black text-emerald-900 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm">
                  Champion
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
              {location}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {durationMinutes} mins
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={restartSameMatch}
            className="w-full py-3.5 px-4 rounded-2xl glass-button-primary text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20 active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#65C49A]" />
            Rematch with Same Players
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/history"
              onClick={() => setWinnerModalOpen(false)}
              className="py-2.5 px-3 rounded-xl glass-pill hover:bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <History className="w-3.5 h-3.5 text-[#16845B]" />
              View History
            </Link>

            <Link
              href="/"
              onClick={() => setWinnerModalOpen(false)}
              className="py-2.5 px-3 rounded-xl glass-pill hover:bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Close Button top-right */}
        <button
          onClick={() => setWinnerModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl glass-pill text-xs font-bold transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
