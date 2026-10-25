"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Gamepad2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { TASK_BLOCKS } from "@/data/data";

export default function GameHistoryPage() {
  const { history, handleResetData } = useGame();
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const filteredHistory = (history || []).filter((g) => {
    const q = filterQuery.toLowerCase();
    return (
      g.player1?.name.toLowerCase().includes(q) ||
      g.player2?.name.toLowerCase().includes(q) ||
      g.location?.toLowerCase().includes(q) ||
      g.winnerName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5 text-[#16845B]" />
            Archives & Expeditions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Game History 📜
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete record of all travel hunts conducted across Pune streets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/play"
            className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Gamepad2 className="w-4 h-4 text-[#65C49A]" />
            <span>New Match</span>
          </Link>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by player, location..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#064E3B] shadow-sm"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredHistory.length}</span> of{" "}
          <span className="font-bold text-slate-800">{history.length}</span> recorded expeditions
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredHistory.map((game) => {
          const dateObj = new Date(game.date);
          const dateStr = dateObj.toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
          });
          const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left Column: Date & Location */}
              <div className="space-y-1 md:w-1/4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Calendar className="w-4 h-4 text-[#16845B]" />
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{game.location}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Duration: {game.durationMinutes} mins ({timeStr})</span>
                </div>
              </div>

              {/* Middle Column: Player 1 vs Player 2 comparison */}
              <div className="flex-1 grid grid-cols-2 gap-3 max-w-lg">
                {/* Player 1 Box */}
                <div
                  className={`p-3 rounded-2xl border text-xs ${
                    game.player1.winner
                      ? "bg-emerald-50/80 border-emerald-300"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">{game.player1.name}</span>
                    <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      Block {game.player1.blockId}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-xl font-black text-slate-900">
                      {game.player1.score}
                      <span className="text-xs font-normal text-slate-400">/10</span>
                    </span>
                    {game.player1.winner && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Winner
                      </span>
                    )}
                  </div>
                </div>

                {/* Player 2 Box */}
                <div
                  className={`p-3 rounded-2xl border text-xs ${
                    game.player2.winner
                      ? "bg-emerald-50/80 border-emerald-300"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">{game.player2.name}</span>
                    <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      Block {game.player2.blockId}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-xl font-black text-slate-900">
                      {game.player2.score}
                      <span className="text-xs font-normal text-slate-400">/10</span>
                    </span>
                    {game.player2.winner && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Winner
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Outcome and Inspect Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>{game.isTie ? "Tie Match" : `${game.winnerName} Won`}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMatch(game)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#064E3B] text-slate-700 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Spotted Items</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredHistory.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-2xl font-bold">
              📜
            </div>
            <h3 className="font-bold text-base text-slate-800">No Expeditions Recorded Yet</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              {history.length === 0
                ? "Complete your first two-player hunt to log the match, scores, and spotted items here!"
                : "No matches found matching your search query."}
            </p>
            {history.length === 0 && (
              <Link
                href="/play"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Gamepad2 className="w-4 h-4 text-[#65C49A]" />
                <span>Start First Match</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Comprehensive Match Inspection Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Detailed Expedition Log
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-0.5">
                  {selectedMatch.player1.name} vs {selectedMatch.player2.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedMatch.location} • {selectedMatch.durationMinutes} minutes
                </p>
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-2 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Checklist details side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Player 1 Spotted List */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{selectedMatch.player1.name}</span>
                    <span className="text-[10px] text-slate-500 block">Block {selectedMatch.player1.blockId}</span>
                  </div>
                  <span className="text-xs font-black text-[#064E3B]">
                    {selectedMatch.player1.score}/10 Spotted
                  </span>
                </div>

                <div className="space-y-1.5">
                  {(TASK_BLOCKS[selectedMatch.player1.blockId]?.tasks || []).map((t) => {
                    const spotted = (selectedMatch.player1.completedTaskIds || []).includes(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`text-xs p-2 rounded-xl flex items-center justify-between gap-2 ${
                          spotted
                            ? "bg-emerald-100/70 text-emerald-900 font-semibold"
                            : "bg-white text-slate-400"
                        }`}
                      >
                        <span className="line-clamp-1">{t.text}</span>
                        {spotted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Player 2 Spotted List */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{selectedMatch.player2.name}</span>
                    <span className="text-[10px] text-slate-500 block">Block {selectedMatch.player2.blockId}</span>
                  </div>
                  <span className="text-xs font-black text-[#16845B]">
                    {selectedMatch.player2.score}/10 Spotted
                  </span>
                </div>

                <div className="space-y-1.5">
                  {(TASK_BLOCKS[selectedMatch.player2.blockId]?.tasks || []).map((t) => {
                    const spotted = (selectedMatch.player2.completedTaskIds || []).includes(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`text-xs p-2 rounded-xl flex items-center justify-between gap-2 ${
                          spotted
                            ? "bg-teal-100/70 text-teal-900 font-semibold"
                            : "bg-white text-slate-400"
                        }`}
                      >
                        <span className="line-clamp-1">{t.text}</span>
                        {spotted ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
