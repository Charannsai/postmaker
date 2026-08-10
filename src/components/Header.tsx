"use client";

import type { AppMode } from "@/types";

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="w-full flex flex-col items-center pt-8 pb-4 px-4 text-center select-none">
      {/* Main Title & Brand Logo */}
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-[#ffe600] uppercase drop-shadow-md">
          HACKER HOUSE
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/goa-hindi-logo.png"
          alt="गोवा"
          className="h-8 sm:h-10 w-auto drop-shadow-[0_2px_10px_rgba(255,0,127,0.5)]"
        />
      </div>

      {/* Subtitle Dates & Tagline */}
      <div className="mt-2 space-y-1 font-mono text-[11px] sm:text-[12px] tracking-[0.25em] text-emerald-200/75 uppercase">
        <div>OCT 28-31 · 2026 · GOA</div>
        <div className="text-emerald-400/90 font-semibold tracking-[0.3em]">
          LESS NOISE. MORE SIGNAL.
        </div>
      </div>

      {/* Mode Selector Capsule Pill */}
      <div className="mt-6 inline-flex items-center p-1 rounded-full bg-[#032113]/90 border border-[#166940] shadow-xl backdrop-blur-md">
        <button
          onClick={() => onModeChange("pfp-frame")}
          className={`flex flex-col items-center px-6 sm:px-8 py-2 rounded-full transition-all duration-200 ${
            mode === "pfp-frame"
              ? "bg-[#ffe600] text-[#042616] font-black shadow-lg scale-[1.02]"
              : "text-emerald-300/80 hover:text-white"
          }`}
        >
          <span className="text-[12px] sm:text-[13px] font-mono uppercase font-black tracking-wider leading-none">
            PFP FRAME
          </span>
          <span
            className={`text-[9px] font-mono tracking-normal leading-tight mt-0.5 ${
              mode === "pfp-frame" ? "text-[#042616]/80 font-bold" : "text-emerald-400/60"
            }`}
          >
            for your X avatar
          </span>
        </button>

        <button
          onClick={() => onModeChange("builder-card")}
          className={`flex flex-col items-center px-6 sm:px-8 py-2 rounded-full transition-all duration-200 ${
            mode === "builder-card"
              ? "bg-[#ffe600] text-[#042616] font-black shadow-lg scale-[1.02]"
              : "text-emerald-300/80 hover:text-white"
          }`}
        >
          <span className="text-[12px] sm:text-[13px] font-mono uppercase font-black tracking-wider leading-none">
            BUILDER PASS
          </span>
          <span
            className={`text-[9px] font-mono tracking-normal leading-tight mt-0.5 ${
              mode === "builder-card" ? "text-[#042616]/80 font-bold" : "text-emerald-400/60"
            }`}
          >
            for your timeline
          </span>
        </button>
      </div>
    </header>
  );
}

