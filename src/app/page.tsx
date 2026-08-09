"use client";

import { useState, useRef, useCallback } from "react";
import type {
  AppState,
  AppMode,
  PhotoState,
  FrameSettings,
  CardData,
  CardTemplateId,
} from "@/types";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoControls from "@/components/PhotoControls";
import PfpFrameControls from "@/components/PfpFrameControls";
import BuilderCardControls from "@/components/BuilderCardControls";
import PreviewCanvas from "@/components/PreviewCanvas";
import ExportActions from "@/components/ExportActions";
import ShareModal from "@/components/ShareModal";
import { Sparkles, Image as ImageIcon, IdCard, Sun } from "lucide-react";

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
  templateId: "hh-goa-official",
  caption: "I AM COMING TO HH GOA '26 · ARE YOU?",
  subcaption: "HH GOA 2026",
  captionStyle: "bold-street",
  badgeEnabled: true,
  badgeText: "SEE YOU IN GOA",
  stickers: ["sun-rising"],
  bgStyle: "hh-goa-emerald",
  aspectRatio: "1:1",
};

const DEFAULT_CARD: CardData = {
  name: "Alex Rivera",
  handle: "alexbuilds",
  role: "Fullstack",
  techStack: ["Next.js", "TypeScript", "Solana", "Tailwind"],
  funTitle: "10x Caffeine-to-Code Pipeline",
  tagline: "Everything intentional. Shipping in Goa.",
  badgeId: "HHG-26-8420",
  stickers: ["barcode"],
  bgStyle: "hh-goa-emerald",
};

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("pfp-frame");
  const [photo, setPhoto] = useState<PhotoState>(DEFAULT_PHOTO);
  const [frame, setFrame] = useState<FrameSettings>(DEFAULT_FRAME);
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [cardTemplateId, setCardTemplateId] =
    useState<CardTemplateId>("hh-goa-emerald-badge");
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
    <div className="min-h-screen bg-[#072e1a] text-[#fefce8] selection:bg-[#facc15]/30">
      {/* ── Official HH Goa Header ────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#072e1a]/90 backdrop-blur-md border-b border-[#facc15]/20 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#facc15] flex items-center justify-center text-[#072e1a] shadow-md shadow-[#facc15]/20">
              <Sun className="w-5 h-5 fill-[#072e1a]" />
            </div>
            <div className="flex items-center gap-1.5 font-serif tracking-tight">
              <span className="text-[17px] font-black text-[#fde047]">HACKER</span>
              <span className="text-[9px] font-sans font-bold bg-[#ec4899] text-white px-1.5 py-0.5 rounded shadow-sm">
                GOA &apos;26
              </span>
              <span className="text-[17px] font-black text-[#fde047]">HOUSE</span>
            </div>
            <span className="hidden md:inline-flex items-center text-[10px] font-mono bg-[#0d4a2b] text-[#facc15] px-2 py-0.5 rounded-full border border-[#facc15]/20 ml-2">
              AUG 13-16 · GOA, INDIA
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#052012] border border-[#facc15]/25">
            <button
              onClick={() => setMode("pfp-frame")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                mode === "pfp-frame"
                  ? "bg-[#facc15] text-[#072e1a] shadow-md shadow-[#facc15]/20"
                  : "text-[#fefce8]/60 hover:text-[#fefce8]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              PFP Frame
            </button>
            <button
              onClick={() => setMode("builder-card")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                mode === "builder-card"
                  ? "bg-[#facc15] text-[#072e1a] shadow-md shadow-[#facc15]/20"
                  : "text-[#fefce8]/60 hover:text-[#fefce8]"
              }`}
            >
              <IdCard className="w-3.5 h-3.5" />
              Builder ID
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Studio Layout ────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d4a2b] border border-[#facc15]/30 text-[11px] font-mono text-[#fde047]">
            <Sparkles className="w-3.5 h-3.5 text-[#ec4899]" />
            #FrameInGoa · Official Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#fefce8] tracking-tight">
            {mode === "pfp-frame" ? "Official HH Goa PFP & Social Frames" : "Official HH Goa Builder Passes"}
          </h1>
          <p className="text-[13px] text-[#fefce8]/70">
            {mode === "pfp-frame"
              ? "Create stunning, high-res social frames & festival passes to announce your presence in Goa."
              : "Generate authentic conference badges, boarding passes & developer cards for Hacker House Goa."}
          </p>
        </div>

        {/* 3-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Photo Upload & Adjustments */}
          <div className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="surface p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#facc15]/15 pb-2.5">
                <span className="text-[12px] font-bold text-[#fde047] uppercase tracking-wider">
                  1. Upload Photo
                </span>
                <span className="text-[10px] text-[#fefce8]/50 font-mono">
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
            <div className="w-full flex flex-col items-center surface p-4 sm:p-6 bg-[#0a3820]">
              <div className="w-full max-w-[440px]">
                <PreviewCanvas
                  canvasRef={canvasRef}
                  mode={mode}
                  photo={photo}
                  frame={frame}
                  card={card}
                  cardTemplateId={cardTemplateId}
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

          {/* Right Column: Style, Captions, Stickers & Templates */}
          <div className="lg:col-span-4 order-3 lg:order-3 space-y-4">
            <div className="surface p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#facc15]/15 pb-2.5">
                <span className="text-[12px] font-bold text-[#fde047] uppercase tracking-wider">
                  2. Customize Design
                </span>
                <span className="text-[10px] text-[#fefce8]/50 font-mono">
                  {mode === "pfp-frame" ? "Themes & Text" : "Badges & Info"}
                </span>
              </div>

              {mode === "pfp-frame" ? (
                <PfpFrameControls frame={frame} onChange={updateFrame} />
              ) : (
                <BuilderCardControls
                  card={card}
                  templateId={cardTemplateId}
                  onCardChange={updateCard}
                  onTemplateChange={setCardTemplateId}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-[11px] text-[#fefce8]/50 font-mono border-t border-[#facc15]/15 mt-12 bg-[#052012]">
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
