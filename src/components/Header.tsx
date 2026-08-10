"use client";

import type { AppMode } from "@/types";

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="w-full flex flex-col items-center pt-8 pb-4 px-4 text-center select-none">
      {/* Main Title & Brand Logo Asset */}
      <div className="flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/image.png"
          alt="HACKER HOUSE GOA"
          className="h-24 sm:h-28 md:h-32 w-auto drop-shadow-[0_4px_20px_rgba(255,230,0,0.3)] transition-transform hover:scale-105"
        />

      </div>

      {/* Subtitle Dates */}
      <div className="mt-3 font-mono text-[11px] sm:text-[12px] tracking-[0.25em] text-emerald-200/90 font-bold uppercase">
        28 – 31 OCT 2026 · GOA
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

