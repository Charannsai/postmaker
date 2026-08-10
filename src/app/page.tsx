"use client";

import { useState, useRef, useCallback } from "react";
import type {
  AppMode,
  PhotoState,
  FrameSettings,
  CardData,
} from "@/types";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoControls from "@/components/PhotoControls";
import PfpFrameControls from "@/components/PfpFrameControls";
import BuilderCardControls from "@/components/BuilderCardControls";
import PreviewCanvas from "@/components/PreviewCanvas";
import ExportActions from "@/components/ExportActions";
import ShareModal from "@/components/ShareModal";
import { Image as ImageIcon, IdCard, Sparkles } from "lucide-react";

const DEFAULT_PHOTO: PhotoState = {
  src: null,
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
  rotation: 0,
  flipH: false,
  flipV: false,
  filter: "original",
};

const DEFAULT_FRAME: FrameSettings = {
  caption: "HH GOA",
  subcaption: "HH GOA 2026",
  captionStyle: "bold-street",
  stickers: ["washi-tape"],
  bgStyle: "paper-wrinkled",
  aspectRatio: "4:5",
};

const DEFAULT_CARD: CardData = {
  name: "ALEX RIVERA",
  nickname: "ALEX",
  handle: "alexbuilds",
  role: "Fullstack",
  techStack: ["Next.js", "TypeScript", "Solana", "Tailwind"],
  funTitle: "10x Caffeine-to-Code Pipeline",
  noteText: "TREMBLING W/ EXCITEMENT & NERVES",
  badgeId: "HHG-26-8420",
  stickers: ["wizard-hat"],
  bgStyle: "notebook-lined",
};

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("pfp-frame");
  const [photo, setPhoto] = useState<PhotoState>(DEFAULT_PHOTO);
  const [frame, setFrame] = useState<FrameSettings>(DEFAULT_FRAME);
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [shareOpen, setShareOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updatePhoto = useCallback(
    (u: Partial<PhotoState>) => setPhoto((p) => ({ ...p, ...u })),
    []
  );
  const updateFrame = useCallback(
    (u: Partial<FrameSettings>) => setFrame((f) => ({ ...f, ...u })),
    []
  );
  const updateCard = useCallback(
    (u: Partial<CardData>) => setCard((c) => ({ ...c, ...u })),
    []
  );

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#fed7aa] selection:text-[#7c2d12]">
      {/* ── Studio Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#faf8f3]/90 backdrop-blur-md border-b border-[#e6dfd2] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-[#faf8f3] font-mono font-bold text-xs shadow-sm">
              HH
            </div>
            <div className="flex items-center gap-1.5 font-serif tracking-tight">
              <span className="text-[17px] font-black text-[#171717]">HACKER</span>
              <span className="text-[9px] font-sans font-bold bg-[#fed7aa] text-[#7c2d12] px-1.5 py-0.5 rounded border border-[#fdba74]">
                GOA &apos;26
              </span>
              <span className="text-[17px] font-black text-[#171717]">HOUSE</span>
            </div>
            <span className="hidden md:inline-flex items-center text-[10px] font-mono bg-[#ffffff] text-[#525252] px-2 py-0.5 rounded-full border border-[#e6dfd2] ml-2">
              AUG 13-16 · GOA, INDIA
            </span>
          </div>

          {/* Mode Switcher: Single PFP Poster vs Single Builder ID */}
          <div className="flex items-center p-1 rounded-xl bg-[#ffffff] border border-[#e6dfd2] shadow-sm">
            <button
              onClick={() => setMode("pfp-frame")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                mode === "pfp-frame"
                  ? "bg-[#171717] text-[#ffffff] shadow-sm"
                  : "text-[#737373] hover:text-[#171717]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Stamp PFP
            </button>
            <button
              onClick={() => setMode("builder-card")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                mode === "builder-card"
                  ? "bg-[#171717] text-[#ffffff] shadow-sm"
                  : "text-[#737373] hover:text-[#171717]"
              }`}
            >
              <IdCard className="w-3.5 h-3.5" />
              Event Pass
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Studio Layout ────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Intro Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e6dfd2] text-[11px] font-mono text-[#525252] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            #FrameInGoa · Official Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#171717] tracking-tight">
            {mode === "pfp-frame"
              ? "Retro Stamp PFP Maker"
              : "Event Pass Generator"}
          </h1>
          <p className="text-[13px] text-[#525252]">
            {mode === "pfp-frame"
              ? "Scalloped perforated stamp with massive bold text and your photo as a sticker cutout."
              : "Official lanyard badge on a Goa event poster with your name, role, and tech stack."}
          </p>
        </div>

        {/* 3-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Photo Upload & Adjustments */}
          <div className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="surface p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6dfd2] pb-2.5">
                <span className="text-[12px] font-bold text-[#171717] uppercase tracking-wider">
                  1. Your Photo
                </span>
                <span className="text-[10px] text-[#737373] font-mono">
                  HEIC / JPG / PNG
                </span>
              </div>

              <PhotoUploader
                photoSrc={photo.src}
                onPhotoLoaded={(src) => updatePhoto({ src })}
              />

              {photo.src && (
                <PhotoControls photo={photo} onChange={updatePhoto} />
              )}
            </div>
          </div>

          {/* Center Column: Live Preview & Direct Actions */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center space-y-4">
            <div className="w-full flex flex-col items-center surface p-4 sm:p-6 bg-[#faf8f3]">
              <div className="w-full max-w-[440px]">
                <PreviewCanvas
                  canvasRef={canvasRef}
                  mode={mode}
                  photo={photo}
                  frame={frame}
                  card={card}
                  onPhotoOffsetChange={(offsetX, offsetY) =>
                    updatePhoto({ offsetX, offsetY })
                  }
                />
              </div>
            </div>

            {/* Direct Export Action Toolbar */}
            <div className="w-full max-w-[440px]">
              <ExportActions
                canvasRef={canvasRef}
                mode={mode}
                onShareClick={() => setShareOpen(true)}
              />
            </div>
          </div>

          {/* Right Column: Information & Details */}
          <div className="lg:col-span-4 order-3 lg:order-3 space-y-4">
            <div className="surface p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6dfd2] pb-2.5">
                <span className="text-[12px] font-bold text-[#171717] uppercase tracking-wider">
                  2. {mode === "pfp-frame" ? "Stamp Text" : "Your Details"}
                </span>
                <span className="text-[10px] text-[#737373] font-mono">
                  {mode === "pfp-frame" ? "Bold Overlay" : "Name / Role / Stack"}
                </span>
              </div>

              {mode === "pfp-frame" ? (
                <PfpFrameControls frame={frame} onChange={updateFrame} />
              ) : (
                <BuilderCardControls
                  card={card}
                  onCardChange={updateCard}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-[11px] text-[#737373] font-mono border-t border-[#e6dfd2] mt-12 bg-[#faf8f3]">
        HACKER HOUSE GOA 2026 · Everything intentional. · #FrameInGoa
      </footer>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        canvasRef={canvasRef}
        mode={mode}
      />
    </div>
  );
}
