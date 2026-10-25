"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  Users,
  Landmark,
  Compass,
  ArrowRight,
  Layers,
  CheckCircle2,
  ListTodo
} from "lucide-react";
import { TASK_BLOCKS } from "@/data/data";

const BLOCK_ICONS = {
  A: Car,
  B: Users,
  C: Landmark,
  D: Compass
};

export default function BlockPreviewGrid() {
  const router = useRouter();
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const blockEntries = Object.values(TASK_BLOCKS);

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 gap-2">
        <div>
          <h3 className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
            <span>Choose Your Block</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064E3B]">
              4 Categories
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Each player selects one block of 10 authentic Pune street spotting tasks before the hunt starts.
          </p>
        </div>

        <Link
          href="/blocks"
          className="text-xs font-semibold text-[#16845B] hover:text-[#064E3B] flex items-center gap-1 transition-colors"
        >
          <span>View All Block Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {blockEntries.map((block) => {
          const Icon = BLOCK_ICONS[block.id] || Compass;
          const isSelected = selectedBlockId === block.id;

          return (
            <div
              key={block.id}
              onClick={() => setSelectedBlockId(block.id)}
              className={`bg-white rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? "border-emerald-600 ring-2 ring-emerald-500/30 shadow-md"
                  : "border-slate-200/80 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div>
                {/* Top Badge & Category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#16845B] text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
                    {block.id}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    10 Tasks
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                    {block.category}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 group-hover:text-[#064E3B] transition-colors">
                    {block.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {block.description}
                </p>

                {/* 3 Sample Tasks */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sample Spotting Tasks
                  </div>
                  {block.tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="text-xs p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16845B] shrink-0 mt-1.5" />
                      <span className="line-clamp-1">{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={`/blocks?selected=${block.id}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#064E3B] text-slate-700 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>Inspect & Select</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
