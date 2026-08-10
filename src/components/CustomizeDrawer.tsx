"use client";

import { useState } from "react";
import { X, Sliders, Type, Sparkles, Image as ImageIcon, IdCard } from "lucide-react";
import type { PhotoState, FrameSettings, CardData, AppMode } from "@/types";
import PhotoControls from "./PhotoControls";
import PfpFrameControls from "./PfpFrameControls";
import BuilderCardControls from "./BuilderCardControls";

interface CustomizeDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: AppMode;
  photo: PhotoState;
  frame: FrameSettings;
  card: CardData;
  onUpdatePhoto: (updates: Partial<PhotoState>) => void;
  onUpdateFrame: (updates: Partial<FrameSettings>) => void;
  onUpdateCard: (updates: Partial<CardData>) => void;
}

export default function CustomizeDrawer({
  open,
  onClose,
  mode,
  photo,
  frame,
  card,
  onUpdatePhoto,
  onUpdateFrame,
  onUpdateCard,
}: CustomizeDrawerProps) {
  const [tab, setTab] = useState<"details" | "photo">("details");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#042616] border border-[#166940] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#166940] bg-[#031f12]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#ffe600]" />
            <h2 className="text-sm font-mono font-bold text-[#ffe600] uppercase tracking-wider">
              {mode === "pfp-frame" ? "Customize PFP Frame" : "Customize Builder Pass"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#166940] bg-[#031c10]">
          <button
            onClick={() => setTab("details")}
            className={`flex-1 py-3 px-4 text-[12px] font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              tab === "details"
                ? "border-[#ffe600] text-[#ffe600] bg-white/5"
                : "border-transparent text-emerald-300/60 hover:text-emerald-200"
            }`}
          >
            {mode === "pfp-frame" ? (
              <>
                <Type className="w-3.5 h-3.5" /> Stamp & Style
              </>
            ) : (
              <>
                <IdCard className="w-3.5 h-3.5" /> Pass Details
              </>
            )}
          </button>
          <button
            onClick={() => setTab("photo")}
            className={`flex-1 py-3 px-4 text-[12px] font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              tab === "photo"
                ? "border-[#ffe600] text-[#ffe600] bg-white/5"
                : "border-transparent text-emerald-300/60 hover:text-emerald-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Photo Adjustments
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {tab === "details" ? (
            mode === "pfp-frame" ? (
              <PfpFrameControls frame={frame} onChange={onUpdateFrame} />
            ) : (
              <BuilderCardControls card={card} onCardChange={onUpdateCard} />
            )
          ) : (
            <PhotoControls photo={photo} onChange={onUpdatePhoto} />
          )}
        </div>

        {/* Footer Done button */}
        <div className="p-4 border-t border-[#166940] bg-[#031f12] flex justify-end">
          <button
            onClick={onClose}
            className="btn-yellow text-xs py-2 px-6"
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
}
