"use client";

import { X as XIcon, Copy, ExternalLink, Check } from "lucide-react";
import { useState } from "react";
import { canvasToBlob } from "@/lib/canvasRenderer";
import type { AppMode } from "@/types";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  mode: AppMode;
  userName?: string;
}

export default function ShareModal({ open, onClose, canvasRef, mode, userName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const siteUrl =
    typeof window !== "undefined" && window.location.origin && !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://hhgoa-id-maker.vercel.app/";

  const userDisplayName = userName?.trim() || "";
  const nameLine = userDisplayName ? `\n\n${userDisplayName}` : "";

  const caption = `Built my Hacker Goa House Builder Card!${nameLine}\n\nExcited to build, ship, and connect with amazing builders in Goa.\n\nCreate your own Builder Card:\n${siteUrl}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await canvasToBlob(canvas);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Unable to copy image. Try downloading instead.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm p-6 space-y-4 bg-[#042616] border border-[#166940] rounded-2xl shadow-2xl text-emerald-100"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scale-in 0.2s ease" }}
      >
        <div className="flex items-center justify-between border-b border-[#166940] pb-3">
          <span className="text-base font-serif font-black text-[#ffe600]">Share to 𝕏</span>
          <button onClick={onClose} className="text-emerald-300/70 hover:text-white transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#031c10] border border-[#166940]">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#ffe600] text-[#042616] flex items-center justify-center text-[11px] font-bold">1</span>
          <div className="space-y-1.5">
            <p className="text-[12.5px] font-bold text-white font-mono">Copy high-res image</p>
            <button
              onClick={handleCopyImage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#166940] text-[#ffe600] text-[11px] font-mono font-bold hover:bg-[#1e8854] transition-all border border-[#166940] shadow-sm"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 text-[#ffe600]" />Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" />Copy Image to Clipboard</>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#031c10] border border-[#166940]">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#ff007f] text-white flex items-center justify-center text-[11px] font-bold">2</span>
          <div>
            <p className="text-[12.5px] font-bold text-white font-mono">Paste in 𝕏 Composer</p>
            <p className="text-[11px] text-emerald-300/70 mt-0.5 font-mono">Paste image directly into your tweet.</p>
          </div>
        </div>

        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pink flex items-center justify-center gap-2 w-full !py-3 text-[13px]"
        >
          <ExternalLink className="w-4 h-4" />
          Open 𝕏 and Post
        </a>
      </div>
    </div>
  );
}

