"use client";

import type { FrameSettings } from "@/types";

interface PfpFrameControlsProps {
  frame: FrameSettings;
  onChange: (updates: Partial<FrameSettings>) => void;
}

export default function PfpFrameControls({ frame, onChange }: PfpFrameControlsProps) {
  return (
    <div className="space-y-5 text-emerald-100">
      {/* Stamp Text */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Stamp Text (Big Bold Text)
        </label>
        <input
          type="text"
          value={frame.caption}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="HH GOA"
          maxLength={20}
          className="input !text-[15px] !font-black !tracking-wider"
        />
        <p className="text-[10px] text-emerald-400/60 font-mono">
          Shorter text = bigger letters. Try 1-2 words for maximum impact on your X PFP avatar.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-1.5 pt-2 border-t border-[#166940]">
        <span className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Quick Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["HH GOA", "HACKER", "GOA 26", "SHIPPED", "BUILDER", "CODE", "VIBES"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ caption: t })}
              className={`pill !text-[11px] !py-1.5 !px-3 ${frame.caption === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}



