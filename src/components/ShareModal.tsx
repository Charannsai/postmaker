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
    "I am coming to HH GOA 2026. Everything intentional. Shipping in Goa. #FrameInGoa #HHGoa2026",
  "builder-card":
    "My official Hacker House Goa 2026 builder pass is ready. See you on the shore builders. #FrameInGoa #HHGoa2026",
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
        className="surface w-full max-w-sm p-6 space-y-4 animate-scale-in bg-[#faf8f3] border-2 border-[#e6dfd2] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e6dfd2] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-serif font-black text-[#171717]">
              Share to 𝕏
            </span>
            <span className="text-[10px] font-mono bg-[#171717] text-[#ffffff] px-2 py-0.5 rounded-full font-bold">
              #FrameInGoa
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#171717] transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1 */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#ffffff] border border-[#e6dfd2]">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#171717] text-[#ffffff] flex items-center justify-center text-[11px] font-bold">
            1
          </span>
          <div className="space-y-1.5">
            <p className="text-[12.5px] font-bold text-[#171717]">
              Copy high-res image
            </p>
            <button
              onClick={handleCopyImage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f2eb] text-[#171717] text-[11px] font-bold hover:bg-[#e6dfd2] transition-all border border-[#d7d0c2] shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#15803d]" />
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
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#ffffff] border border-[#e6dfd2]">
          <span className="shrink-0 w-6 h-6 rounded-full bg-[#fed7aa] text-[#7c2d12] flex items-center justify-center text-[11px] font-bold border border-[#fdba74]">
            2
          </span>
          <div>
            <p className="text-[12.5px] font-bold text-[#171717]">
              Paste in 𝕏 Tweet Composer
            </p>
            <p className="text-[11px] text-[#737373] mt-0.5">
              Paste your copied image directly into your tweet.
            </p>
          </div>
        </div>

        {/* Caption */}
        <div className="p-3 rounded-xl bg-[#ffffff] border border-[#e6dfd2]">
          <p className="text-[10px] text-[#b45309] font-mono mb-1 font-bold">
            PRE-FILLED TWEET CAPTION
          </p>
          <p className="text-[11.5px] text-[#525252] italic">{caption}</p>
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
