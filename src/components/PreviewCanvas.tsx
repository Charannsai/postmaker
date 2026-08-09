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
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Load image when photo.src changes
  useEffect(() => {
    if (!photo.src) {
      imgRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      // Trigger re-render
      render();
    };
    img.src = photo.src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.src]);

  // Render on any state change
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

  // ── Drag-to-pan handlers ────────────────────────────────
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

  // Scroll to zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.max(0.5, Math.min(3, photo.zoom + delta));
      onPhotoOffsetChange(photo.offsetX, photo.offsetY);
      // We need to also update zoom, but we only have offsetChange callback
      // The parent page handles this via the zoom control
    },
    [photo, onPhotoOffsetChange]
  );

  const isPfp = mode === "pfp-frame";

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center animate-scale-in"
    >
      {/* Ambient glow behind canvas */}
      <div
        className="absolute inset-0 rounded-2xl opacity-30 blur-3xl pointer-events-none"
        style={{
          background: isPfp
            ? "radial-gradient(circle, rgba(0,242,254,0.15), rgba(248,87,166,0.1), transparent)"
            : "radial-gradient(circle, rgba(167,139,250,0.15), rgba(0,242,254,0.1), transparent)",
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`relative z-10 ${
          isPfp ? "w-full max-w-[380px] aspect-square" : "w-full max-w-[320px]"
        } rounded-xl cursor-grab active:cursor-grabbing shadow-2xl`}
        style={{
          aspectRatio: isPfp ? "1/1" : "440/580",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Drag hint */}
      {photo.src && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-[10px] text-white/20 font-mono bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
          drag to reposition
        </div>
      )}
    </div>
  );
}
