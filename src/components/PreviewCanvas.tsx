"use client";

import { useEffect, useRef, useCallback } from "react";
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
}

export default function PreviewCanvas({
  mode,
  photo,
  frame,
  card,
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
  let aspectRatioStyle = "4 / 5";
  let maxWStyle = "max-w-[420px]";

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
    maxWStyle = "max-w-[640px]";
  }


  return (
    <div className="relative flex flex-col items-center justify-center w-full animate-scale-in">
      <div className="relative w-full flex items-center justify-center p-2 sm:p-4 rounded-2xl bg-[#031f12]/80 border border-[#166940] shadow-inner">
        <canvas
          ref={canvasRef}
          className={`relative w-full ${maxWStyle} rounded-xl shadow-2xl cursor-grab active:cursor-grabbing border border-[#166940]`}
          style={{ aspectRatio: aspectRatioStyle }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {photo.src && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#ffe600] font-mono bg-[#042616]/90 px-3 py-1 rounded-full border border-[#166940] backdrop-blur-md pointer-events-none shadow-md uppercase tracking-wider">
            ✦ drag photo to reposition
          </div>
        )}
      </div>
    </div>
  );
}

