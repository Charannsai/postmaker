"use client";

import { useState, useRef, useCallback } from "react";
import type {
  AppMode,
  PhotoState,
  FrameSettings,
  CardData,
  CardTemplateId,
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

// Generate a random badge ID
function genBadgeId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `HHG-26-${n}`;
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
  templateId: "goa-neon-sunset",
  shape: "circle",
  badgeEnabled: true,
  badgeText: "SEE YOU IN GOA 🌴",
};

const DEFAULT_CARD: CardData = {
  name: "",
  handle: "",
  role: "Fullstack",
  techStack: ["React", "Next.js", "TypeScript"],
  funTitle: getRandomTitle(),
  tagline: "",
  badgeId: genBadgeId(),
};

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("pfp-frame");
  const [photo, setPhoto] = useState<PhotoState>(DEFAULT_PHOTO);
  const [frame, setFrame] = useState<FrameSettings>(DEFAULT_FRAME);
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [cardTemplateId, setCardTemplateId] =
    useState<CardTemplateId>("holographic-vip");
  const [shareOpen, setShareOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updatePhoto = useCallback((updates: Partial<PhotoState>) => {
    setPhoto((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateFrame = useCallback((updates: Partial<FrameSettings>) => {
    setFrame((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateCard = useCallback((updates: Partial<CardData>) => {
    setCard((prev) => ({ ...prev, ...updates }));
  }, []);

  const handlePhotoSrc = useCallback(
    (src: string) => {
      updatePhoto({ src });
    },
    [updatePhoto]
  );

  const handleOffsetChange = useCallback(
    (offsetX: number, offsetY: number) => {
      updatePhoto({ offsetX, offsetY });
    },
    [updatePhoto]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header mode={mode} onModeChange={setMode} />

      {/* Ambient background dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="ambient-dot w-[400px] h-[400px] -top-40 -right-40 bg-neon-cyan/[0.03]"
          style={{ filter: "blur(100px)" }}
        />
        <div
          className="ambient-dot w-[350px] h-[350px] top-1/2 -left-40 bg-neon-pink/[0.03]"
          style={{ filter: "blur(100px)" }}
        />
        <div
          className="ambient-dot w-[300px] h-[300px] bottom-20 right-1/4 bg-neon-orange/[0.02]"
          style={{ filter: "blur(100px)" }}
        />
      </div>

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
          {/* Hero text */}
          <div className="text-center mb-8 lg:mb-12 animate-slide-up">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-neon-cyan via-white to-neon-pink bg-clip-text text-transparent">
                {mode === "pfp-frame"
                  ? "Create Your PFP Frame"
                  : "Build Your ID Card"}
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/35 max-w-lg mx-auto">
              {mode === "pfp-frame"
                ? "Upload your photo, pick a frame style, and generate a branded HH Goa 2026 profile picture."
                : "Fill in your builder details, choose a template, and create your official event badge."}
            </p>
          </div>

          {/* Two-column workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-start">
            {/* Controls panel */}
            <div className="order-2 lg:order-1 space-y-5">
              <div className="glass-card p-5 space-y-5">
                <PhotoUploader
                  photoSrc={photo.src}
                  onPhotoChange={handlePhotoSrc}
                />

                {photo.src && (
                  <PhotoControls photo={photo} onChange={updatePhoto} />
                )}
              </div>

              <div className="glass-card p-5">
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

              {/* Export actions — visible on desktop below controls */}
              <div className="hidden lg:block glass-card p-5">
                <ExportActions
                  canvasRef={canvasRef}
                  mode={mode}
                  onShareClick={() => setShareOpen(true)}
                />
              </div>
            </div>

            {/* Preview column */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 flex flex-col items-center gap-5">
              <PreviewCanvas
                mode={mode}
                photo={photo}
                frame={frame}
                card={card}
                cardTemplateId={cardTemplateId}
                onPhotoOffsetChange={handleOffsetChange}
                canvasRef={canvasRef}
              />

              {/* Export actions — visible on mobile below preview */}
              <div className="lg:hidden w-full max-w-[380px]">
                <ExportActions
                  canvasRef={canvasRef}
                  mode={mode}
                  onShareClick={() => setShareOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-[11px] text-white/20 font-mono">
        Built for HH Goa 2026 · Share with{" "}
        <span className="text-neon-cyan/40">#FrameInGoa</span>
      </footer>

      {/* Share modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        canvasRef={canvasRef}
        mode={mode}
      />
    </div>
  );
}
