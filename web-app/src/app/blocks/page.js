"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Car,
  Users,
  Landmark,
  Compass,
  Check,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { TASK_BLOCKS } from "@/data/data";
import { useGame } from "@/context/GameContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const BLOCK_ICONS = {
  A: Car,
  B: Users,
  C: Landmark,
  D: Compass
};

function TaskBlocksPageContent() {
  const router = useRouter();
  const { startNewGame } = useGame();

  // Selection state for 2 players
  const [selectedBlocks, setSelectedBlocks] = useState([]); // array of block IDs: e.g. ["A", "C"]
  const [p1Name, setP1Name] = useState("Aarav");
  const [p2Name, setP2Name] = useState("Tanvi");
  const [routeLocation, setRouteLocation] = useState("Pune City Streets");

  // Expanded inspection on unselected state
  const [expandedPreviewId, setExpandedPreviewId] = useState(null);

  const blockEntries = Object.values(TASK_BLOCKS);

  // Toggle selection for a card
  const handleSelectCard = (blockId) => {
    if (selectedBlocks.includes(blockId)) {
      setSelectedBlocks(selectedBlocks.filter((id) => id !== blockId));
    } else {
      if (selectedBlocks.length < 2) {
        setSelectedBlocks([...selectedBlocks, blockId]);
      } else {
        setSelectedBlocks([selectedBlocks[0], blockId]);
      }
    }
  };

  const handleLaunchGame = () => {
    if (selectedBlocks.length !== 2) return;
    startNewGame({
      player1Name: p1Name,
      player1Block: selectedBlocks[0],
      player2Name: p2Name,
      player2Block: selectedBlocks[1],
      location: routeLocation
    });
    router.push("/play");
  };

  const isTwoCardsSelected = selectedBlocks.length === 2;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/60 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-badge-green text-xs font-black mb-2 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#16845B]" />
            Spotting Task Blocks
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Select Your 2 Hunting Blocks 🎯
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl">
            Select 2 blocks from A, B, C, and D. Once 2 blocks are chosen, the others hide automatically and the full 10-task list for each selected block reveals!
          </p>
        </div>

        {/* Status pill & reset */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl glass-pill text-xs font-bold text-slate-700 shadow-sm">
            Selected: <span className="text-[#064E3B] font-black">{selectedBlocks.length}/2</span> Blocks
          </div>

          {selectedBlocks.length > 0 && (
            <button
              onClick={() => setSelectedBlocks([])}
              className="px-4 py-2 rounded-2xl glass-pill hover:bg-white text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Choices
            </button>
          )}
        </div>
      </div>

      {/* When 2 CARDS ARE SELECTED: Focus Mode */}
      {isTwoCardsSelected ? (
        <div className="space-y-6 animate-fade-in">
          {/* Top Banner Notice */}
          <div className="p-4 sm:p-5 rounded-3xl glass-hero text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-[#65C49A] uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4 text-[#65C49A]" />
                2 Blocks Locked In: Block {selectedBlocks[0]} & Block {selectedBlocks[1]}
              </div>
              <h3 className="text-lg font-black">
                Task Lists Opened! Review items before starting your Pune hunt.
              </h3>
            </div>

            <button
              onClick={() => setSelectedBlocks([])}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-extrabold transition-all shrink-0 active:scale-95"
            >
              Choose Different Blocks
            </button>
          </div>

          {/* Quick Player Assignment bar */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                Player 1 (Block {selectedBlocks[0]})
              </label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Player 1 Name"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                Player 2 (Block {selectedBlocks[1]})
              </label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="Player 2 Name"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div className="pt-2 md:pt-4">
              <button
                onClick={handleLaunchGame}
                className="w-full py-3.5 px-5 rounded-2xl glass-button-primary text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20 active:scale-95 transition-all"
              >
                <span>Start Match with These Blocks</span>
                <ArrowRight className="w-4 h-4 text-[#65C49A]" />
              </button>
            </div>
          </div>

          {/* Side-by-side full task list for the 2 chosen blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedBlocks.map((blockId, index) => {
              const block = TASK_BLOCKS[blockId];
              const assignedPlayer = index === 0 ? p1Name : p2Name;

              return (
                <div
                  key={blockId}
                  className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-emerald-400/80 relative"
                >
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#16845B] text-white flex items-center justify-center font-black text-xl shadow-md">
                        {block.id}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                          {block.category} • Assigned to {assignedPlayer}
                        </span>
                        <h4 className="font-black text-lg text-slate-900">{block.title}</h4>
                      </div>
                    </div>

                    <span className="text-xs font-black text-emerald-900 glass-badge-green px-3 py-1 rounded-full shadow-sm">
                      10 Tasks
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium mb-4">{block.description}</p>

                  {/* Complete 10-Task List */}
                  <div className="space-y-2">
                    {block.tasks.map((task, tIdx) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-2xl glass-panel-subtle border border-white/80 text-xs text-slate-800 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#064E3B] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {tIdx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{task.text}</p>
                          {task.hint && (
                            <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              {task.hint}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Standard 4-Block View (Unselected or 1 selected) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blockEntries.map((block) => {
            const isSelected = selectedBlocks.includes(block.id);
            const selectionIndex = selectedBlocks.indexOf(block.id);
            const isExpanded = expandedPreviewId === block.id;

            return (
              <div
                key={block.id}
                className={`glass-card rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all duration-300 ${
                  isSelected
                    ? "border-emerald-600 ring-4 ring-emerald-500/20 shadow-2xl scale-[1.01]"
                    : "glass-card-hover border-white/80"
                }`}
              >
                <div>
                  {/* Top Bar with Badge & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#16845B] text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-950/20">
                        {block.id}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                          {block.category}
                        </span>
                        <h3 className="font-black text-xl text-slate-900">{block.title}</h3>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center gap-1 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                        Player {selectionIndex + 1}
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1 rounded-full glass-pill text-slate-600">
                        10 Tasks
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-5">
                    {block.description}
                  </p>

                  {/* Tasks Preview List */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>Tasks Included ({isExpanded ? "All 10" : "Top 4"})</span>
                      <button
                        onClick={() => setExpandedPreviewId(isExpanded ? null : block.id)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>View All 10</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {(isExpanded ? block.tasks : block.tasks.slice(0, 4)).map((task, idx) => (
                      <div
                        key={task.id}
                        className="text-xs p-2.5 rounded-2xl glass-panel-subtle border border-white/80 text-slate-700 flex items-start gap-2.5"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#064E3B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{task.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection Action Button */}
                <div className="pt-3 border-t border-white/60">
                  <button
                    onClick={() => handleSelectCard(block.id)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? "bg-rose-50/80 text-rose-700 border border-rose-300 hover:bg-rose-100"
                        : "glass-button-primary text-white shadow-md active:scale-95"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>Deselect Block {block.id}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#65C49A]" />
                        <span>
                          {selectedBlocks.length === 0
                            ? `Select Block ${block.id} for Player 1`
                            : `Select Block ${block.id} for Player 2`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TaskBlocksPage() {
  return (
    <ProtectedRoute title="Sign In to Select Task Blocks">
      <TaskBlocksPageContent />
    </ProtectedRoute>
  );
}
