"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  Share2,
  Calendar,
  MapPin,
  Clock
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden transform transition-all scale-100 max-h-[92vh] overflow-y-auto">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-100 rounded-full blur-3xl opacity-60" />

        {/* Winner Badge and Trophy */}
        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#064E3B] to-[#16845B] text-white shadow-lg shadow-emerald-900/30 mb-4 animate-bounce">
            <Trophy className="w-10 h-10 text-[#65C49A]" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-bold tracking-wider uppercase mb-2">
            {isTie ? "Incredible Simultaneous Finish!" : "Victory Achieved! 🏆"}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTie ? "It's a Magnificent Tie!" : `${winnerName} Wins!`}
          </h2>

          <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
            {isTie
              ? "Both explorers successfully spotted all 10 items across Pune!"
              : `Fastest eyes in Pune! 10 spotting tasks completed before the rival.`}
          </p>
        </div>

        {/* Match Breakdown Card */}
        <div className="relative my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="grid grid-cols-2 gap-4 pb-3 mb-3 border-b border-slate-200/60 text-center">
            {/* Player 1 Card */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                player1.winner
                  ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="text-xs font-bold text-slate-700 truncate">{player1.name}</div>
              <div className="text-[10px] text-slate-400 font-medium">Block {player1.blockId}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {player1.score}
                <span className="text-xs font-normal text-slate-400">/10</span>
              </div>
              {player1.winner && (
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Champion
                </span>
              )}
            </div>

            {/* Player 2 Card */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                player2.winner
                  ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="text-xs font-bold text-slate-700 truncate">{player2.name}</div>
              <div className="text-[10px] text-slate-400 font-medium">Block {player2.blockId}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {player2.score}
                <span className="text-xs font-normal text-slate-400">/10</span>
              </div>
              {player2.winner && (
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Champion
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
              {location}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {durationMinutes} mins
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={restartSameMatch}
            className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4 text-[#65C49A]" />
            Rematch with Same Players
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/leaderboard"
              onClick={() => setWinnerModalOpen(false)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-[#16845B]" />
              View Leaderboard
            </Link>

            <Link
              href="/"
              onClick={() => setWinnerModalOpen(false)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Close Button top-right */}
        <button
          onClick={() => setWinnerModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 text-sm font-bold"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
