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
      <div className="grid grid-cols-3 p-1 rounded-xl bg-[#ffffff] border border-[#e6dfd2] shadow-sm">
        <button
          onClick={() => setActiveTab("style")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === "style"
              ? "bg-[#171717] text-[#ffffff] shadow-sm"
              : "text-[#737373] hover:text-[#171717]"
          }`}
        >
          <LayoutGrid className="w-3 h-3" />
          Style
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === "text"
              ? "bg-[#171717] text-[#ffffff] shadow-sm"
              : "text-[#737373] hover:text-[#171717]"
          }`}
        >
          <Type className="w-3 h-3" />
          Text & Slogan
        </button>
        <button
          onClick={() => setActiveTab("canvas")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === "canvas"
              ? "bg-[#171717] text-[#ffffff] shadow-sm"
              : "text-[#737373] hover:text-[#171717]"
          }`}
        >
          <Palette className="w-3 h-3" />
          Paper Backdrop
        </button>
      </div>

      {/* Tab 1: Style Selection */}
      {activeTab === "style" && (
        <div className="space-y-2 animate-fade-in">
          <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
            Choose Poster Style ({FRAME_TEMPLATES.length})
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
                      ? "bg-[#ffffff] border-[#171717] text-[#171717] shadow-sm ring-1 ring-[#171717]"
                      : "bg-[#ffffff]/60 border-[#e6dfd2] text-[#525252] hover:border-[#171717] hover:bg-[#ffffff]"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[12px] font-bold truncate text-[#171717]">
                      {t.label}
                    </p>
                    <p className="text-[10px] text-[#737373] truncate mt-0.5">
                      {t.description}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded shrink-0 font-bold ${
                      selected
                        ? "bg-[#171717] text-[#ffffff]"
                        : "bg-[#f5f2eb] text-[#737373]"
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
            <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
              Frame Caption / Headline
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

          {/* Typography Font Design */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
              Text Graphic Style
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

          {/* Quick Caption Suggestions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-[#737373] font-mono block">
              Popular Presets (1-Click):
            </span>
            <div className="flex flex-wrap gap-1.5">
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

          {/* Aesthetic Paper Motifs */}
          <div className="space-y-1.5 pt-2 border-t border-[#e6dfd2]">
            <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
              Paper Stamps & Motifs
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {STICKERS.map((st) => {
                const active = frame.stickers?.includes(st.id);
                return (
                  <button
                    key={st.id}
                    onClick={() => toggleSticker(st.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg text-[11px] font-semibold border text-left transition-all ${
                      active
                        ? "bg-[#171717] text-[#ffffff] border-[#171717] shadow-sm"
                        : "bg-[#ffffff] text-[#525252] border-[#e6dfd2] hover:border-[#171717]"
                    }`}
                  >
                    <span className="text-[9px] font-mono text-[#d97706]">★</span>
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
                  className={`p-2.5 rounded-xl text-[11px] font-semibold border text-center transition-all ${
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

          {/* Aspect Ratio */}
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
        </div>
      )}
    </div>
  );
}
