"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // Load user from stored token on mount
  useEffect(() => {
    async function loadUser() {
      if (typeof window === "undefined") return;
      try {
        const storedToken = localStorage.getItem("pune_hunt_token");
        if (storedToken) {
          setToken(storedToken);
          const res = await authAPI.getMe(storedToken);
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            // Token expired or invalid
            localStorage.removeItem("pune_hunt_token");
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (identifier, password) => {
    const res = await authAPI.login({ identifier, password });
    if (res.success && res.token) {
      localStorage.setItem("pune_hunt_token", res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || "Login failed" };
  };

  const register = async (username, email, password) => {
    const res = await authAPI.register({ username, email, password });
    if (res.success && res.token) {
      localStorage.setItem("pune_hunt_token", res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || "Registration failed" };
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pune_hunt_token");
    }
    setToken(null);
    setUser(null);
  };

  const openLoginModal = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode("register");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

