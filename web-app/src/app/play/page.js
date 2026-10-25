"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gamepad2,
  CheckCircle2,
  Circle,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  MapPin,
  Clock,
  Layers,
  Info,
  AlertTriangle,
  PlayCircle,
  ArrowRight,
  Flame,
  Radio,
  Tag
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { TASK_BLOCKS } from "@/data/data";

export default function PlayPage() {
  const {
    activeGame,
    startNewGame,
    toggleTask,
    abandonGame,
    restartSameMatch
  } = useGame();

  // Setup form state (when no game is active)
  const [p1Name, setP1Name] = useState("Aarav");
  const [p2Name, setP2Name] = useState("Tanvi");
  const [p1Block, setP1Block] = useState("A");
  const [p2Block, setP2Block] = useState("B");
  const [routeLocation, setRouteLocation] = useState("");

  // Confirmation modal state for abandoning game
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  // Mobile player view switcher: "both" | "p1" | "p2"
  const [mobileViewTab, setMobileViewTab] = useState("both");

  // Timer state for active game
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!activeGame || activeGame.status === "completed") return;

    const startMs = new Date(activeGame.startTime).getTime();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startMs) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGame]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    startNewGame({
      player1Name: p1Name,
      player1Block: p1Block,
      player2Name: p2Name,
      player2Block: p2Block,
      location: routeLocation
    });
  };

  // If no active game: Render the Setup Screen
  if (!activeGame) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-bold mb-2">
            <Gamepad2 className="w-3.5 h-3.5 text-[#16845B]" />
            New 2-Player Match
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Launch Your Pune Travel Hunt 🎯
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Choose your challenge pack. Each block offers an exciting, mixed variety of tasks covering vehicles, commuters, food spots, and hidden discoveries!
          </p>
        </div>

        <form onSubmit={handleStartGame} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 Settings */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#064E3B]">
                  Player 1 (Explorer 1)
                </span>
                <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Player Name
                </label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  required
                  placeholder="e.g. Aarav"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Choose Challenge Pack
                </label>
                <select
                  value={p1Block}
                  onChange={(e) => setP1Block(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                >
                  <option value="A">Block A</option>
                  <option value="B">Block B</option>
                  <option value="C">Block C</option>
                  <option value="D">Block D</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Balanced mix: Vehicles, People, Pune Special, & Random Discoveries
                </p>
              </div>
            </div>

            {/* Player 2 Settings */}
            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-900">
                  Player 2 (Explorer 2)
                </span>
                <span className="w-6 h-6 rounded-full bg-[#16845B] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Player Name
                </label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  required
                  placeholder="e.g. Tanvi"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Choose Challenge Pack
                </label>
                <select
                  value={p2Block}
                  onChange={(e) => setP2Block(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
                >
                  <option value="A">Block A </option>
                  <option value="B">Block B </option>
                  <option value="C">Block C </option>
                  <option value="D">Block D </option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Balanced mix: Vehicles, People, Pune Special, & Random Discoveries
                </p>
              </div>
            </div>
          </div>

          {/* Location / Trail */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pune Trail or Route Location
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#16845B] shrink-0" />
              <input
                type="text"
                value={routeLocation}
                onChange={(e) => setRouteLocation(e.target.value)}
                placeholder="e.g. FC Road, Swargate to Deccan, Koregaon Park"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16845B]" />
              <span>Single device mode: Both explorers can check items as they spot them!</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all active:scale-95"
            >
              <span>Begin Travel Hunt</span>
              <PlayCircle className="w-4 h-4 text-[#65C49A]" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ACTIVE GAME VIEW
  const p1 = activeGame.player1;
  const p2 = activeGame.player2;
  const block1 = TASK_BLOCKS[p1.blockId] || TASK_BLOCKS.A;
  const block2 = TASK_BLOCKS[p2.blockId] || TASK_BLOCKS.B;

  const p1Progress = p1.completedTaskIds.length;
  const p2Progress = p2.completedTaskIds.length;

  return (
    <div className="space-y-6">
      {/* Top Gameplay Status Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span>Live Spotting Challenge • Single-Device Shared Screen</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{p1.name}</span>
            <span className="text-slate-400 font-normal">vs</span>
            <span>{p2.name}</span>
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
              {activeGame.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatTimer(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setConfirmAbandon(true)}
            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Abandon Game</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal to Abandon Game */}
      {confirmAbandon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-base text-slate-900">Abandon this game?</h4>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to quit the current match between {p1.name} and {p2.name}? Progress will not be counted as a victory.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmAbandon(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Continue Playing
              </button>
              <button
                onClick={() => {
                  abandonGame();
                  setConfirmAbandon(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Yes, Abandon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Player Switcher (Single Phone Friendly) */}
      <div className="flex lg:hidden items-center p-1 bg-white border border-slate-200/80 rounded-2xl gap-1 text-xs font-semibold shadow-sm">
        <button
          type="button"
          onClick={() => setMobileViewTab("both")}
          className={`flex-1 py-2 px-1 rounded-xl text-center transition-all ${
            mobileViewTab === "both"
              ? "bg-slate-900 text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Both ({p1Progress + p2Progress}/20)
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab("p1")}
          className={`flex-1 py-2 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
            mobileViewTab === "p1"
              ? "bg-[#064E3B] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="truncate max-w-[85px]">{p1.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            mobileViewTab === "p1" ? "bg-white/20 text-white" : "bg-emerald-100 text-[#064E3B]"
          }`}>
            {p1Progress}/10
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab("p2")}
          className={`flex-1 py-2 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
            mobileViewTab === "p2"
              ? "bg-[#16845B] text-white shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="truncate max-w-[85px]">{p2.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            mobileViewTab === "p2" ? "bg-white/20 text-white" : "bg-teal-100 text-teal-800"
          }`}>
            {p2Progress}/10
          </span>
        </button>
      </div>

      {/* 2-Player Side-by-Side Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PLAYER 1 COLUMN */}
        <div className={`bg-white rounded-3xl p-4 sm:p-7 border-2 border-emerald-600/70 shadow-md flex-col justify-between ${
          mobileViewTab === "p2" ? "hidden lg:flex" : "flex"
        }`}>
          <div>
            {/* Player 1 Card Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#16845B] text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-950/20">
                  {p1.blockId}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">{p1.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#064E3B]">
                      Player 1
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Block {p1.blockId} — 10 Mixed Spotting Tasks
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-[#064E3B]">
                  {p1Progress}
                  <span className="text-xs font-normal text-slate-400">/10</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {10 - p1Progress} left
                </div>
              </div>
            </div>

            {/* Player 1 Animated Progress Bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                <span>Progress: {p1Progress * 10}%</span>
                <span>{p1Progress === 10 ? "🏆 All Completed!" : `${10 - p1Progress} spots remaining`}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-[#064E3B] to-[#16845B] h-full rounded-full transition-all duration-300"
                  style={{ width: `${p1Progress * 10}%` }}
                />
              </div>
            </div>

            {/* Player 1 Checklist */}
            <div className="space-y-2.5">
              {block1.tasks.map((task, index) => {
                const isChecked = p1.completedTaskIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask("player1", task.id)}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${isChecked
                      ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 focus:outline-none"
                      aria-label={isChecked ? "Uncheck task" : "Check task"}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400">
                          #{index + 1}
                        </span>
                        <p
                          className={`text-xs sm:text-sm font-semibold transition-all ${isChecked
                            ? "line-through text-slate-500"
                            : "text-slate-800"
                            }`}
                        >
                          {task.text}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {task.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {task.category}
                          </span>
                        )}
                        {task.hint && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Info className="w-3 h-3 text-[#16845B]" />
                            {task.hint}
                          </span>
                        )}
                      </div>
                    </div>

                    {isChecked && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                        Spotted ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PLAYER 2 COLUMN */}
        <div className={`bg-white rounded-3xl p-4 sm:p-7 border-2 border-teal-600/70 shadow-md flex-col justify-between ${
          mobileViewTab === "p1" ? "hidden lg:flex" : "flex"
        }`}>
          <div>
            {/* Player 2 Card Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#16845B] text-white flex items-center justify-center font-black text-xl shadow-md shadow-teal-950/20">
                  {p2.blockId}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">{p2.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      Player 2
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Block {p2.blockId} — 10 Mixed Spotting Tasks
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-[#0D9488]">
                  {p2Progress}
                  <span className="text-xs font-normal text-slate-400">/10</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {10 - p2Progress} left
                </div>
              </div>
            </div>

            {/* Player 2 Animated Progress Bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                <span>Progress: {p2Progress * 10}%</span>
                <span>{p2Progress === 10 ? "🏆 All Completed!" : `${10 - p2Progress} spots remaining`}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-[#0D9488] to-[#16845B] h-full rounded-full transition-all duration-300"
                  style={{ width: `${p2Progress * 10}%` }}
                />
              </div>
            </div>

            {/* Player 2 Checklist */}
            <div className="space-y-2.5">
              {block2.tasks.map((task, index) => {
                const isChecked = p2.completedTaskIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask("player2", task.id)}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${isChecked
                      ? "bg-teal-50/70 border-teal-300 shadow-sm"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 focus:outline-none"
                      aria-label={isChecked ? "Uncheck task" : "Check task"}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 fill-teal-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-teal-500" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400">
                          #{index + 1}
                        </span>
                        <p
                          className={`text-xs sm:text-sm font-semibold transition-all ${isChecked
                            ? "line-through text-slate-500"
                            : "text-slate-800"
                            }`}
                        >
                          {task.text}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {task.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {task.category}
                          </span>
                        )}
                        {task.hint && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Info className="w-3 h-3 text-[#0D9488]" />
                            {task.hint}
                          </span>
                        )}
                      </div>
                    </div>

                    {isChecked && (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full shrink-0">
                        Spotted ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Activity Log at bottom */}
      {activeGame.recentActivity?.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-3 mb-3 border-b border-slate-100">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Match Event Log</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {activeGame.recentActivity.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-between"
              >
                <span className="truncate pr-2 font-medium">{item.text}</span>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
