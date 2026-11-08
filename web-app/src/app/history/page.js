"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  Calendar,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  XCircle,
  Gamepad2,
  Sparkles,
  Trophy,
  ArrowRight,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { gamesAPI } from "@/lib/api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function HistoryPageContent() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch match history for this logged-in player from backend
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const res = await gamesAPI.getHistory();
        if (isMounted && res.success && Array.isArray(res.games)) {
          // Filter to games where current user took part
          const userGames = res.games.filter((g) => {
            const p1Matches = g.player1?.name?.toLowerCase() === user?.username?.toLowerCase();
            const p2Matches = g.player2?.name?.toLowerCase() === user?.username?.toLowerCase();
            return p1Matches || p2Matches;
          });
          setGames(userGames);
        }
      } catch (err) {
        console.error("Error loading user history:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (user) {
      loadHistory();
    }
  }, [user]);

  const filteredGames = games.filter((g) => {
    const q = searchQuery.toLowerCase();
    const loc = (g.location || "").toLowerCase();
    const p1 = (g.player1?.name || "").toLowerCase();
    const p2 = (g.player2?.name || "").toLowerCase();
    return loc.includes(q) || p1.includes(q) || p2.includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/60 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-badge-green text-xs font-extrabold mb-2 shadow-sm">
            <History className="w-3.5 h-3.5 text-[#16845B]" />
            Personal Match History
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            My Game History 📜
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Matches played by <strong>{user?.username}</strong> across Pune streets.
          </p>
        </div>

        <Link
          href="/play"
          className="px-5 py-2.5 rounded-xl glass-button-primary text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all shrink-0 active:scale-95"
        >
          <Gamepad2 className="w-4 h-4 text-[#65C49A]" />
          <span>New Challenge</span>
        </Link>
      </div>

      {/* Search Filter if has games */}
      {games.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by opponent or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Total Matches: <strong className="text-slate-900">{games.length}</strong>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="p-12 text-center glass-card rounded-3xl shadow-sm space-y-3">
          <div className="w-8 h-8 border-3 border-[#064E3B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading your Pune match history...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        /* Empty State */
        <div className="p-10 sm:p-14 text-center glass-card rounded-3xl shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl glass-badge-green flex items-center justify-center mx-auto shadow-sm">
            <History className="w-7 h-7 text-[#16845B]" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">No matches recorded yet</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm mx-auto">
              You haven&apos;t played any games yet. Create a challenge room in Play Game or scan a friend&apos;s QR code to record your first match!
            </p>
          </div>
          <Link
            href="/play"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass-button-primary text-white font-extrabold text-xs shadow-md active:scale-95 transition-all"
          >
            <span>Start Your First Match</span>
            <ArrowRight className="w-4 h-4 text-[#65C49A]" />
          </Link>
        </div>
      ) : (
        /* Games List in Glass Cards */
        <div className="space-y-3.5">
          {filteredGames.map((game) => {
            const isPlayer1 = game.player1?.name?.toLowerCase() === user?.username?.toLowerCase();
            const myPlayer = isPlayer1 ? game.player1 : game.player2;
            const oppPlayer = isPlayer1 ? game.player2 : game.player1;

            const myScore = typeof myPlayer?.score === "number" ? myPlayer.score : (myPlayer?.completedTaskIds?.length || 0);
            const oppScore = typeof oppPlayer?.score === "number" ? oppPlayer.score : (oppPlayer?.completedTaskIds?.length || 0);

            const isWinner = !game.isTie && game.winnerName?.toLowerCase() === user?.username?.toLowerCase();
            const isTie = game.isTie || (myScore === 10 && oppScore === 10);

            const dateStr = game.createdAt || game.date
              ? new Date(game.createdAt || game.date).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              : "Recent";

            return (
              <div
                key={game._id || game.id || game.roomCode}
                className="glass-card glass-card-hover rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Outcome and Players */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Outcome Badge */}
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                        isTie
                          ? "bg-amber-100/80 text-amber-900 border border-amber-300"
                          : isWinner
                          ? "glass-badge-green font-black"
                          : "bg-rose-100/80 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {isTie ? "Tie Match" : isWinner ? "🏆 Victory" : "Defeat"}
                    </span>

                    {game.roomCode && (
                      <span className="text-[10px] font-mono font-bold text-slate-500 glass-pill px-2.5 py-0.5 rounded-full">
                        Room {game.roomCode}
                      </span>
                    )}
                  </div>

                  {/* Versus details */}
                  <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="text-[#064E3B]">{user?.username} (You)</span>
                    <span className="text-slate-400 font-normal text-xs">vs</span>
                    <span className="text-slate-700">{oppPlayer?.name || "Opponent"}</span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
                      {game.location || "Pune City Streets"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                    {game.durationMinutes && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {game.durationMinutes} mins
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Scores */}
                <div className="flex items-center gap-4 glass-panel-subtle px-4 py-3 rounded-2xl border border-white/80 shrink-0 justify-between md:justify-end shadow-sm">
                  <div className="text-center">
                    <span className="text-[10px] font-extrabold uppercase text-[#064E3B] block">
                      Your Score
                    </span>
                    <span className="text-xl font-black text-[#064E3B]">
                      {myScore}<span className="text-xs font-normal text-slate-400">/10</span>
                    </span>
                  </div>

                  <span className="text-slate-300 font-bold">:</span>

                  <div className="text-center">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                      Opponent
                    </span>
                    <span className="text-xl font-black text-slate-700">
                      {oppScore}<span className="text-xs font-normal text-slate-400">/10</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute title="Sign In to Access Game History">
      <HistoryPageContent />
    </ProtectedRoute>
  );
}
