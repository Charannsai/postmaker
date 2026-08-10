"use client";

import { useState, useRef, useCallback } from "react";
import type { AppMode, PhotoState, FrameSettings, CardData } from "@/types";
import Header from "@/components/Header";
import PreviewCanvas from "@/components/PreviewCanvas";
import ExportActions from "@/components/ExportActions";
import ShareModal from "@/components/ShareModal";
import CustomizeDrawer from "@/components/CustomizeDrawer";
import { isHeicFile, convertHeicToBlob } from "@/lib/heicConverter";
import { Sliders, ImagePlus } from "lucide-react";

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
  stickers: ["goa-hindi-logo"],
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
  stickers: ["goa-hindi-logo", "goa-sunset-art"],
  bgStyle: "notebook-lined",
};

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("pfp-frame");
  const [photo, setPhoto] = useState<PhotoState>(DEFAULT_PHOTO);
  const [frame, setFrame] = useState<FrameSettings>(DEFAULT_FRAME);
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [shareOpen, setShareOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        let blob: Blob = file;
        if (isHeicFile(file)) {
          blob = await convertHeicToBlob(file);
        }
        const url = URL.createObjectURL(blob);
        updatePhoto({ src: url, offsetX: 0, offsetY: 0, zoom: 1 });
      } catch (err) {
        console.error("Error loading image:", err);
      } finally {
        setUploading(false);
      }
    },
    [updatePhoto]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && (file.type.startsWith("image/") || isHeicFile(file))) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="min-h-screen bg-[#073820] text-[#faf8f3] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#ff007f] selection:text-[#ffe600]">
      {/* ── Header Branding ─────────────────────────────────── */}
      <Header mode={mode} onModeChange={setMode} />

      {/* ── Main Studio Area ──────────────────────────────── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 flex flex-col items-center justify-center my-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="w-full max-w-[560px] flex flex-col items-center space-y-6">
          {/* Central Dashed Dropzone Card containing Preview Frame */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`w-full dashed-dropzone p-3 sm:p-6 flex flex-col items-center justify-center transition-all ${
              dragOver ? "drag-over" : ""
            }`}
          >
            {/* Corner Crop Brackets */}
            <div className="corner-bracket corner-tl" />
            <div className="corner-bracket corner-tr" />
            <div className="corner-bracket corner-bl" />
            <div className="corner-bracket corner-br" />

            {/* Always Display Preview Canvas with Centered Upload Button when photo is null */}
            <div className="w-full flex flex-col items-center">
              <PreviewCanvas
                canvasRef={canvasRef}
                mode={mode}
                photo={photo}
                frame={frame}
                card={card}
                onPhotoOffsetChange={(offsetX, offsetY) =>
                  updatePhoto({ offsetX, offsetY })
                }
                onUploadClick={() => fileInputRef.current?.click()}
                uploading={uploading}
              />
            </div>
          </div>

          {/* Actions & Customization Toolbar */}
          <div className="w-full space-y-3">
            {photo.src ? (
              <ExportActions
                canvasRef={canvasRef}
                mode={mode}
                onShareClick={() => setShareOpen(true)}
              />
            ) : null}

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setCustomizeOpen(true)}
                className="btn-dark-pill flex items-center gap-2 text-xs !py-2.5 !px-6 shadow-lg"
              >
                <Sliders className="w-4 h-4 text-[#ffe600]" />
                Customize & Tweak Details
              </button>

              {photo.src && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-dark-pill flex items-center gap-2 text-xs !py-2.5 !px-6 shadow-lg"
                >
                  <ImagePlus className="w-4 h-4 text-emerald-300" />
                  Replace Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Simple Minimalist Footer ────────────────────────── */}
      <footer className="text-center py-6 px-4 font-mono text-[12px] text-emerald-300/80 uppercase tracking-widest select-none">
        <span className="text-[#ff007f] font-black">#FrameInGoa</span> · mhgoa.com
      </footer>

      {/* ── Modals & Drawers ──────────────────────────────── */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        canvasRef={canvasRef}
        mode={mode}
      />

      <CustomizeDrawer
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        mode={mode}
        photo={photo}
        frame={frame}
        card={card}
        onUpdatePhoto={updatePhoto}
        onUpdateFrame={updateFrame}
        onUpdateCard={updateCard}
      />
    </div>
  );
}


