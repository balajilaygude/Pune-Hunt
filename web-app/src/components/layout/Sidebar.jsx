"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  History,
  Compass,
  MapPin,
  PlayCircle,
  X,
  ChevronRight,
  Wifi
} from "lucide-react";
import { useGame } from "@/context/GameContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Play Game", href: "/play", icon: Gamepad2, badge: "Live" },
  { label: "Game History", href: "/history", icon: History }
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { activeGame, liveRoom } = useGame();

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isGameActive = !!(liveRoom || activeGame);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/75 backdrop-blur-2xl border-r border-white/60 shadow-2xl shadow-sky-950/5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding & Nav Section */}
        <div className="overflow-y-auto flex-1">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/60 bg-white/40">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0369a1] via-[#0284c7] to-[#0ea5e9] flex items-center justify-center text-white shadow-md shadow-sky-950/20 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-[#38bdf8]" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                  Pune Hunt
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100/80 text-[#0369a1] px-1.5 py-0.5 rounded-full border border-sky-300/60">
                    2P Live
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#0284c7]" /> Maharashtra, IN
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white/80 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Explorer Menu
            </div>

            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 group ${
                    active
                      ? "glass-button-primary text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80 glass-pill"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active
                          ? "text-[#7dd3fc]"
                          : "text-slate-400 group-hover:text-sky-700"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && !active && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isGameActive
                          ? "bg-sky-100 text-sky-800 animate-pulse border border-sky-300"
                          : "bg-slate-100/80 text-slate-600"
                      }`}
                    >
                      {isGameActive ? "In Action" : item.badge}
                    </span>
                  )}

                  {active && (
                    <ChevronRight className="w-4 h-4 text-sky-200" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Current Game Status Card */}
        {(liveRoom || activeGame) && (
          <div className="p-4 border-t border-white/60 bg-white/40">
            {liveRoom ? (
              <div className="p-3.5 rounded-2xl glass-card border border-sky-300/80 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                    <Wifi className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                    Live Room {liveRoom.roomCode}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#0369a1] border border-sky-300/50">
                    Online
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate mb-1">
                  {liveRoom.player1.name} ({liveRoom.player1.completedTaskIds?.length || liveRoom.player1.score || 0}/10) vs{" "}
                  {liveRoom.player2?.name || "Player 2"} ({liveRoom.player2?.completedTaskIds?.length || liveRoom.player2?.score || 0}/10)
                </div>
                <Link
                  href="/play"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 w-full py-2 px-3 rounded-xl glass-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-[#7dd3fc]" />
                  Resume Live Match
                </Link>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl glass-card border border-sky-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-900">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                    Pass & Play
                  </span>
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    {activeGame.player1.completedTaskIds.length + activeGame.player2.completedTaskIds.length}/20 Spots
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-800 truncate mb-1">
                  {activeGame.player1.name} vs {activeGame.player2.name}
                </div>
                <Link
                  href="/play"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 w-full py-2 px-3 rounded-xl glass-button-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-[#7dd3fc]" />
                  Resume Game
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Minimal Footer */}
        <div className="p-3 border-t border-white/60 bg-white/30 flex items-center justify-between text-[11px] text-slate-400 px-4 font-medium">
          <span>Pune Travel Hunt</span>
          <span className="font-bold text-sky-800">2-Player Real</span>
        </div>
      </aside>
    </>
  );
}
