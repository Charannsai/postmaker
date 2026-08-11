"use client";

import { useState } from "react";
import { Download, Copy, ExternalLink, Check, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { canvasToBlob } from "@/lib/canvasRenderer";
import type { AppMode } from "@/types";

interface ExportActionsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  mode: AppMode;
  userName?: string;
  onValidationError?: (msg: string) => void;
}

export default function ExportActions({
  canvasRef,
  mode,
  userName,
  onValidationError,
}: ExportActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateInputs = (): boolean => {
    if (mode === "builder-card" && !userName?.trim()) {
      onValidationError?.("Please enter your Full Name before exporting or sharing!");
      return false;
    }
    return true;
  };

  const handleDownload = async () => {
    if (!validateInputs()) return;
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

  const handleShareToX = async () => {
    if (!validateInputs()) return;
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const blob = await canvasToBlob(canvas);
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      } catch {
        // Continue even if clipboard write fails
      }
    }

    const siteUrl =
      typeof window !== "undefined" &&
      window.location.origin &&
      !window.location.origin.includes("localhost")
        ? window.location.origin
        : "https://hhgoa-id-maker.vercel.app/";

    const userDisplayName = userName?.trim() || "";
    const nameLine = userDisplayName ? `\n\n${userDisplayName}` : "";

    const caption = `Built my Hacker House Goa Builder Card! 🏝️🚀${nameLine}\n\nExcited to build, ship, and connect with amazing builders in Goa! ⚡🌴\n\nCreate your own Builder Card 👇\n${siteUrl}\n\n#FrameInGoa #HHGoa2026`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;

    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 w-full animate-fade-in">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn-yellow flex items-center justify-center gap-2.5 w-full !py-3 sm:!py-3.5 !text-[12px] sm:!text-[13px] uppercase tracking-wider"
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#042616]" />
        ) : (
          <Download className="w-4 h-4 text-[#042616]" />
        )}
        {downloading ? "Exporting High-Res PNG…" : "Download High-Res PNG (2x)"}
      </button>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
        <button
          onClick={handleCopy}
          className="btn-dark-pill flex-1 flex items-center justify-center gap-2 text-[11px] py-2.5 uppercase tracking-wider"
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
          onClick={handleShareToX}
          className="btn-pink flex-1 flex items-center justify-center gap-2 text-[11px] py-2.5 uppercase tracking-wider"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Share on 𝕏
        </button>
      </div>
    </div>
  );
}

