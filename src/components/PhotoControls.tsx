"use client";

import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import type { PhotoState, FilterType } from "@/types";
import { FILTERS } from "@/lib/templates";

interface PhotoControlsProps {
  photo: PhotoState;
  onChange: (updates: Partial<PhotoState>) => void;
}

export default function PhotoControls({ photo, onChange }: PhotoControlsProps) {
  return (
    <div className="space-y-4 animate-fade-in pt-1">
      <div className="divider" />
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
          Adjustments
        </label>
        <button
          onClick={() =>
            onChange({
              zoom: 1,
              rotation: 0,
              flipH: false,
              flipV: false,
              offsetX: 0,
              offsetY: 0,
              filter: "original",
            })
          }
          className="text-[11px] text-[#737373] hover:text-[#171717] transition-colors font-mono"
        >
          Reset All
        </button>
      </div>

      {/* Zoom */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#525252]">
          <span>Zoom</span>
          <span className="font-mono text-[#171717] font-semibold">
            {Math.round(photo.zoom * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.05}
          value={photo.zoom}
          onChange={(e) => onChange({ zoom: parseFloat(e.target.value) })}
        />
      </div>

      {/* Rotation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#525252]">
          <span>Rotation</span>
          <span className="font-mono text-[#171717] font-semibold">
            {photo.rotation}°
          </span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          step={1}
          value={photo.rotation}
          onChange={(e) => onChange({ rotation: parseInt(e.target.value) })}
        />
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1.5">
        {[
          {
            icon: RotateCcw,
            action: () => onChange({ rotation: photo.rotation - 90 }),
            label: "-90°",
          },
          {
            icon: RotateCw,
            action: () => onChange({ rotation: photo.rotation + 90 }),
            label: "+90°",
          },
          {
            icon: FlipHorizontal,
            action: () => onChange({ flipH: !photo.flipH }),
            active: photo.flipH,
            label: "Flip H",
          },
          {
            icon: FlipVertical,
            action: () => onChange({ flipV: !photo.flipV }),
            active: photo.flipV,
            label: "Flip V",
          },
        ].map(({ icon: Icon, action, active, label }) => (
          <button
            key={label}
            onClick={action}
            className={`p-2 rounded-lg border transition-all ${
              active
                ? "bg-[#171717] border-[#171717] text-[#ffffff] font-bold shadow-sm"
                : "bg-[#ffffff] border-[#e6dfd2] text-[#525252] hover:border-[#171717] hover:text-[#171717]"
            }`}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2 pt-1 border-t border-[#e6dfd2]">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Photo Filters
        </label>
        <div className="grid grid-cols-3 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ filter: f.id as FilterType })}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                photo.filter === f.id
                  ? "bg-[#171717] text-[#ffffff] shadow-sm"
                  : "bg-[#ffffff] text-[#525252] border border-[#e6dfd2] hover:border-[#171717] hover:text-[#171717]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
