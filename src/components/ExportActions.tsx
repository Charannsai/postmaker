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
          ? "hh-goa-2026-pfp.png"
          : "hh-goa-2026-builder-id.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 🎉 Celebration confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f2fe", "#f857a6", "#ff6b35", "#43e97b", "#a78bfa"],
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
    } catch (err) {
      console.error("Failed to copy image:", err);
      // Fallback: try data URL copy
      try {
        const dataUrl = canvas.toDataURL("image/png");
        await navigator.clipboard.writeText(dataUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert("Unable to copy to clipboard. Try downloading instead.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 animate-fade-in" style={{ animationDelay: "0.15s" }}>
      {/* Download */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn-primary flex items-center justify-center gap-2 w-full text-sm"
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {downloading ? "Exporting…" : "Download PNG"}
      </button>

      <div className="flex gap-2">
        {/* Copy to clipboard */}
        <button
          onClick={handleCopy}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-neon-green">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Image
            </>
          )}
        </button>

        {/* Share to X */}
        <button
          onClick={onShareClick}
          className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold rounded-xl py-2.5 px-4 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white transition-all border border-white/5 hover:border-white/10"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share to 𝕏
        </button>
      </div>
    </div>
  );
}
