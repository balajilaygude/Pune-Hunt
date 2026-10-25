"use client";

import React, { useState } from "react";
import {
  Settings,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  MapPin,
  Shield,
  HelpCircle,
  CheckCircle2,
  Trash2,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function SettingsPage() {
  const { handleResetData } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const onResetConfirm = () => {
    handleResetData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const hotspots = [
    {
      name: "FC Road (Fergusson College Road)",
      highlight: "High density of student backpacks, Amruttulya tea, two-wheelers, and Marathi book stalls.",
      recommendedBlocks: "Great for quick street spots & student commuters"
    },
    {
      name: "Koregaon Park (KP Lanes 1-7)",
      highlight: "Boutique cafes, luxury BMW/Mercedes cars, pets on walks, and international tourists.",
      recommendedBlocks: "Great for luxury cars, pets & unique architecture"
    },
    {
      name: "Swargate to Laxmi Road & Tulshibaug",
      highlight: "PMPML transit hub, flower sellers, street vendors, traditional wadas, and Ganpati shrines.",
      recommendedBlocks: "Great for municipal buses, heritage wadas & market vendors"
    },
    {
      name: "Baner & Balewadi High Street",
      highlight: "Modern EV scooters, IT techie shuttles, vibrant cafes, and contemporary architecture.",
      recommendedBlocks: "Great for EV scooters, tech shuttles & chic signboards"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5 text-[#16845B]" />
          Preferences & Guides
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Game Settings & Pune Hotspots ⚙️
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure gameplay options and explore top hunting routes across Pune.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <h3 className="font-bold text-base text-slate-900">Gameplay Preferences</h3>

        <div className="space-y-4 divide-y divide-slate-100 text-xs">
          {/* Shared Device Mode */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#16845B]" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Shared Device Mode</p>
                <p className="text-slate-500">
                  Allows both players to mark spots in real-time from a single phone or tablet screen.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] font-bold text-xs">
              Always Active
            </span>
          </div>

          {/* Haptic feedback */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Haptic Spot Feedback</p>
                <p className="text-slate-500">
                  Subtle visual vibration feedback when a spotting task checkbox is tapped.
                </p>
              </div>
            </div>
            <button
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                vibrationEnabled ? "bg-[#16845B]" : "bg-slate-200"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  vibrationEnabled ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Pune Spotting Hotspots */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#16845B]" />
          <h3 className="font-bold text-base text-slate-900">Recommended Pune Spotting Hotspots</h3>
        </div>
        <p className="text-xs text-slate-500">
          These popular Pune neighborhoods offer the highest probability of spotting items quickly:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {hotspots.map((spot, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2"
            >
              <div className="font-bold text-xs text-slate-900">{spot.name}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{spot.highlight}</p>
              <div className="text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg inline-block">
                Best for: {spot.recommendedBlocks}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone / Reset Data */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-rose-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              Reset App Data to Factory Defaults
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Resets match history and leaderboards back to the initial demo records from <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">data.js</code> and clears any ongoing game.
            </p>
          </div>

          <button
            onClick={onResetConfirm}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>

        {resetSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All records have been reset back to initial demo data!</span>
          </div>
        )}
      </div>
    </div>
  );
}
