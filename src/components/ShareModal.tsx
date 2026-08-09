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
}

const CAPTIONS = {
  "pfp-frame": "Just created my HH Goa 2026 profile frame! 🌴🚀 Ready to build by the beach.",
  "builder-card": "My Hacker House Goa 2026 builder pass is ready! 🏖️💻 See you there!",
};

export default function ShareModal({ open, onClose, canvasRef, mode }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const caption = CAPTIONS[mode];
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&hashtags=FrameInGoa,HHGoa2026`;

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await canvasToBlob(canvas);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { alert("Unable to copy image."); }
  };

  return (
    <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <div className="surface w-full max-w-sm p-5 space-y-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-neutral-100">Share to 𝕏</h2>
          <button onClick={onClose} className="text-neutral-600 hover:text-neutral-400 transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1 */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#111] border border-[#1a1a1a]">
          <span className="shrink-0 w-5 h-5 rounded-full bg-[#1f1f1f] text-neutral-400 flex items-center justify-center text-[10px] font-bold">1</span>
          <div>
            <p className="text-[13px] text-neutral-300">Copy image to clipboard</p>
            <button onClick={handleCopyImage}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1a1a1a] text-neutral-400 text-[11px] font-medium hover:bg-[#222] hover:text-neutral-300 transition-colors border border-[#262626]">
              {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy Image</>}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#111] border border-[#1a1a1a]">
          <span className="shrink-0 w-5 h-5 rounded-full bg-[#1f1f1f] text-neutral-400 flex items-center justify-center text-[10px] font-bold">2</span>
          <p className="text-[13px] text-neutral-300">Open X and paste your image in the composer</p>
        </div>

        {/* Caption */}
        <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
          <p className="text-[10px] text-neutral-600 font-mono mb-1">CAPTION</p>
          <p className="text-[12px] text-neutral-400 italic">{caption}</p>
          <p className="text-[10px] text-neutral-600 mt-1 font-mono">#FrameInGoa #HHGoa2026</p>
        </div>

        <a href={tweetUrl} target="_blank" rel="noopener noreferrer"
          className="btn-primary flex items-center justify-center gap-2 w-full">
          <ExternalLink className="w-4 h-4" />Open 𝕏
        </a>
      </div>
    </div>
  );
}
