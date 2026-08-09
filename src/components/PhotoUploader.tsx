"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader2, ImagePlus } from "lucide-react";
import { isHeicFile, convertHeicToBlob } from "@/lib/heicConverter";

interface PhotoUploaderProps {
  photoSrc: string | null;
  onPhotoLoaded: (src: string) => void;
}

export default function PhotoUploader({
  photoSrc,
  onPhotoLoaded,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        let blob: Blob = file;
        if (isHeicFile(file)) {
          blob = await convertHeicToBlob(file);
        }
        const url = URL.createObjectURL(blob);
        onPhotoLoaded(url);
      } catch (err) {
        console.error("Error processing image:", err);
      } finally {
        setLoading(false);
      }
    },
    [onPhotoLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && (file.type.startsWith("image/") || isHeicFile(file))) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSample = (index: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const grads = [
      ["#0d4a2b", "#facc15"],
      ["#1f2937", "#111827"],
      ["#78350f", "#f59e0b"],
    ];
    const [c1, c2] = grads[index];
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    ctx.font = "bold 120px sans-serif";
    ctx.fillStyle = "rgba(254,252,232,0.85)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(["A", "B", "C"][index], 256, 256);
    canvas.toBlob((blob) => {
      if (blob) onPhotoLoaded(URL.createObjectURL(blob));
    });
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div
        className={`dropzone flex flex-col items-center justify-center gap-2.5 p-5 min-h-[110px] ${
          dragOver ? "drag-over" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 text-[#facc15] animate-spin" />
        ) : photoSrc ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#facc15]/40 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] text-[#fde047] font-semibold">
              Click to replace photo
            </span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#0d4a2b] border border-[#facc15]/30 flex items-center justify-center text-[#facc15]">
              <ImagePlus className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-[#fefce8]">
                Click or Drop photo here
              </p>
              <p className="text-[10px] text-[#fefce8]/60 mt-0.5 font-mono">
                PNG, JPG, WebP, iPhone HEIC
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] text-[#fefce8]/60 font-mono">
          Sample Avatars:
        </span>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => handleSample(i)}
            className="w-8 h-8 rounded-lg bg-[#0d4a2b] border border-[#facc15]/30 hover:border-[#facc15] transition-all flex items-center justify-center text-xs font-bold text-[#fde047] shadow-sm"
            title={`Sample ${["A", "B", "C"][i]}`}
          >
            {["A", "B", "C"][i]}
          </button>
        ))}
      </div>
    </div>
  );
}
