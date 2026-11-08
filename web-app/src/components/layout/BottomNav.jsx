"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gamepad2, History } from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { liveRoom, activeGame } = useGame();
  const isGameActive = !!(liveRoom || activeGame);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    {
      label: "Play Game",
      href: "/play",
      icon: Gamepad2,
      badge: isGameActive ? "LIVE" : null
    },
    { label: "History", href: "/history", icon: History }
  ];

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-sky-100/80 shadow-[0_-4px_20px_rgba(2,132,199,0.06)] px-3 py-1.5"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        {navItems.map((item) => {
          const active = isLinkActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all relative ${
                active
                  ? "text-[#0369a1] font-extrabold"
                  : "text-slate-500 hover:text-slate-900 font-semibold"
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-all ${
                    active
                      ? "bg-sky-100/90 text-[#0284c7] shadow-sm scale-110"
                      : "text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-sky-600 text-[8px] font-black text-white animate-pulse shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {item.label}
              </span>

              {active && (
                <span className="w-1 h-1 rounded-full bg-[#0284c7] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
