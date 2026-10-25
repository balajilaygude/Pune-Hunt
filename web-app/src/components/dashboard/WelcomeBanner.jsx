"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Gamepad2, Trophy, MapPin } from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function WelcomeBanner() {
  const { activeGame } = useGame();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#0d624a] to-[#16845B] text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/15 mb-8">
      {/* Subtle background circles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 right-48 w-48 h-48 bg-teal-300/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-[#65C49A]" />
            <span>Real-World Two-Player Exploration Game</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ready to explore Pune? 🎯
          </h2>

          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Grab a friend, explore Pune&apos;s bustling avenues from FC Road to Koregaon Park, and compete to spot 10 real-world items first on your shared screen.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#65C49A]" /> Pune City Trail
            </span>
            <span>•</span>
            <span>Mixed Tasks (Vehicles, People, Pune Special & Discoveries)</span>
            <span>•</span>
            <span>Single-Device Friendly</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/play"
            className="px-5 py-3 rounded-2xl bg-[#65C49A] hover:bg-[#52b98d] text-[#064E3B] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all active:scale-95"
          >
            <Gamepad2 className="w-4 h-4 text-[#064E3B]" />
            <span>{activeGame ? "Continue Match" : "Start Hunting Now"}</span>
          </Link>

          <Link
            href="/leaderboard"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 flex items-center justify-center gap-2 transition-all"
          >
            <Trophy className="w-4 h-4 text-emerald-200" />
            <span>View Leaderboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
