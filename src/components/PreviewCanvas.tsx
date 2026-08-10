"use client";

import { useEffect, useRef, useCallback } from "react";
import { Upload, Loader2, X } from "lucide-react";
import type {
  PhotoState,
  FrameSettings,
  CardData,
  AppMode,
} from "@/types";
import { renderPfpFrame, renderBuilderCard } from "@/lib/canvasRenderer";

interface PreviewCanvasProps {
  mode: AppMode;
  photo: PhotoState;
  frame: FrameSettings;
  card: CardData;
  onPhotoOffsetChange: (offsetX: number, offsetY: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onUploadClick?: () => void;
  onRemovePhoto?: () => void;
  uploading?: boolean;
}

export default function PreviewCanvas({
  mode,
  photo,
  frame,
  card,
  onPhotoOffsetChange,
  canvasRef,
  onUploadClick,
  onRemovePhoto,
  uploading = false,
}: PreviewCanvasProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Load image whenever photo.src changes
  useEffect(() => {
    if (!photo.src) {
      imgRef.current = null;
      render();
      return;
    }
    const img = new Image();
    if (photo.src.startsWith("http://") || photo.src.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      imgRef.current = img;
      render();
    };
    img.onerror = (e) => {
      console.error("Failed to load image in canvas preview", e);
    };
    img.src = photo.src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.src]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (mode === "pfp-frame") {
      renderPfpFrame(canvas, imgRef.current, photo, frame, 2);
    } else {
      renderBuilderCard(canvas, imgRef.current, photo, card, 2);
    }
  }, [mode, photo, frame, card, canvasRef]);

  useEffect(() => {
    render();
  }, [render]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!photo.src) return;
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [photo.src]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !photo.src) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onPhotoOffsetChange(photo.offsetX + dx, photo.offsetY + dy);
    },
    [photo.src, photo.offsetX, photo.offsetY, onPhotoOffsetChange]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const isPfp = mode === "pfp-frame";
  let aspectRatioStyle = "4 / 5";
  let maxWStyle = "max-w-[400px]";

  if (isPfp) {
    if (frame.aspectRatio === "1:1") {
      aspectRatioStyle = "1 / 1";
      maxWStyle = "max-w-[440px]";
    } else if (frame.aspectRatio === "9:16") {
      aspectRatioStyle = "9 / 16";
      maxWStyle = "max-w-[360px]";
    } else {
      aspectRatioStyle = "4 / 5";
      maxWStyle = "max-w-[400px]";
    }
  } else {
    aspectRatioStyle = "800 / 418";
    maxWStyle = "max-w-[600px]";
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full animate-scale-in">
      <div className="relative w-full flex items-center justify-center p-2 sm:p-4 rounded-2xl bg-[#031f12]/80 border border-[#166940] shadow-inner">
        {/* Remove Image X Button */}
        {photo.src && onRemovePhoto && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemovePhoto();
            }}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#042616] border border-[#166940] text-emerald-300 hover:text-white hover:bg-[#ff007f] hover:border-[#ff007f] transition-all shadow-xl group"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className={`relative w-full ${maxWStyle} rounded-xl overflow-hidden shadow-2xl border border-[#166940]`}>
          <canvas
            ref={canvasRef}
            className={`w-full ${photo.src ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
            style={{ aspectRatio: aspectRatioStyle }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={() => {
              if (!photo.src && onUploadClick) onUploadClick();
            }}
          />

          {/* Centered UPLOAD A PHOTO overlay inside preview frame when photo is null */}
          {!photo.src && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#042616]/30 backdrop-blur-[2px] cursor-pointer group transition-colors hover:bg-[#042616]/20"
              onClick={onUploadClick}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#ffe600] animate-spin" />
                  <span className="font-mono text-xs text-[#ffe600] uppercase tracking-wider font-bold">
                    Processing Image…
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUploadClick?.();
                    }}
                    className="btn-yellow text-xs sm:text-sm py-3 px-6 sm:px-8 shadow-2xl group-hover:scale-105 transition-transform"
                  >
                    <Upload className="w-4 h-4 text-[#042616]" />
                    UPLOAD A PHOTO
                  </button>
                  <p className="font-mono text-[10px] sm:text-[11px] text-[#ffe600] font-bold uppercase tracking-widest drop-shadow">
                    JPG · PNG · HEIC · WEBP
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {photo.src && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#ffe600] font-mono bg-[#042616]/90 px-3 py-1 rounded-full border border-[#166940] backdrop-blur-md pointer-events-none shadow-md uppercase tracking-wider">
            ✦ drag photo to reposition
          </div>
        )}
      </div>
    </div>
  );
}
