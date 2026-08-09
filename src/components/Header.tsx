"use client";

import { Palmtree, Sparkles } from "lucide-react";
import type { AppMode } from "@/types";

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="w-full glass border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-pink to-neon-orange flex items-center justify-center">
              <Palmtree className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-cyan animate-pulse-glow" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-orange bg-clip-text text-transparent">
              HH GOA 2026
            </span>
            <span className="text-[10px] text-white/30 font-mono tracking-wider">
              FRAME & ID GENERATOR
            </span>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-dark-800/80 border border-white/5">
          <button
            onClick={() => onModeChange("pfp-frame")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "pfp-frame"
                ? "tab-active"
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            PFP Frame
          </button>
          <button
            onClick={() => onModeChange("builder-card")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "builder-card"
                ? "tab-active"
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <circle cx="8" cy="12" r="2" />
              <path d="M16 10h2" />
              <path d="M16 14h2" />
            </svg>
            Builder ID
          </button>
        </div>

        {/* Event badge */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-white/25 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          BUILD & VIBE
        </div>
      </div>
    </header>
  );
}
