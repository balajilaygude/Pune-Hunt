"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  Layers,
  Trophy,
  History,
  Settings,
  Compass,
  MapPin,
  PlayCircle,
  X,
  Menu,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useGame } from "@/context/GameContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Play Game", href: "/play", icon: Gamepad2, badge: "Live" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Game History", href: "/history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings }
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { activeGame } = useGame();

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding & Nav Section */}
        <div className="overflow-y-auto flex-1">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#16845B] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-[#65C49A]" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  Pune Hunt
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-[#064E3B] px-1.5 py-0.5 rounded">
                    2P
                  </span>
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#16845B]" /> Maharashtra, IN
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Menu Navigation
            </div>

            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    active
                      ? "bg-[#064E3B] text-white shadow-sm shadow-emerald-900/30"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active
                          ? "text-[#65C49A]"
                          : "text-slate-400 group-hover:text-emerald-700"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && !active && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.badge === "Live" && activeGame
                          ? "bg-emerald-100 text-emerald-800 animate-pulse"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge === "Live" && activeGame ? "Playing" : item.badge}
                    </span>
                  )}

                  {active && (
                    <ChevronRight className="w-4 h-4 text-emerald-200" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Current Game Status Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {activeGame ? (
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Active Game
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-500">
                  {activeGame.player1.completedTaskIds.length + activeGame.player2.completedTaskIds.length}/20 Spots
                </span>
              </div>
              <div className="text-xs font-medium text-slate-800 truncate mb-1">
                {activeGame.player1.name} ({activeGame.player1.completedTaskIds.length}/10) vs {activeGame.player2.name} ({activeGame.player2.completedTaskIds.length}/10)
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className="bg-[#16845B] h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((activeGame.player1.completedTaskIds.length + activeGame.player2.completedTaskIds.length) / 20) * 100}%`
                  }}
                />
              </div>
              <Link
                href="/play"
                onClick={() => setMobileOpen(false)}
                className="w-full py-1.5 px-3 rounded-lg bg-[#064E3B] hover:bg-[#053e2f] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5 text-[#65C49A]" />
                Resume Game
              </Link>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-emerald-100 flex items-center justify-center text-[#064E3B]">
                <Sparkles className="w-4 h-4 text-[#16845B]" />
              </div>
              <p className="text-xs font-semibold text-slate-800 mb-0.5">Ready to Hunt?</p>
              <p className="text-[11px] text-slate-500 mb-2.5">
                Pick 2 blocks and start spotting across Pune streets!
              </p>
              <Link
                href="/play"
                onClick={() => setMobileOpen(false)}
                className="w-full py-1.5 px-3 rounded-lg bg-[#064E3B] hover:bg-[#053e2f] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#65C49A]" />
                Start New Game
              </Link>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Pune Travel Hunt v1.0</span>
            <span className="font-medium text-emerald-800">2-Player Real</span>
          </div>
        </div>
      </aside>
    </>
  );
}
