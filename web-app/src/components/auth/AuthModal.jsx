"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, Sparkles, X, ArrowRight, AlertTriangle, Zap } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, authMode, setAuthMode, closeAuthModal, login, register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        const res = await login(identifier, password);
        if (!res.success) {
          setError(res.message);
        }
      } else {
        const res = await register(username, email, password);
        if (!res.success) {
          setError(res.message);
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 shadow-2xl border border-white/80 relative overflow-hidden space-y-3">
        {/* Decorative Top Pill & Close */}
        <div className="flex items-center justify-between pb-2 border-b border-white/60">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-green text-[11px] font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#16845B]" />
            Pune Explorer Account
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-xl glass-pill transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Title */}
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {authMode === "login" ? "Sign In to Your Account 🎯" : "Create Explorer Account 🚀"}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            {authMode === "login"
              ? "Access challenge rooms & live tracking"
              : "Register to host rooms and race across Pune"}
          </p>
        </div>

        {/* Mode Toggle Switch in Glass Segmented Bar */}
        <div className="flex p-1 rounded-xl glass-panel-subtle gap-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all font-extrabold text-xs ${
              authMode === "login"
                ? "glass-button-primary text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all font-extrabold text-xs ${
              authMode === "register"
                ? "glass-button-primary text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {authMode === "register" && (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">
                Explorer Username
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Choose username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {authMode === "register" && (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {authMode === "login" && (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-0.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 px-4 rounded-xl glass-button-primary text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-60 transition-all"
          >
            <span>
              {loading
                ? "Please wait..."
                : authMode === "login"
                ? "Sign In & Enter Dashboard"
                : "Create Account & Start"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#65C49A]" />
          </button>
        </form>
      </div>
    </div>
  );
}
