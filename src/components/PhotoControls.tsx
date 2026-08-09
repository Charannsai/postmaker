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
        <label className="text-[11px] font-bold text-[#fde047] uppercase tracking-wider">
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
          className="text-[11px] text-[#fefce8]/60 hover:text-[#fde047] transition-colors font-mono"
        >
          Reset All
        </button>
      </div>

      {/* Zoom */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#fefce8]/70">
          <span>Zoom</span>
          <span className="font-mono text-[#fde047]">
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
        <div className="flex items-center justify-between text-[11px] text-[#fefce8]/70">
          <span>Rotation</span>
          <span className="font-mono text-[#fde047]">{photo.rotation}°</span>
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
                ? "bg-[#facc15] border-[#facc15] text-[#072e1a] font-bold"
                : "bg-[#072e1a] border-[#facc15]/20 text-[#fefce8]/70 hover:border-[#facc15]/50 hover:text-[#fefce8]"
            }`}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2 pt-1 border-t border-[#facc15]/15">
        <label className="text-[11px] font-bold text-[#fde047] uppercase tracking-wider block">
          Photo Filters
        </label>
        <div className="grid grid-cols-3 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ filter: f.id as FilterType })}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                photo.filter === f.id
                  ? "bg-[#facc15] text-[#072e1a] font-bold shadow-sm"
                  : "bg-[#072e1a] text-[#fefce8]/70 border border-[#facc15]/15 hover:border-[#facc15]/40 hover:text-[#fefce8]"
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
