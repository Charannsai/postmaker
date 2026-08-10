"use client";

import { useState } from "react";
import { Download, Copy, Share2, Check, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { canvasToBlob } from "@/lib/canvasRenderer";
import type { AppMode } from "@/types";

interface ExportActionsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  mode: AppMode;
  onShareClick: () => void;
}

export default function ExportActions({
  canvasRef,
  mode,
  onShareClick,
}: ExportActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      const blob = await canvasToBlob(canvas);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        mode === "pfp-frame"
          ? "hh-goa-2026-poster.png"
          : "hh-goa-2026-builder-pass.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#171717", "#d97706", "#fde047", "#0d4a2b", "#fed7aa"],
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await canvasToBlob(canvas);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy to clipboard. Try downloading instead.");
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full animate-fade-in">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn-yellow flex items-center justify-center gap-2.5 w-full !py-3.5 !text-[13px] uppercase tracking-wider"
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#042616]" />
        ) : (
          <Download className="w-4 h-4 text-[#042616]" />
        )}
        {downloading ? "Exporting High-Res PNG…" : "Download High-Res PNG (2x)"}
      </button>

      <div className="flex gap-2.5">
        <button
          onClick={handleCopy}
          className="btn-dark-pill flex-1 flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#ffe600]" />
              <span className="text-[#ffe600] font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Image
            </>
          )}
        </button>
        <button
          onClick={onShareClick}
          className="btn-pink flex-1 flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share on 𝕏
        </button>
      </div>
    </div>
  );
}

