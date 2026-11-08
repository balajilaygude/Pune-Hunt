"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, LogIn, UserPlus } from "lucide-react";

export default function ProtectedRoute({ children, title = "Sign In Required" }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass-card rounded-3xl text-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-600">Checking credentials...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 sm:p-8 glass-card rounded-3xl shadow-2xl text-center space-y-6 animate-fade-in border border-white/80">
        <div className="w-16 h-16 rounded-3xl glass-badge-green flex items-center justify-center mx-auto text-[#0369a1] shadow-md">
          <Lock className="w-8 h-8 text-[#0284c7]" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0369a1] glass-badge-green px-3 py-1 rounded-full">
            Protected Section
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-sm mx-auto">
            Please sign in to your account or create one to play the game, create challenge rooms, and view match history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-button-primary text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4 text-[#7dd3fc]" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-pill hover:bg-white text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#0284c7]" />
            <span>Create Account</span>
          </Link>
        </div>

        <div className="pt-2">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors">
            ← Return to Home Overview
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
