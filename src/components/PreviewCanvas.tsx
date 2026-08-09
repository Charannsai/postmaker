"use client";

import { useEffect, useRef, useCallback } from "react";
import type {
  PhotoState,
  FrameSettings,
  CardData,
  CardTemplateId,
  AppMode,
} from "@/types";
import { renderPfpFrame, renderBuilderCard } from "@/lib/canvasRenderer";

interface PreviewCanvasProps {
  mode: AppMode;
  photo: PhotoState;
  frame: FrameSettings;
  card: CardData;
  cardTemplateId: CardTemplateId;
  onPhotoOffsetChange: (offsetX: number, offsetY: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function PreviewCanvas({
  mode,
  photo,
  frame,
  card,
  cardTemplateId,
  onPhotoOffsetChange,
  canvasRef,
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
    // Only set crossOrigin for remote http/https images, not blob: or data:
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
      renderBuilderCard(canvas, imgRef.current, photo, card, cardTemplateId, 2);
    }
  }, [mode, photo, frame, card, cardTemplateId, canvasRef]);

  useEffect(() => {
    render();
  }, [render]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onPhotoOffsetChange(photo.offsetX + dx, photo.offsetY + dy);
    },
    [photo.offsetX, photo.offsetY, onPhotoOffsetChange]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const isPfp = mode === "pfp-frame";
  let aspectRatioStyle = "1 / 1";
  let maxWStyle = "max-w-[440px] sm:max-w-[480px] lg:max-w-[500px]";

  if (isPfp) {
    if (frame.aspectRatio === "9:16") {
      aspectRatioStyle = "9 / 16";
      maxWStyle = "max-w-[340px] sm:max-w-[380px]";
    } else if (frame.aspectRatio === "4:5") {
      aspectRatioStyle = "4 / 5";
      maxWStyle = "max-w-[380px] sm:max-w-[420px]";
    }
  } else {
    aspectRatioStyle = "440 / 600";
    maxWStyle = "max-w-[360px] sm:max-w-[400px]";
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full animate-scale-in">
      <div className="relative w-full flex items-center justify-center p-3 sm:p-6 rounded-2xl bg-[#111111] border border-[#1f1f1f] shadow-2xl">
        <canvas
          ref={canvasRef}
          className={`relative w-full ${maxWStyle} rounded-xl shadow-2xl cursor-grab active:cursor-grabbing border border-white/5`}
          style={{ aspectRatio: aspectRatioStyle }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {photo.src && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-neutral-400 font-mono bg-black/80 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md pointer-events-none shadow-lg">
            ✦ drag photo to reposition
          </div>
        )}
      </div>
    </div>
  );
}
