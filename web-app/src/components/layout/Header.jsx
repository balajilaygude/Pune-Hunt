"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Compass
} from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function Header({ setMobileOpen }) {
  const { activeGame } = useGame();
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-8 py-3 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button & Logo/Breadcrumb */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile App Branding */}
          <Link href="/" className="flex lg:hidden items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#064E3B] to-[#16845B] flex items-center justify-center text-white shadow-sm">
              <Compass className="w-4 h-4 text-[#65C49A]" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">Pune Hunt</span>
          </Link>

          {/* Desktop Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
              Pune Explorer Edition
            </span>
          </div>
        </div>

        {/* Right Side: Quick Actions, Rules, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Rules Quick Modal Trigger */}
          <button
            onClick={() => setShowRulesModal(true)}
            className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="How to play"
          >
            <HelpCircle className="w-4 h-4 text-[#16845B]" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Quick Play CTA */}
          <Link
            href="/play"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold shadow-sm shadow-emerald-900/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#65C49A]" />
            <span>{activeGame ? "Live Game" : "New Game"}</span>
          </Link>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#064E3B] to-[#16845B] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-50">
              PH
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">Punekar Explorer</div>
              <div className="text-[10px] text-emerald-700 font-medium leading-none">Shared Device</div>
            </div>
          </div>
        </div>
      </header>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#064E3B] font-bold text-base sm:text-lg">
                <ShieldCheck className="w-5 h-5 text-[#16845B]" />
                How to Play Pune Travel Hunt
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="font-semibold text-emerald-950 mb-1">🎯 2-Player Real-World Game</p>
                <p>
                  You and a friend travel together around Pune on foot, two-wheeler, metro, or car. Play on one shared phone!
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Enter both players&apos; names and pick your challenge block (Block A, B, C, or D).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Each block gives you 10 exciting, balanced Pune spotting challenges.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <span>As soon as you spot an item in real life, tap the checklist to mark it spotted!</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    <strong>First player to complete all 10 spots wins!</strong> Results are recorded directly into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">games.js</code>.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold"
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
