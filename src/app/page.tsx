"use client";

import { useState, useRef, useCallback } from "react";
import type { AppMode, PhotoState, FrameSettings, CardData } from "@/types";
import Header from "@/components/Header";
import PreviewCanvas from "@/components/PreviewCanvas";
import ExportActions from "@/components/ExportActions";
import PhotoControls from "@/components/PhotoControls";
import PfpFrameControls from "@/components/PfpFrameControls";
import BuilderCardControls from "@/components/BuilderCardControls";
import { isHeicFile, convertHeicToBlob } from "@/lib/heicConverter";
import { Sliders, Type, Image as ImageIcon, IdCard } from "lucide-react";

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
  caption: "",
  subcaption: "HH GOA 2026",
  captionStyle: "bold-street",
  stickers: ["goa-hindi-logo"],
  bgStyle: "paper-wrinkled",
  aspectRatio: "1:1",
};


const DEFAULT_CARD: CardData = {
  name: "",
  nickname: "",
  handle: "",
  role: "Fullstack",
  techStack: ["React", "Next.js", "TypeScript", "Solana"],
  funTitle: "",
  noteText: "",
  badgeId: "HHG-26-8420",
  stickers: ["goa-hindi-logo", "goa-sunset-art"],
  bgStyle: "notebook-lined",
};

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("pfp-frame");
  const [photo, setPhoto] = useState<PhotoState>(DEFAULT_PHOTO);
  const [frame, setFrame] = useState<FrameSettings>(DEFAULT_FRAME);
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [customTab, setCustomTab] = useState<"details" | "photo">("details");
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const handleRemovePhoto = useCallback(() => {
    setPhoto(DEFAULT_PHOTO);
  }, []);

  return (
    <div className="min-h-screen bg-[#073820] text-[#faf8f3] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#ff007f] selection:text-[#ffe600]">
      {/* ── Header Branding ─────────────────────────────────── */}
      <Header mode={mode} onModeChange={setMode} />

      {/* ── Main Studio Area ──────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col items-center justify-center my-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* State 1: No Photo Uploaded -> Centered Hero Preview */}
        {!photo.src ? (
          <div className="w-full max-w-[560px] flex flex-col items-center space-y-6">
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
                  onRemovePhoto={handleRemovePhoto}
                  uploading={uploading}
                />
              </div>
            </div>
          </div>
        ) : (
          /* State 2: Photo Uploaded -> Side-by-Side 2-Column Layout (Image on left, Customization BESIDE it on right) */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Left Column: Preview Canvas & Export Action Buttons */}
            <div className={`flex flex-col items-center space-y-6 ${mode === "builder-card" ? "lg:col-span-7" : "lg:col-span-5"}`}>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`w-full dashed-dropzone p-3 sm:p-5 flex flex-col items-center justify-center transition-all ${
                  dragOver ? "drag-over" : ""
                }`}
              >
                {/* Corner Crop Brackets */}
                <div className="corner-bracket corner-tl" />
                <div className="corner-bracket corner-tr" />
                <div className="corner-bracket corner-bl" />
                <div className="corner-bracket corner-br" />

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
                  onRemovePhoto={handleRemovePhoto}
                  uploading={uploading}
                />
              </div>

              {/* Export Buttons directly below canvas */}
              <div className="w-full">
                <ExportActions
                  canvasRef={canvasRef}
                  mode={mode}
                  userName={card.name}
                  onValidationError={(msg) => {
                    setValidationError(msg);
                    setCustomTab("details");
                  }}
                />
              </div>
            </div>

            {/* Right Column: Customization Panel BESIDE the image */}
            <div className={`w-full ${mode === "builder-card" ? "lg:col-span-5" : "lg:col-span-7"}`}>
              <div className="w-full bg-[#042616] border border-[#166940] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
                {/* Panel Title & Tabs */}
                <div className="flex items-center justify-between border-b border-[#166940] pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#ffe600]" />
                    <h3 className="text-sm font-mono font-bold text-[#ffe600] uppercase tracking-wider">
                      Customization
                    </h3>
                  </div>

                  <div className="flex p-0.5 rounded-full bg-[#031c10] border border-[#166940]">
                    <button
                      onClick={() => setCustomTab("details")}
                      className={`px-3.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                        customTab === "details"
                          ? "bg-[#ffe600] text-[#042616] shadow-md"
                          : "text-emerald-300/70 hover:text-white"
                      }`}
                    >
                      {mode === "pfp-frame" ? (
                        <>
                          <Type className="w-3 h-3" /> Stamp Text
                        </>
                      ) : (
                        <>
                          <IdCard className="w-3 h-3" /> Pass Info
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setCustomTab("photo")}
                      className={`px-3.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                        customTab === "photo"
                          ? "bg-[#ffe600] text-[#042616] shadow-md"
                          : "text-emerald-300/70 hover:text-white"
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" /> Photo Options
                    </button>
                  </div>
                </div>

                {/* Inline Tab Content */}
                {customTab === "details" ? (
                  mode === "pfp-frame" ? (
                    <PfpFrameControls frame={frame} onChange={updateFrame} />
                  ) : (
                    <BuilderCardControls
                      card={card}
                      onCardChange={(u) => {
                        setValidationError(null);
                        updateCard(u);
                      }}
                      validationError={validationError}
                    />
                  )
                ) : (
                  <PhotoControls photo={photo} onChange={updatePhoto} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Simple Minimalist Footer ────────────────────────── */}
      <footer className="text-center py-6 px-4 font-mono text-[12px] text-emerald-300/80 uppercase tracking-widest select-none">
        <span className="text-[#ff007f] font-black">#FrameInGoa</span> ·{" "}
        <a
          href="https://hhgoa.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline transition-colors"
        >
          hhgoa.com
        </a>
      </footer>

    </div>
  );
}




