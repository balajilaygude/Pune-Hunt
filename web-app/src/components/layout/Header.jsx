"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Compass,
  LogIn,
  LogOut,
  Trophy
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";

export default function Header({ setMobileOpen }) {
  const { activeGame, liveRoom } = useGame();
  const { user, logout, openLoginModal } = useAuth();
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 px-3 sm:px-6 py-2.5">
        <div className="glass-panel rounded-2xl px-3.5 sm:px-6 py-2.5 flex items-center justify-between shadow-lg shadow-sky-950/5">
          {/* Left Side: Mobile Menu Button & Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl glass-pill hover:bg-white/90 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile App Branding */}
            <Link href="/" className="flex lg:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0369a1] to-[#0284c7] flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">Pune Hunt</span>
            </Link>

            {/* Desktop Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 text-sky-900 font-bold glass-badge-green px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
                Pune Explorer Edition
              </span>
            </div>
          </div>

          {/* Center: Live Room indicator if connected */}
          {(liveRoom || activeGame) && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-sky-300 text-xs font-bold text-sky-900 shadow-sm animate-pulse-gentle">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span>
                {liveRoom ? `Live Room: ${liveRoom.roomCode}` : "Match Active"}
              </span>
            </div>
          )}

          {/* Right Side: Quick Actions, Rules, Profile / Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Rules Modal Trigger - Desktop & Tablet */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="hidden sm:flex p-2 text-slate-600 hover:text-sky-900 glass-pill hover:bg-white/90 rounded-xl transition-all items-center gap-1.5 text-xs font-bold active:scale-95"
              title="How to play"
            >
              <HelpCircle className="w-4 h-4 text-[#0284c7]" />
              <span>Rules</span>
            </button>

            {/* Quick Play CTA - Desktop & Tablet */}
            <Link
              href="/play"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-button-primary text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#7dd3fc]" />
              <span>{liveRoom || activeGame ? "Live Game" : "Play Hunt"}</span>
            </Link>

            {/* User Profile / Auth Area */}
            <div className="relative pl-1 sm:pl-2 sm:border-l sm:border-slate-200/60 shrink-0">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-xl glass-pill hover:bg-white/90 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0369a1] to-[#0284c7] text-white flex items-center justify-center font-black text-xs shadow-sm ring-2 ring-sky-100">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="hidden xl:block text-left pr-1">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {user.username}
                      </div>
                      <div className="text-[10px] text-sky-800 font-semibold leading-none">
                        {user.gamesWon || 0} Wins
                      </div>
                    </div>
                  </button>

                  {/* Profile dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl p-2 z-50 border border-white/80 animate-fade-in">
                      <div className="p-3 border-b border-slate-100/80">
                        <p className="font-extrabold text-xs text-slate-900">{user.username}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-sky-900 glass-badge-green p-2 rounded-xl">
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-[#0284c7]" />
                            {user.gamesWon || 0} Wins
                          </span>
                          <span>{user.gamesPlayed || 0} Matches</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full mt-1 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50/80 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="px-3 py-1.5 rounded-xl glass-pill hover:bg-white/90 text-sky-900 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
          <div className="glass-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2 text-[#0369a1] font-extrabold text-base sm:text-lg">
                <ShieldCheck className="w-5 h-5 text-[#0284c7]" />
                How to Play Pune Travel Hunt
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1.5 rounded-xl glass-pill"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl glass-badge-green">
                <p className="font-extrabold text-sky-950 mb-1">🎯 2-Player Real-Time Online Game</p>
                <p>
                  Create a room as Player 1 to generate your Room Code & QR Code. Player 2 scans the QR code or enters the code from their device to start hunting live!
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    1
                  </span>
                  <span>Sign in or create an account, then click <strong>&quot;Create Challenge Room&quot;</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    2
                  </span>
                  <span>Player 2 scans the generated QR code or types the 6-character room code.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    3
                  </span>
                  <span>Both players travel through Pune and check off spotting challenges in real time!</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    4
                  </span>
                  <span>
                    <strong>First to 10 completed spots wins!</strong> Both screens update instantly via WebSockets and record the win to MongoDB.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl glass-button-primary text-white text-xs font-bold"
              >
                Got It, Let&apos;s Play!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
