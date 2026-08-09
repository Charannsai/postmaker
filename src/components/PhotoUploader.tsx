"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, ImagePlus } from "lucide-react";
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
          <Loader2 className="w-5 h-5 text-[#171717] animate-spin" />
        ) : photoSrc ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#e6dfd2] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] text-[#525252] font-semibold">
              Click to replace photo
            </span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#f5f2eb] border border-[#e6dfd2] flex items-center justify-center text-[#525252]">
              <ImagePlus className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-[#171717]">
                Click or Drop photo here
              </p>
              <p className="text-[10px] text-[#737373] mt-0.5 font-mono">
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
    </div>
  );
}
