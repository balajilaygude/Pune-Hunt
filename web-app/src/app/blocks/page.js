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
  ChevronUp,
  UserCheck
} from "lucide-react";
import { TASK_BLOCKS } from "@/data/data";
import { useGame } from "@/context/GameContext";

const BLOCK_ICONS = {
  A: Car,
  B: Users,
  C: Landmark,
  D: Compass
};

export default function TaskBlocksPage() {
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
        // Replace second
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
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5 text-[#16845B]" />
            Spotting Task Blocks
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Select Your 2 Hunting Blocks 🎯
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Select 2 blocks from A, B, C, and D. Once 2 blocks are chosen, the others hide automatically and the full 10-task list for each selected block reveals!
          </p>
        </div>

        {/* Status pill & reset */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
            Selected: <span className="text-[#064E3B] font-bold">{selectedBlocks.length}/2</span> Blocks
          </div>

          {selectedBlocks.length > 0 && (
            <button
              onClick={() => setSelectedBlocks([])}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
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
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#064E3B] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-[#65C49A]" />
                2 Blocks Locked In: Block {selectedBlocks[0]} & Block {selectedBlocks[1]}
              </div>
              <h3 className="text-lg font-bold">
                Task Lists Opened! Review items before starting your Pune hunt.
              </h3>
            </div>

            <button
              onClick={() => setSelectedBlocks([])}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all shrink-0"
            >
              Choose Different Blocks
            </button>
          </div>

          {/* Quick Player Assignment bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Player 1 (Block {selectedBlocks[0]})
              </label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Player 1 Name"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Player 2 (Block {selectedBlocks[1]})
              </label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="Player 2 Name"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16845B]"
              />
            </div>

            <div className="pt-4 md:pt-0">
              <button
                onClick={handleLaunchGame}
                className="w-full py-3 px-5 rounded-2xl bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all active:scale-95"
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
              const Icon = BLOCK_ICONS[blockId] || Compass;
              const assignedPlayer = index === 0 ? p1Name : p2Name;

              return (
                <div
                  key={blockId}
                  className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/80 shadow-md relative"
                >
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#16845B] text-white flex items-center justify-center font-black text-xl shadow-md">
                        {block.id}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          {block.category} • Assigned to {assignedPlayer}
                        </span>
                        <h4 className="font-extrabold text-lg text-slate-900">{block.title}</h4>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      10 Tasks
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">{block.description}</p>

                  {/* Complete 10-Task List */}
                  <div className="space-y-2">
                    {block.tasks.map((task, tIdx) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#064E3B] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {tIdx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{task.text}</p>
                          {task.hint && (
                            <p className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1">
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
            const Icon = BLOCK_ICONS[block.id] || Compass;
            const isSelected = selectedBlocks.includes(block.id);
            const selectionIndex = selectedBlocks.indexOf(block.id);
            const isExpanded = expandedPreviewId === block.id;

            return (
              <div
                key={block.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-600 ring-4 ring-emerald-500/20 shadow-lg scale-[1.01]"
                    : "border-slate-200/80 hover:border-emerald-300 hover:shadow-md"
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
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                          {block.category}
                        </span>
                        <h3 className="font-extrabold text-xl text-slate-900">{block.title}</h3>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        Player {selectionIndex + 1}
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        10 Tasks
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5">
                    {block.description}
                  </p>

                  {/* Tasks Preview List */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <span>Tasks Included ({isExpanded ? "All 10" : "Top 4"})</span>
                      <button
                        onClick={() => setExpandedPreviewId(isExpanded ? null : block.id)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-medium flex items-center gap-1"
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
                        className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 flex items-start gap-2.5"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#064E3B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-800">{task.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection Action Button */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleSelectCard(block.id)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        : "bg-[#064E3B] hover:bg-[#053d2e] text-white shadow-sm shadow-emerald-950/20 active:scale-95"
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
