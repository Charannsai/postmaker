"use client";

import type { AppMode } from "@/types";

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="w-full border-b border-[#1a1a1a] sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold tracking-tight text-neutral-100">
            HH Goa 2026
          </span>
          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
            /postmaker
          </span>
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#111] border border-[#1f1f1f]">
          <button
            onClick={() => onModeChange("pfp-frame")}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
              mode === "pfp-frame"
                ? "bg-[#1f1f1f] text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            PFP Frame
          </button>
          <button
            onClick={() => onModeChange("builder-card")}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
              mode === "builder-card"
                ? "bg-[#1f1f1f] text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Builder ID
          </button>
        </div>
      </div>
    </header>
  );
}
