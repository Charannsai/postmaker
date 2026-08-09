"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { isHeicFile, convertHeicToBlob } from "@/lib/heicConverter";

interface PhotoUploaderProps {
  photoSrc: string | null;
  onPhotoChange: (src: string) => void;
}

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
      ["#333", "#111"],
      ["#444", "#1a1a1a"],
      ["#555", "#222"],
    ];
    const [c1, c2] = grads[index];
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    ctx.font = "bold 100px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(["A", "B", "C"][index], 256, 256);
    canvas.toBlob((blob) => {
      if (blob) onPhotoChange(URL.createObjectURL(blob));
    });
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
        Photo
      </label>

      <div
        className={`dropzone flex flex-col items-center justify-center gap-2.5 p-5 min-h-[100px] ${
          dragOver ? "drag-over" : ""
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />
        ) : photoSrc ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#222]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc} alt="Uploaded" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] text-neutral-600">Click to replace</span>
          </div>
        ) : (
          <>
            <Upload className="w-5 h-5 text-neutral-600" />
            <div className="text-center">
              <p className="text-[13px] text-neutral-400">Drop photo here</p>
              <p className="text-[11px] text-neutral-600 mt-0.5">PNG, JPG, WebP, HEIC</p>
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

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-neutral-600 font-mono">Samples</span>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => handleSample(i)}
            className="w-7 h-7 rounded-md bg-[#1a1a1a] border border-[#222] hover:border-[#333] transition-colors"
            title={`Sample ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
