"use client";

import { useState, useRef, useCallback } from "react";
import type {
  AppMode,
  PhotoState,
  FrameSettings,
  CardData,
  CardTemplateId,
  CanvasAspectRatio,
} from "@/types";
import { getRandomTitle } from "@/lib/titles";
import Header from "@/components/Header";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoControls from "@/components/PhotoControls";
import PfpFrameControls from "@/components/PfpFrameControls";
import BuilderCardControls from "@/components/BuilderCardControls";
import PreviewCanvas from "@/components/PreviewCanvas";
import ExportActions from "@/components/ExportActions";
import ShareModal from "@/components/ShareModal";

function genBadgeId() {
  return `HHG-26-${Math.floor(1000 + Math.random() * 9000)}`;
}

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
  caption: "I am coming to HH GOA 26, Are you? 🌴",
  subcaption: "HH GOA 2026",
  captionStyle: "bold-street",
  badgeEnabled: true,
  badgeText: "SEE YOU IN GOA 🌴",
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
  tagline: "Everything intentional. Shipping by the beach.",
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
    (u: Partial<FrameSettings>) => setFrame((p) => ({ ...p, ...u })),
    []
  );
  const updateCard = useCallback(
    (u: Partial<CardData>) => setCard((p) => ({ ...p, ...u })),
    []
  );
  const handlePhotoSrc = useCallback(
    (src: string) => updatePhoto({ src }),
    [updatePhoto]
  );
  const handleOffsetChange = useCallback(
    (offsetX: number, offsetY: number) => updatePhoto({ offsetX, offsetY }),
    [updatePhoto]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-neutral-200">
      <Header mode={mode} onModeChange={setMode} />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-8">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-neutral-900 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-100">
              {mode === "pfp-frame"
                ? "Aesthetic Frame & PFP Studio"
                : "Builder ID Pass Studio"}
            </h1>
            <p className="text-[12px] text-neutral-500 mt-0.5">
              {mode === "pfp-frame"
                ? "Create captioned polaroids, postage stamps, retro players & festival frames for HH Goa 2026."
                : "Generate aesthetic scrapbook passes, boarding passes & conference badges."}
            </p>
          </div>

          {/* Quick Aspect Ratio Selector (for PFP mode) */}
          {mode === "pfp-frame" && (
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#141414] border border-[#222]">
              <span className="text-[10px] text-neutral-500 font-mono px-2">
                Ratio:
              </span>
              {(["1:1", "4:5", "9:16"] as CanvasAspectRatio[]).map((asp) => (
                <button
                  key={asp}
                  onClick={() => updateFrame({ aspectRatio: asp })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    frame.aspectRatio === asp
                      ? "bg-neutral-800 text-neutral-100 border border-neutral-600"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {asp === "1:1" ? "1:1 Square" : asp === "4:5" ? "4:5 Post" : "9:16 Story"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_330px] xl:grid-cols-[320px_1fr_350px] gap-6 items-start">
          {/* Left Column: Photo & Image Adjustments */}
          <div className="order-2 lg:order-1 space-y-4">
            <div className="surface p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                <span className="text-[12px] font-bold text-neutral-200 uppercase tracking-wider">
                  1. Upload Photo
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  HEIC / JPG / PNG
                </span>
              </div>
              <PhotoUploader
                photoSrc={photo.src}
                onPhotoChange={handlePhotoSrc}
              />
              {photo.src && (
                <PhotoControls photo={photo} onChange={updatePhoto} />
              )}
            </div>
          </div>

          {/* Center Column: Large High-Visibility Live Preview */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-5">
            {/* Live Canvas */}
            <PreviewCanvas
              mode={mode}
              photo={photo}
              frame={frame}
              card={card}
              cardTemplateId={cardTemplateId}
              onPhotoOffsetChange={handleOffsetChange}
              canvasRef={canvasRef}
            />

            {/* Export & Actions docked right under the center canvas */}
            <div className="w-full max-w-[500px] surface p-4 shadow-xl">
              <ExportActions
                canvasRef={canvasRef}
                mode={mode}
                onShareClick={() => setShareOpen(true)}
              />
            </div>
          </div>

          {/* Right Column: Style, Captions, Stickers & Templates */}
          <div className="order-3 lg:order-3 space-y-4">
            <div className="surface p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                <span className="text-[12px] font-bold text-neutral-200 uppercase tracking-wider">
                  2. Customize Design
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {mode === "pfp-frame" ? "Frames & Stickers" : "Badges & Info"}
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

      <footer className="text-center py-5 text-[11px] text-neutral-600 font-mono border-t border-neutral-900 mt-10">
        HH Goa 2026 · #FrameInGoa · Clean & Aesthetic Studio
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
