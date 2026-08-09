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
    "I am coming to HH GOA 2026! 🌴🚀 Everything intentional. Ready to ship by the beach. #FrameInGoa",
  "builder-card":
    "My official Hacker House Goa 2026 builder pass is ready! 🏖️💻 See you there hackers! #FrameInGoa",
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
      alert("Unable to copy image. Try downloading instead.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-sm p-6 space-y-4 animate-scale-in bg-[#0a3820] border-2 border-[#facc15]/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#facc15]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-serif font-bold text-[#fde047]">
              Share to 𝕏
            </span>
            <span className="text-[10px] font-mono bg-[#ec4899] text-white px-2 py-0.5 rounded-full font-bold">
              #FrameInGoa
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#fefce8]/60 hover:text-[#fde047] transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#072e1a] border border-[#facc15]/20">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#facc15] text-[#072e1a] flex items-center justify-center text-[11px] font-bold">
            1
          </span>
          <div className="space-y-1.5">
            <p className="text-[12.5px] font-bold text-[#fefce8]">
              Copy high-res image
            </p>
            <button
              onClick={handleCopyImage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d4a2b] text-[#fde047] text-[11px] font-bold hover:bg-[#105c36] transition-all border border-[#facc15]/30 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#facc15]" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Image to Clipboard
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#072e1a] border border-[#facc15]/20">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#ec4899] text-white flex items-center justify-center text-[11px] font-bold">
            2
          </span>
          <div>
            <p className="text-[12.5px] font-bold text-[#fefce8]">
              Paste in 𝕏 Tweet Composer
            </p>
            <p className="text-[11px] text-[#fefce8]/60 mt-0.5">
              Paste your copied image directly into your post.
            </p>
          </div>
        </div>

        {/* Caption */}
        <div className="p-3 rounded-xl bg-[#052012] border border-[#facc15]/15">
          <p className="text-[10px] text-[#facc15] font-mono mb-1 font-bold">
            PRE-FILLED TWEET CAPTION
          </p>
          <p className="text-[11.5px] text-[#fefce8]/80 italic">{caption}</p>
        </div>

        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center justify-center gap-2 w-full !py-2.5 text-[13px]"
        >
          <ExternalLink className="w-4 h-4" />
          Open 𝕏 & Post
        </a>
      </div>
    </div>
  );
}
