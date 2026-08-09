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
    <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
      <div className="divider" />
      <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
        Adjustments
      </label>

      {/* Zoom */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>Zoom</span>
          <span className="font-mono text-neutral-600">{Math.round(photo.zoom * 100)}%</span>
        </div>
        <input
          type="range" min={0.5} max={3} step={0.05}
          value={photo.zoom}
          onChange={(e) => onChange({ zoom: parseFloat(e.target.value) })}
        />
      </div>

      {/* Rotation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>Rotation</span>
          <span className="font-mono text-neutral-600">{photo.rotation}°</span>
        </div>
        <input
          type="range" min={-180} max={180} step={1}
          value={photo.rotation}
          onChange={(e) => onChange({ rotation: parseInt(e.target.value) })}
        />
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1.5">
        {[
          { icon: RotateCcw, action: () => onChange({ rotation: photo.rotation - 90 }), label: "-90°" },
          { icon: RotateCw, action: () => onChange({ rotation: photo.rotation + 90 }), label: "+90°" },
          { icon: FlipHorizontal, action: () => onChange({ flipH: !photo.flipH }), active: photo.flipH, label: "Flip H" },
          { icon: FlipVertical, action: () => onChange({ flipV: !photo.flipV }), active: photo.flipV, label: "Flip V" },
        ].map(({ icon: Icon, action, active, label }) => (
          <button
            key={label}
            onClick={action}
            className={`p-2 rounded-md border transition-colors ${
              active ? "bg-[#1f1f1f] border-[#444] text-neutral-200" : "bg-transparent border-[#1f1f1f] text-neutral-500 hover:border-[#333] hover:text-neutral-300"
            }`}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <button
          onClick={() => onChange({ zoom: 1, rotation: 0, flipH: false, flipV: false, offsetX: 0, offsetY: 0, filter: "original" })}
          className="ml-auto text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Filters</label>
        <div className="grid grid-cols-3 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ filter: f.id as FilterType })}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                photo.filter === f.id
                  ? "bg-[#1f1f1f] text-neutral-200 border border-[#333]"
                  : "text-neutral-600 border border-transparent hover:text-neutral-400"
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
