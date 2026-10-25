"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  PlayCircle,
  XCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  User,
  MapPin
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { TASK_BLOCKS } from "@/data/data";

export default function CurrentGameCard() {
  const router = useRouter();
  const { activeGame, startNewGame, abandonGame } = useGame();

  // Quick setup state for dashboard inline start
  const [p1Name, setP1Name] = useState("Aarav");
  const [p2Name, setP2Name] = useState("Tanvi");
  const [p1Block, setP1Block] = useState("A");
  const [p2Block, setP2Block] = useState("B");
  const [location, setLocation] = useState("FC Road & Deccan");
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  const handleStartQuickGame = (e) => {
    e.preventDefault();
    startNewGame({
      player1Name: p1Name,
      player1Block: p1Block,
      player2Name: p2Name,
      player2Block: p2Block,
      location: location
    });
    router.push("/play");
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-sm mb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] border border-emerald-100 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-[#16845B]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              Current Game Status
              {activeGame && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Match
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {activeGame
                ? `Route: ${activeGame.location}`
                : "No active game in progress. Enter explorer names and launch your hunt!"}
            </p>
          </div>
        </div>

        {activeGame && (
          <div className="flex items-center gap-2">
            <Link
              href="/play"
              className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <PlayCircle className="w-4 h-4 text-[#65C49A]" />
              <span>Resume Game</span>
            </Link>

            <button
              onClick={() => setShowConfirmEnd(true)}
              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
            >
              End Game
            </button>
          </div>
        )}
      </div>

      {/* Confirmation dialog for ending game */}
      {showConfirmEnd && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-rose-900">Abandon this ongoing match?</p>
            <p className="text-xs text-rose-700">Current spots will not count as a victory.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                abandonGame();
                setShowConfirmEnd(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
            >
              Yes, Abandon
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

      {/* Active Game Display */}
      {activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Player 1 Progress Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs">
                  {activeGame.player1.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{activeGame.player1.name}</h4>
                  <span className="text-[11px] font-medium text-slate-500">
                    Block {activeGame.player1.blockId} (10 Mixed Tasks)
                  </span>
                </div>
              </div>
              <span className="text-sm font-black text-[#064E3B]">
                {activeGame.player1.completedTaskIds.length}
                <span className="text-xs font-normal text-slate-400">/10</span>
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="bg-[#064E3B] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(activeGame.player1.completedTaskIds.length / 10) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{Math.round((activeGame.player1.completedTaskIds.length / 10) * 100)}% complete</span>
              <span>{10 - activeGame.player1.completedTaskIds.length} spots remaining</span>
            </div>
          </div>

          {/* Player 2 Progress Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#16845B] text-white flex items-center justify-center font-bold text-xs">
                  {activeGame.player2.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{activeGame.player2.name}</h4>
                  <span className="text-[11px] font-medium text-slate-500">
                    Block {activeGame.player2.blockId} (10 Mixed Tasks)
                  </span>
                </div>
              </div>
              <span className="text-sm font-black text-[#16845B]">
                {activeGame.player2.completedTaskIds.length}
                <span className="text-xs font-normal text-slate-400">/10</span>
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="bg-[#16845B] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(activeGame.player2.completedTaskIds.length / 10) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{Math.round((activeGame.player2.completedTaskIds.length / 10) * 100)}% complete</span>
              <span>{10 - activeGame.player2.completedTaskIds.length} spots remaining</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Quick Launch Form */
        <form onSubmit={handleStartQuickGame} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <User className="w-4 h-4 text-[#16845B]" />
                Player 1 Details
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Explorer Name</label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  required
                  placeholder="e.g. Aarav"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Choose Block</label>
                <select
                  value={p1Block}
                  onChange={(e) => setP1Block(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
                >
                  <option value="A">Block A</option>
                  <option value="B">Block B</option>
                  <option value="C">Block C</option>
                  <option value="D">Block D</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Variety mix: Vehicles, People, Pune Special, & Discoveries
                </p>
              </div>
            </div>

            {/* Player 2 Box */}
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                <User className="w-4 h-4 text-[#0D9488]" />
                Player 2 Details
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Explorer Name</label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  required
                  placeholder="e.g. Tanvi"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Choose Block</label>
                <select
                  value={p2Block}
                  onChange={(e) => setP2Block(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                >
                  <option value="A">Block A</option>
                  <option value="B">Block B</option>
                  <option value="C">Block C</option>
                  <option value="D">Block D</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Variety mix: Vehicles, People, Pune Special, & Discoveries
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="w-full sm:w-auto flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Pune route (e.g., FC Road, Swargate)"
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all active:scale-95"
            >
              <span>Launch Match</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#65C49A]" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
