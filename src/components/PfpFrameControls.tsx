"use client";

import type { FrameSettings, FrameShape, FrameTemplateId } from "@/types";
import { FRAME_TEMPLATES, BADGE_PRESETS } from "@/lib/templates";
import { Circle, Square } from "lucide-react";

interface PfpFrameControlsProps {
  frame: FrameSettings;
  onChange: (updates: Partial<FrameSettings>) => void;
}

export default function PfpFrameControls({
  frame,
  onChange,
}: PfpFrameControlsProps) {
  return (
    <div className="space-y-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      {/* Frame templates */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Frame Style
        </label>
        <div className="grid grid-cols-1 gap-2">
          {FRAME_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ templateId: t.id as FrameTemplateId })}
              className={`template-card glass-card p-3 flex items-center gap-3 text-left ${
                frame.templateId === t.id ? "selected" : ""
              }`}
            >
              {/* Color preview swatch */}
              <div
                className="w-8 h-8 rounded-lg shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.secondary})`,
                  boxShadow: frame.templateId === t.id
                    ? `0 0 16px ${t.colors.glow}`
                    : "none",
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/80 truncate">
                  {t.label}
                </p>
                <p className="text-[10px] text-white/30 truncate">
                  {t.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shape toggle */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Shape
        </label>
        <div className="flex gap-2">
          {(["circle", "squircle"] as FrameShape[]).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ shape: s })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                frame.shape === s
                  ? "bg-neon-cyan/12 text-neon-cyan border border-neon-cyan/25"
                  : "bg-white/[0.03] text-white/35 border border-transparent hover:bg-white/[0.06]"
              }`}
            >
              {s === "circle" ? (
                <Circle className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" style={{ borderRadius: 4 }} />
              )}
              {s === "circle" ? "Circle" : "Squircle"}
            </button>
          ))}
        </div>
      </div>

      {/* Badge ribbon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Badge Ribbon
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={frame.badgeEnabled}
              onChange={(e) => onChange({ badgeEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-white/10 peer-checked:bg-neon-cyan/30 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/60 peer-checked:after:bg-neon-cyan after:rounded-full after:w-3 after:h-3 after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </div>

        {frame.badgeEnabled && (
          <div className="space-y-2 animate-scale-in">
            <div className="flex flex-wrap gap-1.5">
              {BADGE_PRESETS.map((text) => (
                <button
                  key={text}
                  onClick={() => onChange({ badgeText: text })}
                  className={`tech-pill !text-[10px] ${
                    frame.badgeText === text ? "active" : ""
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={frame.badgeText}
              onChange={(e) => onChange({ badgeText: e.target.value })}
              placeholder="Custom badge text..."
              maxLength={30}
              className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}
