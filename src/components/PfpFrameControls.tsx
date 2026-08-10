"use client";

import type { FrameSettings, CanvasAspectRatio, StickerType, BackgroundStyleId } from "@/types";
import { STICKERS, BACKGROUND_STYLES } from "@/lib/templates";

interface PfpFrameControlsProps {
  frame: FrameSettings;
  onChange: (updates: Partial<FrameSettings>) => void;
}

export default function PfpFrameControls({ frame, onChange }: PfpFrameControlsProps) {
  const toggleSticker = (id: StickerType) => {
    const current = frame.stickers || [];
    if (current.includes(id)) {
      onChange({ stickers: current.filter((s) => s !== id) });
    } else {
      onChange({ stickers: [...current, id] });
    }
  };

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
          Shorter text = bigger letters. Try 1-2 words for maximum impact.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-emerald-300/70 font-mono block">Quick Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {["HH GOA", "HACKER", "GOA 26", "SHIPPED", "BUILDER", "CODE", "VIBES"].map((t) => (
            <button
              key={t}
              onClick={() => onChange({ caption: t })}
              className={`pill !text-[11px] !py-1.5 !px-3 ${frame.caption === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stamps & Stickers */}
      <div className="space-y-1.5 pt-3 border-t border-[#166940]">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Stamps & Scribbles
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STICKERS.map((s) => {
            const active = frame.stickers?.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSticker(s.id)}
                className={`pill !text-[10px] !py-1 ${active ? "active" : ""}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background Style */}
      <div className="space-y-1.5 pt-3 border-t border-[#166940]">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Paper Background Style
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {BACKGROUND_STYLES.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onChange({ bgStyle: bg.id as BackgroundStyleId })}
              className={`flex items-center gap-2 p-2 rounded-xl text-[11px] font-mono font-bold border transition-all ${
                frame.bgStyle === bg.id
                  ? "bg-[#ffe600] text-[#042616] border-[#ffe600]"
                  : "bg-[#031c10] text-emerald-200 border-[#166940] hover:border-[#ffe600]"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                style={{ backgroundColor: bg.preview }}
              />
              <span className="truncate">{bg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-1.5 pt-3 border-t border-[#166940]">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Format
        </label>
        <div className="flex gap-1.5">
          {([
            { id: "4:5", label: "4:5 Post" },
            { id: "1:1", label: "1:1 Square" },
            { id: "9:16", label: "9:16 Story" },
          ] as const).map((asp) => (
            <button
              key={asp.id}
              onClick={() => onChange({ aspectRatio: asp.id as CanvasAspectRatio })}
              className={`flex-1 py-2 rounded-xl text-[11px] font-mono font-bold transition-all border ${
                frame.aspectRatio === asp.id
                  ? "bg-[#ffe600] text-[#042616] border-[#ffe600]"
                  : "bg-[#031c10] text-emerald-200 border-[#166940] hover:border-[#ffe600]"
              }`}
            >
              {asp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


