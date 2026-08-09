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

function genBadgeId() {
  return `HHG-26-${Math.floor(1000 + Math.random() * 9000)}`;
}

const DEFAULT_PHOTO: PhotoState = {
  src: null, offsetX: 0, offsetY: 0, zoom: 1, rotation: 0,
  flipH: false, flipV: false, filter: "original",
};

const DEFAULT_FRAME: FrameSettings = {
  templateId: "goa-neon-sunset", shape: "circle",
  badgeEnabled: true, badgeText: "SEE YOU IN GOA 🌴",
};

const DEFAULT_CARD: CardData = {
  name: "", handle: "", role: "Fullstack",
  techStack: ["React", "Next.js", "TypeScript"],
  funTitle: getRandomTitle(), tagline: "", badgeId: genBadgeId(),
};

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("pfp-frame");
  const [photo, setPhoto] = useState<PhotoState>(DEFAULT_PHOTO);
  const [frame, setFrame] = useState<FrameSettings>(DEFAULT_FRAME);
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [cardTemplateId, setCardTemplateId] = useState<CardTemplateId>("holographic-vip");
  const [shareOpen, setShareOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updatePhoto = useCallback((u: Partial<PhotoState>) => setPhoto((p) => ({ ...p, ...u })), []);
  const updateFrame = useCallback((u: Partial<FrameSettings>) => setFrame((p) => ({ ...p, ...u })), []);
  const updateCard = useCallback((u: Partial<CardData>) => setCard((p) => ({ ...p, ...u })), []);
  const handlePhotoSrc = useCallback((src: string) => updatePhoto({ src }), [updatePhoto]);
  const handleOffsetChange = useCallback((offsetX: number, offsetY: number) => updatePhoto({ offsetX, offsetY }), [updatePhoto]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header mode={mode} onModeChange={setMode} />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-5 py-8 lg:py-14">
          {/* Title */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-100">
              {mode === "pfp-frame" ? "Create Your PFP Frame" : "Build Your ID Card"}
            </h1>
            <p className="mt-2 text-[13px] text-neutral-600 max-w-md mx-auto">
              {mode === "pfp-frame"
                ? "Upload a photo, pick a style, and download your branded frame."
                : "Fill in your details and generate your builder badge."}
            </p>
          </div>

          {/* Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-start">
            {/* Controls */}
            <div className="order-2 lg:order-1 space-y-4">
              <div className="surface p-5 space-y-4">
                <PhotoUploader photoSrc={photo.src} onPhotoChange={handlePhotoSrc} />
                {photo.src && <PhotoControls photo={photo} onChange={updatePhoto} />}
              </div>

              <div className="surface p-5">
                {mode === "pfp-frame" ? (
                  <PfpFrameControls frame={frame} onChange={updateFrame} />
                ) : (
                  <BuilderCardControls
                    card={card} templateId={cardTemplateId}
                    onCardChange={updateCard} onTemplateChange={setCardTemplateId}
                  />
                )}
              </div>

              <div className="hidden lg:block surface p-5">
                <ExportActions canvasRef={canvasRef} mode={mode} onShareClick={() => setShareOpen(true)} />
              </div>
            </div>

            {/* Preview */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-20 flex flex-col items-center gap-5">
              <PreviewCanvas
                mode={mode} photo={photo} frame={frame} card={card}
                cardTemplateId={cardTemplateId} onPhotoOffsetChange={handleOffsetChange}
                canvasRef={canvasRef}
              />
              <div className="lg:hidden w-full max-w-[360px]">
                <ExportActions canvasRef={canvasRef} mode={mode} onShareClick={() => setShareOpen(true)} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-5 text-[10px] text-neutral-700 font-mono">
        HH Goa 2026 · #FrameInGoa
      </footer>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} canvasRef={canvasRef} mode={mode} />
    </div>
  );
}
