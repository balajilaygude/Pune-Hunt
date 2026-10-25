"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Medal, ArrowRight, Award, Zap } from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function LeaderboardCard() {
  const { leaderboard } = useGame();

  const topList = (leaderboard || []).slice(0, 4);

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs border border-amber-300">
          🥇
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs border border-slate-300">
          🥈
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-900 flex items-center justify-center font-black text-xs border border-amber-200">
          🥉
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">Leaderboard</h3>
            <p className="text-xs text-slate-400">Top Punekar explorers by victories</p>
          </div>
        </div>

        <Link
          href="/leaderboard"
          className="text-xs font-semibold text-[#16845B] hover:text-[#064E3B] flex items-center gap-1"
        >
          <span>Full Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {topList.length > 0 ? (
        <div className="space-y-3">
          {topList.map((player, idx) => (
            <div
              key={player.name}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-all"
            >
              <div className="flex items-center gap-3">
                {getRankBadge(idx)}
                <div>
                  <div className="font-bold text-xs text-slate-900">{player.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {player.played} matches • Fav: Block {player.favBlock}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-800">
                    {player.won} {player.won === 1 ? "Win" : "Wins"}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {player.winRate}% win rate
                  </div>
                </div>

                <div className="w-10 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#16845B] h-1.5 rounded-full"
                    style={{ width: `${player.winRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-400">
          No player standings yet. Complete a game to rank here!
        </div>
      )}
    </div>
  );
}
