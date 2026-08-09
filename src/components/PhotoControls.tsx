"use client";

import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
} from "lucide-react";
import type { PhotoState, FilterType } from "@/types";
import { FILTERS } from "@/lib/templates";

interface PhotoControlsProps {
  photo: PhotoState;
  onChange: (updates: Partial<PhotoState>) => void;
}

export default function PhotoControls({ photo, onChange }: PhotoControlsProps) {
  return (
    <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
        Photo Adjustments
      </label>

      {/* Zoom */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span className="flex items-center gap-1">
            <ZoomOut className="w-3 h-3" /> Zoom
          </span>
          <span className="font-mono">{Math.round(photo.zoom * 100)}%</span>
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
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Rotation</span>
          <span className="font-mono">{photo.rotation}°</span>
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

      {/* Quick action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange({ rotation: photo.rotation - 90 })}
          className="btn-secondary !p-2 !rounded-lg"
          title="Rotate -90°"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onChange({ rotation: photo.rotation + 90 })}
          className="btn-secondary !p-2 !rounded-lg"
          title="Rotate +90°"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onChange({ flipH: !photo.flipH })}
          className={`btn-secondary !p-2 !rounded-lg ${
            photo.flipH ? "!border-neon-cyan/40 !text-neon-cyan" : ""
          }`}
          title="Flip Horizontal"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onChange({ flipV: !photo.flipV })}
          className={`btn-secondary !p-2 !rounded-lg ${
            photo.flipV ? "!border-neon-cyan/40 !text-neon-cyan" : ""
          }`}
          title="Flip Vertical"
        >
          <FlipVertical className="w-3.5 h-3.5" />
        </button>
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
          className="btn-secondary !p-2 !rounded-lg ml-auto text-xs"
          title="Reset All"
        >
          Reset
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Filters
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ filter: f.id as FilterType })}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                photo.filter === f.id
                  ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30"
                  : "bg-white/[0.03] text-white/40 border border-transparent hover:bg-white/[0.06] hover:text-white/60"
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
