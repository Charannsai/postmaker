"use client";

import type {
  FrameSettings,
  BackgroundStyleId,
  CanvasAspectRatio,
  CaptionStyleId,
} from "@/types";
import {
  BACKGROUND_STYLES,
  PRESET_CAPTIONS,
  CAPTION_STYLES,
} from "@/lib/templates";

interface PfpFrameControlsProps {
  frame: FrameSettings;
  onChange: (updates: Partial<FrameSettings>) => void;
}

export default function PfpFrameControls({
  frame,
  onChange,
}: PfpFrameControlsProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Custom Caption Input */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Headline / Slogan
        </label>
        <input
          type="text"
          value={frame.caption}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="e.g. I AM COMING TO HH GOA '26 · ARE YOU?"
          maxLength={55}
          className="input !text-[13px]"
        />
      </div>

      {/* 2. Typography Ribbon Style */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Ribbon Text Style
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CAPTION_STYLES.map((cs) => (
            <button
              key={cs.id}
              onClick={() =>
                onChange({ captionStyle: cs.id as CaptionStyleId })
              }
              className={`p-2 rounded-lg text-[11px] font-bold border text-center transition-all ${
                (frame.captionStyle || "bold-street") === cs.id
                  ? "bg-[#171717] text-[#ffffff] border-[#171717] shadow-sm"
                  : "bg-[#ffffff] text-[#525252] border-[#e6dfd2] hover:border-[#171717]"
              }`}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 1-Click Popular Slogans */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] text-[#737373] font-mono block">
          Popular Presets (1-Click):
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
          {PRESET_CAPTIONS.map((cap) => (
            <button
              key={cap}
              onClick={() => onChange({ caption: cap })}
              className={`pill !text-[10.5px] !py-1 ${
                frame.caption === cap ? "active" : ""
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Canvas Ratio */}
      <div className="space-y-1.5 pt-2 border-t border-[#e6dfd2]">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Canvas Ratio
        </label>
        <div className="flex gap-1.5">
          {(
            [
              { id: "4:5", label: "4:5 Portfolio (Rec)" },
              { id: "1:1", label: "1:1 Square" },
              { id: "9:16", label: "9:16 Story" },
            ] as const
          ).map((asp) => (
            <button
              key={asp.id}
              onClick={() =>
                onChange({ aspectRatio: asp.id as CanvasAspectRatio })
              }
              className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                frame.aspectRatio === asp.id
                  ? "bg-[#171717] text-[#ffffff] border-[#171717]"
                  : "bg-[#ffffff] text-[#737373] border-[#e6dfd2] hover:border-[#171717]"
              }`}
            >
              {asp.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Paper Backdrop Pattern */}
      <div className="space-y-1.5 pt-2 border-t border-[#e6dfd2]">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Paper Backdrop
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {BACKGROUND_STYLES.map((bg) => (
            <button
              key={bg.id}
              onClick={() =>
                onChange({ bgStyle: bg.id as BackgroundStyleId })
              }
              className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                (frame.bgStyle || "paper-wrinkled") === bg.id
                  ? "bg-[#ffffff] text-[#171717] border-[#171717] ring-1 ring-[#171717] shadow-sm font-bold"
                  : "bg-[#ffffff] text-[#737373] border-[#e6dfd2] hover:border-[#171717]"
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
