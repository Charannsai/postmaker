"use client";

import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, RefreshCw } from "lucide-react";
import type { PhotoState, FilterType } from "@/types";
import { FILTERS } from "@/lib/templates";

interface PhotoControlsProps {
  photo: PhotoState;
  onChange: (updates: Partial<PhotoState>) => void;
}

export default function PhotoControls({ photo, onChange }: PhotoControlsProps) {
  return (
    <div className="space-y-4 animate-fade-in text-emerald-100">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider">
          Photo Adjustments
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
          className="flex items-center gap-1 text-[10px] text-emerald-300/70 hover:text-[#ffe600] transition-colors font-mono"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Zoom */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-200">
          <span>Zoom</span>
          <span className="text-[#ffe600] font-semibold">
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
        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-200">
          <span>Rotation</span>
          <span className="text-[#ffe600] font-semibold">
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
      <div className="flex items-center gap-2">
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
            className={`p-2.5 rounded-xl border transition-all ${
              active
                ? "bg-[#ffe600] border-[#ffe600] text-[#042616] font-bold shadow-sm"
                : "bg-[#031c10] border-[#166940] text-emerald-200 hover:border-[#ffe600] hover:text-[#ffe600]"
            }`}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2 pt-3 border-t border-[#166940]">
        <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
          Photo Filters
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ filter: f.id as FilterType })}
              className={`px-2 py-2 rounded-xl text-[11px] font-mono font-semibold transition-all ${
                photo.filter === f.id
                  ? "bg-[#ffe600] text-[#042616] shadow-sm font-bold"
                  : "bg-[#031c10] text-emerald-200 border border-[#166940] hover:border-[#ffe600] hover:text-[#ffe600]"
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

