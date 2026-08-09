"use client";

import { useEffect, useRef, useCallback } from "react";
import type { PhotoState, FrameSettings, CardData, CardTemplateId, AppMode } from "@/types";
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

  useEffect(() => {
    if (!photo.src) { imgRef.current = null; return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { imgRef.current = img; render(); };
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

  useEffect(() => { render(); }, [render]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    onPhotoOffsetChange(photo.offsetX + dx, photo.offsetY + dy);
  }, [photo.offsetX, photo.offsetY, onPhotoOffsetChange]);

  const handlePointerUp = useCallback(() => { isDragging.current = false; }, []);

  const isPfp = mode === "pfp-frame";

  return (
    <div className="relative flex items-center justify-center animate-scale-in">
      <canvas
        ref={canvasRef}
        className={`relative ${
          isPfp ? "w-full max-w-[360px] aspect-square" : "w-full max-w-[300px]"
        } rounded-lg cursor-grab active:cursor-grabbing`}
        style={{ aspectRatio: isPfp ? "1/1" : "440/580" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      {photo.src && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-neutral-600 font-mono bg-black/50 px-2 py-0.5 rounded">
          drag to reposition
        </div>
      )}
    </div>
  );
}
