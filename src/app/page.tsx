"use client";

import { useState, useRef, useCallback } from "react";
import type { AppMode, PhotoState, FrameSettings, CardData } from "@/types";
import Header from "@/components/Header";
import PreviewCanvas from "@/components/PreviewCanvas";
import ExportActions from "@/components/ExportActions";
import ShareModal from "@/components/ShareModal";
import CustomizeDrawer from "@/components/CustomizeDrawer";
import { isHeicFile, convertHeicToBlob } from "@/lib/heicConverter";
import { Upload, Sliders, ImagePlus, Loader2 } from "lucide-react";

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
      {/* ── Left Side Ticker (Desktop) ────────────────────── */}
      <aside className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <div className="sprocket-dots">
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
        </div>
        <div className="vertical-ticker">
          SOMMELIER · RACE CONDITION MYSTIC · MERGE CONFLICT ARCHITECT · EDGE CASE DIPLOMAT
        </div>
        <div className="sprocket-dots">
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
        </div>
      </aside>

      {/* ── Right Side Ticker (Desktop) ───────────────────── */}
      <aside className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <div className="sprocket-dots">
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
        </div>
        <div className="vertical-ticker">
          OCT 28 - OCT 31 · 2026 · GOA · 15.2993° N, 74.1240° E · LESS NOISE. MORE SIGNAL.
        </div>
        <div className="sprocket-dots">
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
          <div className="sprocket-dot" />
        </div>
      </aside>

      {/* ── Header ────────────────────────────────────────── */}
      <Header mode={mode} onModeChange={setMode} />

      {/* ── Main Hero Dropzone & Studio Area ──────────────── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 flex flex-col items-center justify-center my-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="w-full max-w-[560px] flex flex-col items-center space-y-6">
          {/* Main Central Card Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`w-full dashed-dropzone p-4 sm:p-8 flex flex-col items-center justify-center transition-all ${
              dragOver ? "drag-over" : ""
            } ${!photo.src ? "min-h-[380px] sm:min-h-[420px]" : ""}`}
            onClick={() => {
              if (!photo.src) fileInputRef.current?.click();
            }}
          >
            {/* Corner Crop Brackets */}
            <div className="corner-bracket corner-tl" />
            <div className="corner-bracket corner-tr" />
            <div className="corner-bracket corner-bl" />
            <div className="corner-bracket corner-br" />

            {/* Content State 1: Upload Prompt */}
            {!photo.src ? (
              <div className="flex flex-col items-center text-center space-y-6 py-8">
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-[#ffe600] animate-spin" />
                    <p className="font-mono text-sm text-emerald-200">Processing Photo...</p>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="btn-yellow text-sm py-3.5 px-8"
                    >
                      <Upload className="w-4 h-4 text-[#042616]" />
                      UPLOAD A PHOTO
                    </button>

                    <div className="space-y-1 font-mono text-[11px] text-emerald-300/70 uppercase tracking-widest">
                      <div>JPG · PNG · HEIC · WEBP</div>
                      <div>ANY SHAPE – WE&apos;LL FRAME IT</div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Content State 2: Live Canvas Preview */
              <div className="w-full flex flex-col items-center space-y-4">
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
            )}
          </div>

          {/* Quick Action Toolbar underneath main card */}
          {photo.src && (
            <div className="w-full space-y-3">
              <ExportActions
                canvasRef={canvasRef}
                mode={mode}
                onShareClick={() => setShareOpen(true)}
              />

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setCustomizeOpen(true)}
                  className="btn-dark-pill flex items-center gap-2 text-xs !py-2 !px-5"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#ffe600]" />
                  Tweak & Customize
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-dark-pill flex items-center gap-2 text-xs !py-2 !px-5"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-emerald-300" />
                  Replace Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="text-center py-6 px-4 space-y-1.5 font-mono text-[11px] text-emerald-300/60 uppercase tracking-widest border-t border-[#166940]/40 bg-[#042616]/60 backdrop-blur-sm select-none">
        <div>NO LOGIN. NO SIGNUP. ONE PASS.</div>
        <div className="text-emerald-400/80 font-bold">
          <span className="text-[#ff007f]">#FrameInGoa</span> · mhgoa.com
        </div>
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

