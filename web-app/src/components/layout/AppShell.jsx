"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, LogIn, UserPlus } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import WinnerModal from "@/components/game/WinnerModal";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  // 1. PUBLIC VIEW (When NOT logged in)
  // Clean landing with responsive floating glass navbar
  if (!user) {
    return (
      <div className="min-h-screen relative flex flex-col overflow-x-hidden">
        {/* Subtle top indeterminate line if auth is hydrating */}
        {loading && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 animate-pulse" />
        )}

        {/* Ambient floating blur lights behind the glass */}
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="ambient-glow-3" />

        {/* Public Floating Glass Header (100% Mobile & Laptop Responsive) */}
        <header className="sticky top-0 z-30 px-3 sm:px-6 py-2 sm:py-3.5">
          <div className="max-w-6xl mx-auto glass-panel rounded-2xl px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shadow-lg shadow-sky-950/5 gap-2">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#0369a1] to-[#0284c7] flex items-center justify-center text-white shadow-md shadow-sky-950/20 group-hover:scale-105 transition-transform shrink-0">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#38bdf8]" />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight block leading-tight">
                  <span className="inline sm:hidden">Pune Hunt</span>
                  <span className="hidden sm:inline">Pune Travel Hunt</span>
                </span>
                <span className="hidden sm:block text-[10px] text-sky-800 font-semibold uppercase tracking-wider">
                  Real-World 2P Game
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-[#0284c7] glass-pill hover:bg-white/90 transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/register"
                className="hidden sm:flex px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl glass-button-primary text-white text-xs font-bold items-center gap-1 active:scale-95 transition-all whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#7dd3fc]" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Public Content - Always rendered so Next.js never drops segments */}
        <main className="relative z-10 flex-1 p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>

        <AuthModal />
      </div>
    );
  }

  // 2. AUTHENTICATED VIEW (Logged in)
  // Frosted glass sidebar, header, bottom nav, and clean content container
  return (
    <div className="min-h-screen relative flex overflow-x-hidden">
      {/* Subtle top indeterminate line if auth is hydrating */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 animate-pulse" />
      )}

      {/* Ambient background glow layers */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Modern Frosted Sidebar (Desktop & mobile drawer) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        <Header setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Modals */}
      <WinnerModal />
      <AuthModal />
    </div>
  );
}
