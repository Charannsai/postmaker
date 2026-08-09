"use client";

import type { FrameSettings, FrameShape, FrameTemplateId } from "@/types";
import { FRAME_TEMPLATES, BADGE_PRESETS } from "@/lib/templates";

interface PfpFrameControlsProps {
  frame: FrameSettings;
  onChange: (updates: Partial<FrameSettings>) => void;
}

export default function PfpFrameControls({ frame, onChange }: PfpFrameControlsProps) {
  return (
    <div className="space-y-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      {/* Frame style */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
          Frame Style
        </label>
        <div className="space-y-1.5">
          {FRAME_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ templateId: t.id as FrameTemplateId })}
              className={`tmpl-card w-full p-3 flex items-center gap-3 text-left ${
                frame.templateId === t.id ? "selected" : ""
              }`}
            >
              <div
                className="w-7 h-7 rounded-md shrink-0 border border-[#333]"
                style={{
                  background: `linear-gradient(135deg, ${t.colors.primary}40, ${t.colors.secondary}30)`,
                }}
              />
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-neutral-300 truncate">{t.label}</p>
                <p className="text-[10px] text-neutral-600 truncate">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shape */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Shape</label>
        <div className="flex gap-1.5">
          {(["circle", "squircle"] as FrameShape[]).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ shape: s })}
              className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all border ${
                frame.shape === s
                  ? "bg-[#1f1f1f] text-neutral-200 border-[#333]"
                  : "text-neutral-600 border-[#1a1a1a] hover:border-[#262626]"
              }`}
            >
              {s === "circle" ? "Circle" : "Squircle"}
            </button>
          ))}
        </div>
      </div>

      {/* Badge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Badge</label>
          <div
            className={`toggle-track ${frame.badgeEnabled ? "on" : ""}`}
            onClick={() => onChange({ badgeEnabled: !frame.badgeEnabled })}
          >
            <div className="toggle-knob" />
          </div>
        </div>

        {frame.badgeEnabled && (
          <div className="space-y-2 animate-scale-in">
            <div className="flex flex-wrap gap-1">
              {BADGE_PRESETS.map((text) => (
                <button
                  key={text}
                  onClick={() => onChange({ badgeText: text })}
                  className={`pill !text-[10px] ${frame.badgeText === text ? "active" : ""}`}
                >
                  {text}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={frame.badgeText}
              onChange={(e) => onChange({ badgeText: e.target.value })}
              placeholder="Custom text..."
              maxLength={30}
              className="input !text-[12px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
