"use client";

import type { CardData, BuilderRole } from "@/types";
import { ROLES } from "@/lib/templates";
import { Shuffle } from "lucide-react";

interface BuilderCardControlsProps {
  card: CardData;
  onCardChange: (updates: Partial<CardData>) => void;
}

const FUN_TITLES = [
  "Everything intentional. Shipping in Goa.",
  "10x Caffeine-to-Code Pipeline",
  "Zero-to-Ship Speedrunner",
  "Ship First, Sleep Later",
  "Building the Future on the Beach",
  "Solana Transaction Wizard",
  "Full-Stack Caffeine Engine",
];

export default function BuilderCardControls({ card, onCardChange }: BuilderCardControlsProps) {
  const randomizeTitle = () => {
    const filtered = FUN_TITLES.filter((t) => t !== card.funTitle);
    onCardChange({ funTitle: filtered[Math.floor(Math.random() * filtered.length)] });
  };

  return (
    <div className="space-y-4 text-emerald-100">
      {/* Name */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Full Name
        </label>
        <input
          type="text"
          value={card.name}
          onChange={(e) => onCardChange({ name: e.target.value })}
          placeholder="ALEX RIVERA"
          maxLength={26}
          className="input !text-[14px] !font-bold"
        />
      </div>

      {/* Handle */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Handle
        </label>
        <input
          type="text"
          value={card.handle}
          onChange={(e) => onCardChange({ handle: e.target.value })}
          placeholder="@alexbuilds"
          maxLength={22}
          className="input !text-[13px]"
        />
      </div>

      {/* Role with Custom Text Input & Quick Preset Chips */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Role
        </label>
        <input
          type="text"
          value={card.role}
          onChange={(e) => onCardChange({ role: e.target.value as BuilderRole })}
          placeholder="Enter your role (e.g. Fullstack, Web3 Dev...)"
          maxLength={24}
          className="input !text-[13px]"
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onCardChange({ role: r as BuilderRole })}
              className={`pill !text-[10px] !py-1 ${card.role === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Fun Title / Tagline */}
      <div className="space-y-1 pt-2 border-t border-[#166940]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider">Tagline</label>
          <button type="button" onClick={randomizeTitle} className="flex items-center gap-1 text-[10px] text-[#ffe600] hover:text-[#fff066] font-mono font-semibold">
            <Shuffle className="w-3 h-3" /> Random
          </button>
        </div>
        <input
          type="text"
          value={card.funTitle}
          onChange={(e) => onCardChange({ funTitle: e.target.value })}
          placeholder="Ship First, Sleep Later"
          maxLength={45}
          className="input !text-[12px]"
        />
      </div>
    </div>
  );
}




