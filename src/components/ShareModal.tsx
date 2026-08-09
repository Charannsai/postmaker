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
  "pfp-frame":
    "Just created my official HH Goa 2026 profile frame! 🌴🚀 Ready to build and vibe by the beach. Who else is going?",
  "builder-card":
    "My official Hacker House Goa 2026 builder pass is ready! 🏖️💻 See you at the beach hackathon!",
};

export default function ShareModal({
  open,
  onClose,
  canvasRef,
  mode,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const caption = CAPTIONS[mode];
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    caption
  )}&hashtags=FrameInGoa,HHGoa2026`;

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await canvasToBlob(canvas);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Unable to copy image. Try downloading first.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-md p-6 space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
            Share to 𝕏
          </h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-cyan/15 text-neon-cyan flex items-center justify-center text-xs font-bold">
              1
            </span>
            <div>
              <p className="text-sm text-white/70 font-medium">
                Copy your image to clipboard
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                Click the button below to copy, then paste it in the tweet
                composer.
              </p>
              <button
                onClick={handleCopyImage}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-cyan/10 text-neon-cyan text-xs font-medium hover:bg-neon-cyan/15 transition-colors border border-neon-cyan/20"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Image Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Image
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="shrink-0 w-6 h-6 rounded-full bg-neon-pink/15 text-neon-pink flex items-center justify-center text-xs font-bold">
              2
            </span>
            <div>
              <p className="text-sm text-white/70 font-medium">
                Open X and compose your tweet
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                We&apos;ll pre-fill the caption and hashtags for you. Just paste
                your image!
              </p>
            </div>
          </div>
        </div>

        {/* Caption preview */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-xs text-white/30 mb-1 font-mono">CAPTION:</p>
          <p className="text-sm text-white/60 italic">{caption}</p>
          <p className="text-xs text-neon-cyan/50 mt-1 font-mono">
            #FrameInGoa #HHGoa2026
          </p>
        </div>

        {/* Open X button */}
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center justify-center gap-2 w-full text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Open 𝕏 to Post
        </a>
      </div>
    </div>
  );
}
