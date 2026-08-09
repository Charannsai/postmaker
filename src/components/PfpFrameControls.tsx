"use client";

import type {
  FrameSettings,
  FrameTemplateId,
  BackgroundStyleId,
  CanvasAspectRatio,
  StickerType,
} from "@/types";
import {
  FRAME_TEMPLATES,
  BACKGROUND_STYLES,
  STICKERS,
  PRESET_CAPTIONS,
} from "@/lib/templates";

interface PfpFrameControlsProps {
  frame: FrameSettings;
  onChange: (updates: Partial<FrameSettings>) => void;
}

export default function PfpFrameControls({
  frame,
  onChange,
}: PfpFrameControlsProps) {
  const toggleSticker = (id: StickerType) => {
    const current = frame.stickers || [];
    if (current.includes(id)) {
      onChange({ stickers: current.filter((s) => s !== id) });
    } else {
      onChange({ stickers: [...current, id] });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Frame Style Selection */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Aesthetic Frame Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FRAME_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ templateId: t.id as FrameTemplateId })}
              className={`tmpl-card p-3 flex flex-col text-left transition-all ${
                frame.templateId === t.id ? "selected !border-neutral-400 !bg-neutral-900" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[12px] font-semibold text-neutral-200">
                  {t.label}
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  {t.category}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-tight">
                {t.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Custom Caption & Presets */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Frame Caption / Text
          </label>
          <span className="text-[10px] text-neutral-500 font-mono">Editable</span>
        </div>
        <input
          type="text"
          value={frame.caption}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="e.g. see the good 🌴, She sparkles like sunshine..."
          maxLength={45}
          className="input !text-[13px]"
        />

        {/* Quick Caption Suggestions */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_CAPTIONS.map((cap) => (
            <button
              key={cap}
              onClick={() => onChange({ caption: cap })}
              className={`pill !text-[10px] ${
                frame.caption === cap ? "active" : ""
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Aesthetic Stickers & Accents */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Aesthetic Stickers & Details
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STICKERS.map((st) => {
            const active = frame.stickers?.includes(st.id);
            return (
              <button
                key={st.id}
                onClick={() => toggleSticker(st.id)}
                className={`pill flex items-center gap-1.5 !text-[11px] !py-1.5 ${
                  active ? "active !border-amber-400/50 !text-amber-300" : ""
                }`}
              >
                <span>{st.emoji}</span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Canvas Background Style */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Canvas Backdrop
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {BACKGROUND_STYLES.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onChange({ bgStyle: bg.id as BackgroundStyleId })}
              className={`p-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                frame.bgStyle === bg.id
                  ? "bg-neutral-800 text-neutral-100 border-neutral-400"
                  : "bg-neutral-950 text-neutral-500 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Format & Aspect Ratio */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Export Aspect Ratio
        </label>
        <div className="flex gap-2">
          {(
            [
              { id: "1:1", label: "1:1 Square (PFP / Post)" },
              { id: "9:16", label: "9:16 Story / Wallpaper" },
              { id: "4:5", label: "4:5 Portrait" },
            ] as const
          ).map((asp) => (
            <button
              key={asp.id}
              onClick={() => onChange({ aspectRatio: asp.id as CanvasAspectRatio })}
              className={`flex-1 py-2 rounded-lg text-[11px] font-semibold transition-all border ${
                frame.aspectRatio === asp.id
                  ? "bg-neutral-800 text-neutral-100 border-neutral-400"
                  : "bg-neutral-950 text-neutral-500 border-neutral-850 hover:border-neutral-700"
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
