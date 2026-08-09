"use client";

import { useState } from "react";
import { Download, Copy, Share2, Check, Loader2, Sparkles } from "lucide-react";
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
          ? "hh-goa-2026-pfp.png"
          : "hh-goa-2026-builder-pass.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#facc15", "#ec4899", "#10b981", "#fefce8", "#fde047"],
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
    <div className="flex flex-col gap-2.5 w-full animate-fade-in">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn-primary flex items-center justify-center gap-2 w-full !py-3 text-[14px]"
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {downloading ? "Exporting HD PNG…" : "Download HD PNG (2x)"}
      </button>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="btn-ghost flex-1 flex items-center justify-center gap-2 text-[12px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#facc15]" />
              <span className="text-[#facc15]">Copied to Clipboard!</span>
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
          className="btn-pink flex-1 flex items-center justify-center gap-2 text-[12px]"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share to X (#FrameInGoa)
        </button>
      </div>
    </div>
  );
}
