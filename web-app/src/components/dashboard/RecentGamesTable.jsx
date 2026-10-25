"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  Trophy,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  Eye
} from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function RecentGamesTable() {
  const { history } = useGame();
  const [selectedMatch, setSelectedMatch] = useState(null);

  const displayGames = (history || []).slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
            <History className="w-4 h-4 text-[#16845B]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">Recent Games</h3>
            <p className="text-xs text-slate-400">Match outcomes across Pune streets</p>
          </div>
        </div>

        <Link
          href="/history"
          className="text-xs font-semibold text-[#16845B] hover:text-[#064E3B] flex items-center gap-1"
        >
          <span>View All ({history.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {displayGames.length > 0 ? (
        <div className="space-y-3">
          {displayGames.map((game) => {
            const formattedDate = new Date(game.date).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric"
            });

            return (
              <div
                key={game.id}
                onClick={() => setSelectedMatch(game)}
                className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/50 border border-slate-200/60 hover:border-emerald-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Players and blocks */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-950">
                      {game.player1.name} (Block {game.player1.blockId})
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">vs</span>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-950">
                      {game.player2.name} (Block {game.player2.blockId})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#16845B]" />
                      {game.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Right: Scores & Winner Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">
                      {game.player1.score} - {game.player2.score}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {game.durationMinutes}m duration
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-xl bg-emerald-100/80 text-[#064E3B] text-xs font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-[#16845B]" />
                    <span>{game.isTie ? "Tie" : game.winnerName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-400">
          No matches finished yet. Start your first game above!
        </div>
      )}

      {/* Match Details Quick Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#16845B]" />
                Match Summary Details
              </h4>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] text-slate-400 mb-1">Route & Time</div>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
                  {selectedMatch.location}
                </div>
                <div className="text-slate-500 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Finished in {selectedMatch.durationMinutes} minutes
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className={`p-3 rounded-2xl border ${selectedMatch.player1.winner ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200"}`}>
                  <div className="font-bold text-slate-900">{selectedMatch.player1.name}</div>
                  <div className="text-[10px] text-slate-500">Block {selectedMatch.player1.blockId}</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{selectedMatch.player1.score}/10</div>
                  {selectedMatch.player1.winner && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      Winner
                    </span>
                  )}
                </div>

                <div className={`p-3 rounded-2xl border ${selectedMatch.player2.winner ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200"}`}>
                  <div className="font-bold text-slate-900">{selectedMatch.player2.name}</div>
                  <div className="text-[10px] text-slate-500">Block {selectedMatch.player2.blockId}</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{selectedMatch.player2.score}/10</div>
                  {selectedMatch.player2.winner && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      Winner
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-slate-700">
                <span className="font-bold text-emerald-950">Outcome: </span>
                {selectedMatch.isTie ? "Draw (Both spotted all 10 tasks!)" : `${selectedMatch.winnerName} conquered Pune!`}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
