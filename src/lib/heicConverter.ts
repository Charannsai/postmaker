/* ──────────────────────────────────────────────────────────────
   HEIC → Blob Converter (client-side, lazy-loaded)
   Uses dynamic import so the 180 KB heic2any lib only loads
   when a .heic / .heif file is actually selected.
   ────────────────────────────────────────────────────────────── */

export async function convertHeicToBlob(file: File): Promise<Blob> {
  // Dynamically import heic2any only when needed
  const heic2any = (await import("heic2any")).default;
  const blob = await heic2any({ blob: file, toType: "image/png", quality: 0.92 });
  // heic2any may return an array of blobs for multi-frame HEIC
  if (Array.isArray(blob)) return blob[0];
  return blob;
}

export function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
}
