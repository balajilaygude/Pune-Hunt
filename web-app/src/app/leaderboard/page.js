"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Gamepad2,
  TrendingUp,
  Target,
  Search,
  Filter
} from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function LeaderboardPage() {
  const { leaderboard } = useGame();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeaderboard = (leaderboard || []).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            Punekar Hall of Fame
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Leaderboard Rankings 🏆
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculated across all completed travel hunts in Pune.
          </p>
        </div>

        <Link
          href="/play"
          className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start md:self-auto"
        >
          <Gamepad2 className="w-4 h-4 text-[#65C49A]" />
          <span>Play Next Match</span>
        </Link>
      </div>

      {/* Top 3 Podium Cards or Empty State */}
      {top3.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col justify-between order-2 md:order-1">
              <div className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                #2 Runner Up
              </div>
              <div>
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 border-2 border-slate-300 text-slate-700 flex items-center justify-center text-2xl font-black mb-3">
                  🥈
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">{top3[1].name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Fav: Block {top3[1].favBlock}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-lg font-black text-slate-900">{top3[1].won}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Wins</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-lg font-black text-slate-900">{top3[1].winRate}%</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Win Rate</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div className="bg-gradient-to-b from-amber-50/80 via-white to-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-md text-center relative flex flex-col justify-between order-1 md:order-2 md:-translate-y-2">
              <div className="absolute top-4 right-4 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>#1 Champion</span>
              </div>
              <div>
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-300 text-amber-900 flex items-center justify-center text-3xl font-black mb-3 shadow-sm">
                  🥇
                </div>
                <h3 className="font-black text-xl text-slate-900">{top3[0].name}</h3>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  Pune Spotting Leader • Block {top3[0].favBlock}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-amber-100 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-amber-100/60">
                  <div className="text-xl font-black text-amber-950">{top3[0].won}</div>
                  <div className="text-[10px] text-amber-900 font-bold uppercase">Wins</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-100/60">
                  <div className="text-xl font-black text-amber-950">{top3[0].winRate}%</div>
                  <div className="text-[10px] text-amber-900 font-bold uppercase">Win Rate</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-100/60">
                  <div className="text-xl font-black text-amber-950">{top3[0].tasksCompleted}</div>
                  <div className="text-[10px] text-amber-900 font-bold uppercase">Spots</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col justify-between order-3">
              <div className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900">
                #3 Bronze
              </div>
              <div>
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border-2 border-amber-200 text-amber-900 flex items-center justify-center text-2xl font-black mb-3">
                  🥉
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">{top3[2].name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Fav: Block {top3[2].favBlock}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-lg font-black text-slate-900">{top3[2].won}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Wins</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-lg font-black text-slate-900">{top3[2].winRate}%</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Win Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            🏆
          </div>
          <h3 className="font-bold text-lg text-slate-900">Leaderboard is Fresh & Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No games have been played yet. Complete your first two-player hunt to be crowned the #1 Pune explorer!
          </p>
          <Link
            href="/play"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Gamepad2 className="w-4 h-4 text-[#65C49A]" />
            <span>Start First Match</span>
          </Link>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Complete Player Standings</h3>
            <p className="text-xs text-slate-400">All registered explorers from match history</p>
          </div>

          {filteredLeaderboard.length > 0 && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>
          )}
        </div>

        {filteredLeaderboard.length > 0 ? (
          <>
            {/* Mobile Cards (Visible below sm breakpoint) */}
            <div className="space-y-3 sm:hidden">
              {filteredLeaderboard.map((player, idx) => (
                <div
                  key={player.name}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">
                        {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{player.name}</span>
                    </div>
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064E3B]">
                      {player.won} {player.won === 1 ? "Win" : "Wins"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/50 text-center text-xs">
                    <div className="p-1.5 rounded-xl bg-white border border-slate-100">
                      <div className="font-black text-slate-800">{player.played}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Matches</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white border border-slate-100">
                      <div className="font-black text-emerald-800">{player.winRate}%</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Win Rate</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white border border-slate-100">
                      <div className="font-black text-slate-800">{player.tasksCompleted}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Spots</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (Hidden on mobile, visible on sm and up) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Player</th>
                    <th className="pb-3 text-center">Played</th>
                    <th className="pb-3 text-center">Wins</th>
                    <th className="pb-3 text-center">Losses</th>
                    <th className="pb-3 text-center">Ties</th>
                    <th className="pb-3 text-center">Win Rate</th>
                    <th className="pb-3 text-center">Spots Completed</th>
                    <th className="pb-3 text-center pr-2">Favorite Block</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeaderboard.map((player, idx) => (
                    <tr key={player.name} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-slate-500">
                        {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900">
                        {player.name}
                      </td>
                      <td className="py-3.5 text-center text-slate-600 font-medium">{player.played}</td>
                      <td className="py-3.5 text-center font-bold text-emerald-800">{player.won}</td>
                      <td className="py-3.5 text-center text-slate-500">{player.lost}</td>
                      <td className="py-3.5 text-center text-slate-500">{player.ties}</td>
                      <td className="py-3.5 text-center font-bold text-slate-900">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-[#064E3B] border border-emerald-100">
                          {player.winRate}%
                        </span>
                      </td>
                      <td className="py-3.5 text-center font-black text-slate-800">
                        {player.tasksCompleted}
                      </td>
                      <td className="py-3.5 text-center pr-2">
                        <span className="font-bold text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          Block {player.favBlock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs">
            No rankings yet. Start a match on the Play Game page to begin recording statistics!
          </div>
        )}
      </div>
    </div>
  );
}
