"use client";

import { useState } from "react";
import type {
  FrameSettings,
  FrameTemplateId,
  BackgroundStyleId,
  CanvasAspectRatio,
  StickerType,
  CaptionStyleId,
} from "@/types";
import {
  FRAME_TEMPLATES,
  BACKGROUND_STYLES,
  STICKERS,
  PRESET_CAPTIONS,
  CAPTION_STYLES,
} from "@/lib/templates";
import { LayoutGrid, Type, Palette } from "lucide-react";

interface PfpFrameControlsProps {
  frame: FrameSettings;
  onChange: (updates: Partial<FrameSettings>) => void;
}

type TabType = "style" | "text" | "canvas";

export default function PfpFrameControls({
  frame,
  onChange,
}: PfpFrameControlsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("style");

  const toggleSticker = (id: StickerType) => {
    const current = frame.stickers || [];
    if (current.includes(id)) {
      onChange({ stickers: current.filter((s) => s !== id) });
    } else {
      onChange({ stickers: [...current, id] });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Clean Segmented Sub-Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
        <button
          onClick={() => setActiveTab("style")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === "style"
              ? "bg-neutral-800 text-neutral-100 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <LayoutGrid className="w-3 h-3" />
          Style
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === "text"
              ? "bg-neutral-800 text-neutral-100 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Type className="w-3 h-3" />
          Text & Style
        </button>
        <button
          onClick={() => setActiveTab("canvas")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === "canvas"
              ? "bg-neutral-800 text-neutral-100 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Palette className="w-3 h-3" />
          Backdrop
        </button>
      </div>

      {/* Tab 1: Style Selection */}
      {activeTab === "style" && (
        <div className="space-y-2 animate-fade-in">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Choose Frame Style ({FRAME_TEMPLATES.length})
          </label>
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {FRAME_TEMPLATES.map((t) => {
              const selected = frame.templateId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() =>
                    onChange({ templateId: t.id as FrameTemplateId })
                  }
                  className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selected
                      ? "bg-neutral-800/90 border-neutral-400 text-neutral-100 shadow-sm"
                      : "bg-neutral-900/40 border-neutral-800/60 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900/80"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[12px] font-semibold truncate">
                      {t.label}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                      {t.description}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded shrink-0 ${
                      selected
                        ? "bg-neutral-700 text-neutral-200"
                        : "bg-neutral-800 text-neutral-600"
                    }`}
                  >
                    {t.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Caption, Typography Style & Stickers */}
      {activeTab === "text" && (
        <div className="space-y-4 animate-fade-in">
          {/* Custom Caption Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Frame Caption / Slogan
            </label>
            <input
              type="text"
              value={frame.caption}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="e.g. I am coming to HH GOA 26, Are you?"
              maxLength={50}
              className="input !text-[13px]"
            />
          </div>

          {/* Typography Font Design */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Text Graphic Design
            </label>
            <div className="grid grid-cols-2 gap-1">
              {CAPTION_STYLES.map((cs) => (
                <button
                  key={cs.id}
                  onClick={() =>
                    onChange({ captionStyle: cs.id as CaptionStyleId })
                  }
                  className={`p-2 rounded-lg text-[11px] font-semibold border text-center transition-all ${
                    (frame.captionStyle || "handwritten") === cs.id
                      ? "bg-neutral-800 text-amber-300 border-amber-400/50 shadow-sm"
                      : "bg-neutral-950 text-neutral-500 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {cs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Caption Suggestions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-neutral-500 font-mono block">
              Popular Slogans & Badges:
            </span>
            <div className="flex flex-wrap gap-1">
              {PRESET_CAPTIONS.map((cap) => (
                <button
                  key={cap}
                  onClick={() => onChange({ caption: cap })}
                  className={`pill !text-[10px] !py-1 ${
                    frame.caption === cap ? "active !border-amber-400/40 !text-amber-300" : ""
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          {/* Aesthetic Stickers */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Stickers & Accents
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {STICKERS.map((st) => {
                const active = frame.stickers?.includes(st.id);
                return (
                  <button
                    key={st.id}
                    onClick={() => toggleSticker(st.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg text-[11px] font-medium border text-left transition-all ${
                      active
                        ? "bg-neutral-800 text-amber-300 border-amber-400/40"
                        : "bg-neutral-950 text-neutral-500 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <span className="text-sm">{st.emoji}</span>
                    <span className="truncate">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Canvas Backdrop & Ratio */}
      {activeTab === "canvas" && (
        <div className="space-y-4 animate-fade-in">
          {/* Backdrop Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Backdrop Pattern
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {BACKGROUND_STYLES.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() =>
                    onChange({ bgStyle: bg.id as BackgroundStyleId })
                  }
                  className={`p-2.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                    frame.bgStyle === bg.id
                      ? "bg-neutral-800 text-neutral-100 border-neutral-400 shadow-sm"
                      : "bg-neutral-900/50 text-neutral-500 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Canvas Size / Ratio
            </label>
            <div className="flex gap-1.5">
              {(
                [
                  { id: "1:1", label: "1:1 Square" },
                  { id: "4:5", label: "4:5 Portrait" },
                  { id: "9:16", label: "9:16 Story" },
                ] as const
              ).map((asp) => (
                <button
                  key={asp.id}
                  onClick={() =>
                    onChange({ aspectRatio: asp.id as CanvasAspectRatio })
                  }
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
      )}
    </div>
  );
}
