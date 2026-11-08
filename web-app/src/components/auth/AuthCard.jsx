"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  Lock,
  User,
  Mail,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthCard({ initialMode = "login" }) {
  const router = useRouter();
  const { user, login, register } = useAuth();

  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(identifier, password);
        if (!res.success) {
          setError(res.message || "Invalid credentials. Please check your username and password.");
        } else {
          router.push("/");
        }
      } else {
        const res = await register(username, email, password);
        if (!res.success) {
          setError(res.message || "Registration failed. Try another username/email.");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError(err.message || "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center py-1 sm:py-4 animate-fade-in">
      <div className="w-full max-w-sm sm:max-w-md glass-card rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/80 space-y-3.5">
        {/* Header: Logo & Title in single compact row */}
        <div className="flex items-center gap-3 pb-2 border-b border-white/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0369a1] to-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-md">
            <Compass className="w-5 h-5 text-[#38bdf8]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
              Pune Travel Hunt 🎯
            </h2>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              {mode === "login"
                ? "Sign in to access challenge rooms & live tracking"
                : "Create an account to host rooms & track games"}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex p-1 rounded-xl glass-panel-subtle gap-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg font-extrabold transition-all text-xs flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "glass-button-primary text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg font-extrabold transition-all text-xs flex items-center justify-center gap-1.5 ${
              mode === "register"
                ? "glass-button-primary text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-2 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {mode === "register" && (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">
                Username
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Rohini_Pune"
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === "register" && (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === "login" && (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter username or email"
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 px-4 rounded-xl glass-button-primary disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In & Enter Game"
                : "Create Account & Start"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7dd3fc]" />
          </button>
        </form>

        {/* Footer Mode Switcher text */}
        <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-white/60">
          {mode === "login" ? (
            <span>
              New player?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="font-black text-[#0284c7] hover:underline"
              >
                Sign Up here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="font-black text-[#0284c7] hover:underline"
              >
                Sign In here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
