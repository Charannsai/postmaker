"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImagePlus, Loader2 } from "lucide-react";
import { isHeicFile, convertHeicToBlob } from "@/lib/heicConverter";

interface PhotoUploaderProps {
  photoSrc: string | null;
  onPhotoChange: (src: string) => void;
}

const SAMPLE_COLORS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
];

export default function PhotoUploader({
  photoSrc,
  onPhotoChange,
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
        onPhotoChange(url);
      } catch (err) {
        console.error("Error processing image:", err);
      } finally {
        setLoading(false);
      }
    },
    [onPhotoChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/") || (file && isHeicFile(file))) {
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

  // Generate a simple gradient avatar as sample
  const handleSample = (index: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    // Draw gradient
    const colors = [
      ["#667eea", "#764ba2"],
      ["#f093fb", "#f5576c"],
      ["#4facfe", "#00f2fe"],
    ];
    const [c1, c2] = colors[index];
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    // Add initials
    ctx.font = "bold 120px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = ["AB", "XY", "HH"];
    ctx.fillText(initials[index], 256, 256);
    canvas.toBlob((blob) => {
      if (blob) onPhotoChange(URL.createObjectURL(blob));
    });
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
        <ImagePlus className="w-3.5 h-3.5" />
        Photo
      </label>

      {/* Dropzone */}
      <div
        className={`dropzone flex flex-col items-center justify-center gap-3 p-6 min-h-[120px] ${
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
          <Loader2 className="w-6 h-6 text-neon-cyan animate-spin" />
        ) : photoSrc ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-white/40">
              Click or drop to replace
            </span>
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-white/20" />
            <div className="text-center">
              <p className="text-sm text-white/50 font-medium">
                Drop your photo here
              </p>
              <p className="text-xs text-white/25 mt-0.5">
                PNG, JPG, WebP, HEIC supported
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

      {/* Quick samples */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/30 font-mono">SAMPLES:</span>
        {SAMPLE_COLORS.map((bg, i) => (
          <button
            key={i}
            onClick={() => handleSample(i)}
            className="w-8 h-8 rounded-lg transition-transform hover:scale-110 border border-white/10"
            style={{ background: bg }}
            title={`Sample avatar ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
