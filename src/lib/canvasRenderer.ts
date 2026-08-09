/* ──────────────────────────────────────────────────────────────
   Aesthetic Canvas Engine – HH Goa 2026 Paper Studio
   Two Mastercrafted Flagship Designs:
   1. PFP Frame: Editorial Paper Scrapbook Poster
   2. Builder ID: Disney-Style Lanyard Conference Badge on Lined Notebook
   ────────────────────────────────────────────────────────────── */

import type {
  PhotoState,
  FrameSettings,
  CardData,
  BackgroundStyleId,
  StickerType,
  CaptionStyleId,
} from "@/types";
import { getFilterCss } from "./templates";

// ── Utility helpers ──────────────────────────────────────────
function drawSquircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawDoubleShadowCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor: string,
  scale: number
) {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 12 * scale;
  drawSquircle(ctx, x, y, w, h, r);
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetY = 2 * scale;
  drawSquircle(ctx, x, y, w, h, r);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.restore();
}

// ── Background Renderers ─────────────────────────────────────
export function drawCanvasBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  styleId: BackgroundStyleId,
  scale: number
) {
  ctx.save();
  if (styleId === "notebook-lined") {
    // Notebook Paper with Blue Lined Rules
    ctx.fillStyle = "#fcfbfa";
    ctx.fillRect(0, 0, w, h);

    // Blue horizontal notebook lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
    ctx.lineWidth = 1 * scale;
    const step = 26 * scale;
    for (let y = step * 1.5; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top subtle shadow
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.4, w / 2, h / 2, w * 0.85);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(0, 0, 0, 0.04)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  } else if (styleId === "hh-goa-emerald") {
    ctx.fillStyle = "#0d4a2b";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const rayCount = 20;
    ctx.fillStyle = "rgba(250, 204, 21, 0.04)";
    for (let i = 0; i < rayCount; i++) {
      const a1 = (i * Math.PI) / rayCount;
      const a2 = ((i + 0.45) * Math.PI) / rayCount;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.arc(cx, 0, Math.max(w, h) * 1.3, a1, a2);
      ctx.closePath();
      ctx.fill();
    }
  } else if (styleId === "kraft-paper") {
    ctx.fillStyle = "#d7c4a3";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    for (let i = 0; i < 300; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, (Math.random() * 2 + 1) * scale, (Math.random() * 2 + 1) * scale);
    }
  } else if (styleId === "clean-white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  } else {
    // paper-wrinkled default
    ctx.fillStyle = "#f5f2eb";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3);
    ctx.lineTo(w, h * 0.25);
    ctx.lineTo(w, h * 0.27);
    ctx.lineTo(0, h * 0.32);
    ctx.fill();
  }
  ctx.restore();
}

// ── Photo drawing ────────────────────────────────────────────
function drawUserPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  photo: PhotoState,
  cx: number,
  cy: number,
  targetW: number,
  targetH: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((photo.rotation * Math.PI) / 180);
  ctx.scale(photo.flipH ? -1 : 1, photo.flipV ? -1 : 1);

  const filterCss = getFilterCss(photo.filter);
  if (filterCss !== "none") ctx.filter = filterCss;

  const zoom = Math.max(0.1, photo.zoom);
  const imgAspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
  const targetAspect = targetW / targetH;

  let dw: number, dh: number;
  if (imgAspect > targetAspect) {
    dh = targetH * zoom;
    dw = dh * imgAspect;
  } else {
    dw = targetW * zoom;
    dh = dw / imgAspect;
  }

  ctx.drawImage(
    img,
    -dw / 2 + photo.offsetX * zoom,
    -dh / 2 + photo.offsetY * zoom,
    dw,
    dh
  );
  ctx.filter = "none";
  ctx.restore();
}

// ── Clean Typographic Caption Renderer ───────────────────────
function drawStyledCaption(
  ctx: CanvasRenderingContext2D,
  text: string,
  style: CaptionStyleId,
  cx: number,
  cy: number,
  maxWidth: number,
  scale: number
) {
  ctx.save();
  if (style === "bold-street") {
    ctx.font = `900 ${13 * scale}px 'Impact', sans-serif`;
    const tw = Math.min(ctx.measureText(text.toUpperCase()).width + 24 * scale, maxWidth);
    const th = 26 * scale;
    ctx.fillStyle = "#facc15";
    drawSquircle(ctx, cx - tw / 2, cy - th / 2, tw, th, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#171717";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), cx, cy);
  } else if (style === "typewriter-tape") {
    ctx.rotate(-0.015);
    ctx.font = `600 ${11.5 * scale}px 'Courier New', monospace`;
    const tw = Math.min(ctx.measureText(text).width + 20 * scale, maxWidth);
    const th = 22 * scale;
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(cx - tw / 2, cy - th / 2, tw, th);
    ctx.fillStyle = "#171717";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy);
  } else if (style === "hacker-mono") {
    ctx.font = `bold ${11.5 * scale}px monospace`;
    ctx.fillStyle = "#d97706";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`> ${text.toUpperCase()}`, cx, cy);
  } else {
    ctx.font = `bold italic ${14.5 * scale}px 'Georgia', serif`;
    ctx.fillStyle = "#d97706";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy);
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// 1. FORMAT A: EDITORIAL PAPER SCRAPBOOK POSTER (PFP FRAME)
// ─────────────────────────────────────────────────────────────
export function renderPfpFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  scale: number = 2
) {
  let W = 480 * scale;
  let H = 600 * scale;
  if (frame.aspectRatio === "1:1") {
    W = 512 * scale;
    H = 512 * scale;
  } else if (frame.aspectRatio === "9:16") {
    W = 450 * scale;
    H = 800 * scale;
  }

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  drawCanvasBackground(ctx, W, H, frame.bgStyle || "paper-wrinkled", scale);

  // 1. Top Header Bar
  ctx.fillStyle = "#171717";
  ctx.font = `600 ${9.5 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("Hacker House Goa 2026", 28 * scale, 30 * scale);

  ctx.textAlign = "right";
  ctx.fillText("08.13.2026", W - 28 * scale, 30 * scale);

  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(28 * scale, 38 * scale);
  ctx.lineTo(W - 28 * scale, 38 * scale);
  ctx.stroke();

  // 2. Bold Top Title & Kraft Highlight Badge
  ctx.fillStyle = "#171717";
  ctx.font = `900 ${28 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("BUILDER", 28 * scale, 72 * scale);
  ctx.fillText("PORTFOLIO", 28 * scale, 100 * scale);

  const nameText = "Alex Rivera";
  ctx.font = `bold ${12 * scale}px sans-serif`;
  const nW = ctx.measureText(nameText).width + 16 * scale;
  const nH = 22 * scale;
  ctx.fillStyle = "#fed7aa";
  ctx.fillRect(28 * scale, 110 * scale, nW, nH);
  ctx.fillStyle = "#7c2d12";
  ctx.textBaseline = "middle";
  ctx.fillText(nameText, 36 * scale, 110 * scale + nH / 2);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#525252";
  ctx.font = `500 ${8 * scale}px sans-serif`;
  ctx.fillText("Everything Intentional · Shipping in Goa", 28 * scale, 144 * scale);

  // 3. Right Side: Spiral Notebook Page
  const noteW = 135 * scale;
  const noteH = 170 * scale;
  const noteX = W - noteW - 24 * scale;
  const noteY = 54 * scale;

  ctx.save();
  ctx.translate(noteX, noteY);
  ctx.rotate(0.02);

  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 16 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, noteW, noteH);
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = "rgba(14, 165, 233, 0.2)";
  ctx.lineWidth = 1 * scale;
  for (let ly = 32 * scale; ly < noteH - 10 * scale; ly += 16 * scale) {
    ctx.beginPath();
    ctx.moveTo(18 * scale, ly);
    ctx.lineTo(noteW - 10 * scale, ly);
    ctx.stroke();
  }

  for (let sy = 12 * scale; sy < noteH - 8 * scale; sy += 14 * scale) {
    ctx.fillStyle = "#e5e5e5";
    ctx.beginPath();
    ctx.arc(8 * scale, sy, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#a3a3a3";
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
  }

  ctx.fillStyle = "#171717";
  ctx.font = `900 ${11 * scale}px sans-serif`;
  ctx.fillText("Goa Stack", 26 * scale, 24 * scale);

  const stackItems = [
    { tag: "Re", name: "React", bg: "#0284c7" },
    { tag: "Nx", name: "Next.js", bg: "#171717" },
    { tag: "Ts", name: "TypeScript", bg: "#2563eb" },
    { tag: "So", name: "Solana", bg: "#7c3aed" },
    { tag: "Tw", name: "Tailwind", bg: "#0d9488" },
  ];

  let iy = 44 * scale;
  for (const item of stackItems) {
    ctx.fillStyle = item.bg;
    drawSquircle(ctx, 24 * scale, iy - 8 * scale, 12 * scale, 12 * scale, 2.5 * scale);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${6 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(item.tag, 30 * scale, iy);

    ctx.fillStyle = "#171717";
    ctx.font = `600 ${8 * scale}px sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(item.name, 42 * scale, iy);
    iy += 16 * scale;
  }

  ctx.fillStyle = "rgba(254, 215, 170, 0.85)";
  ctx.fillRect(noteW / 2 - 25 * scale, -8 * scale, 50 * scale, 16 * scale);
  ctx.restore();

  // 4. Center Hero: White Die-Cut Sticker Cutout
  const heroCX = W * 0.48;
  const heroCY = H * 0.54;
  const heroSize = Math.min(W * 0.52, 250 * scale);

  ctx.save();
  ctx.translate(heroCX, heroCY);

  ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = 28 * scale;
  ctx.shadowOffsetY = 14 * scale;
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, -heroSize / 2 - 8 * scale, -heroSize / 2 - 8 * scale, heroSize + 16 * scale, heroSize + 16 * scale, 18 * scale);
  ctx.fill();

  ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetY = 2 * scale;
  drawSquircle(ctx, -heroSize / 2 - 8 * scale, -heroSize / 2 - 8 * scale, heroSize + 16 * scale, heroSize + 16 * scale, 18 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.save();
  drawSquircle(ctx, -heroSize / 2, -heroSize / 2, heroSize, heroSize, 12 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, 0, heroSize, heroSize);
  } else {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-heroSize / 2, -heroSize / 2, heroSize, heroSize);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `bold ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", 0, 0);
  }
  ctx.restore();
  ctx.restore();

  // 5. Bottom Left: Taped Mini Polaroid
  const polW = 110 * scale;
  const polH = 135 * scale;
  const polX = 24 * scale;
  const polY = H - polH - 30 * scale;

  ctx.save();
  ctx.translate(polX + polW / 2, polY + polH / 2);
  ctx.rotate(-0.07);

  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 18 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = "#faf9f5";
  ctx.fillRect(-polW / 2, -polH / 2, polW, polH);
  ctx.shadowColor = "transparent";

  const inMargin = 8 * scale;
  const inW = polW - inMargin * 2;
  const inH = inW;
  ctx.fillStyle = "#171717";
  ctx.fillRect(-inW / 2, -polH / 2 + inMargin, inW, inH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(-inW / 2, -polH / 2 + inMargin, inW, inH);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, -polH / 2 + inMargin + inH / 2, inW, inH);
  }
  ctx.restore();

  ctx.fillStyle = "#d97706";
  ctx.font = `bold italic ${7.5 * scale}px 'Georgia', serif`;
  ctx.textAlign = "center";
  ctx.fillText("See you in Goa", 0, polH / 2 - 10 * scale);

  ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
  ctx.fillRect(-22 * scale, -polH / 2 - 6 * scale, 44 * scale, 14 * scale);
  ctx.restore();

  // 6. Bottom Right: Sticky Note & Doodles
  const stickW = 100 * scale;
  const stickH = 45 * scale;
  const stickX = W - stickW - 28 * scale;
  const stickY = H - stickH - 55 * scale;

  ctx.save();
  ctx.translate(stickX, stickY);
  ctx.rotate(0.04);
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 10 * scale;
  ctx.shadowOffsetY = 4 * scale;
  ctx.fillStyle = "#fef08a";
  ctx.fillRect(0, 0, stickW, stickH);
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#171717";
  ctx.font = `bold ${7.5 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText("CONFIRMED ATTENDEE", stickW / 2, 18 * scale);
  ctx.font = `600 ${6.5 * scale}px monospace`;
  ctx.fillStyle = "#854d0e";
  ctx.fillText("HH GOA · AUG 2026", stickW / 2, 32 * scale);
  ctx.restore();

  // Doodles
  ctx.save();
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 1.5 * scale;

  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.fillStyle = "#171717";
  ctx.fillText("✦", W - 40 * scale, 40 * scale);
  ctx.fillText("★", 28 * scale, H * 0.42);

  const botCaption = frame.caption || "I AM COMING TO HH GOA '26 · ARE YOU?";
  drawStyledCaption(ctx, botCaption, frame.captionStyle || "bold-street", W / 2, H - 20 * scale, W - 40 * scale, scale);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// 2. FORMAT B: THE DISNEY-STYLE LANYARD BADGE (BUILDER ID)
// ─────────────────────────────────────────────────────────────
export function renderBuilderCard(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  scale: number = 2
) {
  const W = 520 * scale;
  const H = 640 * scale;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // Background: Lined notebook paper
  drawCanvasBackground(ctx, W, H, card.bgStyle || "notebook-lined", scale);

  // 1. Top Right Illustrated Goa Villa / Castle Silhouette (In Soft Blue Ink)
  ctx.save();
  ctx.fillStyle = "rgba(37, 99, 235, 0.18)";
  const castleX = W - 140 * scale;
  const castleY = 32 * scale;
  // Castle base & towers
  ctx.fillRect(castleX + 15 * scale, castleY + 25 * scale, 90 * scale, 35 * scale);
  ctx.fillRect(castleX + 25 * scale, castleY + 10 * scale, 20 * scale, 25 * scale);
  ctx.fillRect(castleX + 75 * scale, castleY + 10 * scale, 20 * scale, 25 * scale);
  ctx.fillRect(castleX + 45 * scale, castleY, 30 * scale, 35 * scale);
  // Turret triangles
  ctx.beginPath();
  ctx.moveTo(castleX + 60 * scale, castleY - 14 * scale);
  ctx.lineTo(castleX + 42 * scale, castleY);
  ctx.lineTo(castleX + 78 * scale, castleY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Handwritten Ink Annotation with Line Arrow
  ctx.save();
  ctx.fillStyle = "#1e40af"; // Blue ink
  ctx.font = `bold italic ${11 * scale}px 'Georgia', serif`;
  ctx.textAlign = "left";
  ctx.fillText("TREMBLING W/ EXCITEMENT & NERVES", 85 * scale, 55 * scale);

  // Hand-drawn arrow pointing to badge
  ctx.strokeStyle = "#1e40af";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(80 * scale, 50 * scale);
  ctx.quadraticCurveTo(55 * scale, 75 * scale, 65 * scale, 120 * scale);
  ctx.stroke();
  // Arrow head
  ctx.beginPath();
  ctx.moveTo(60 * scale, 110 * scale);
  ctx.lineTo(65 * scale, 120 * scale);
  ctx.lineTo(72 * scale, 112 * scale);
  ctx.stroke();
  ctx.restore();

  // 3. Top Woven Fabric Lanyard Strap (Drawn over top)
  const badgeCX = W / 2 + 10 * scale;
  const badgeCY = H / 2 + 35 * scale;
  const badgeW = 410 * scale;
  const badgeH = 340 * scale;

  ctx.save();
  // Left lanyard band
  ctx.fillStyle = "#171717";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(70 * scale, 0);
  ctx.lineTo(badgeCX - 15 * scale, 130 * scale);
  ctx.lineTo(badgeCX - 35 * scale, 130 * scale);
  ctx.closePath();
  ctx.fill();

  // Right lanyard band
  ctx.beginPath();
  ctx.moveTo(badgeCX - 10 * scale, 130 * scale);
  ctx.lineTo(badgeCX + 10 * scale, 130 * scale);
  ctx.lineTo(240 * scale, 0);
  ctx.lineTo(190 * scale, 0);
  ctx.closePath();
  ctx.fill();

  // Lanyard repeated typography: "HH GOA 2026 // BUILD & SHIP"
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.save();
  ctx.translate(30 * scale, 45 * scale);
  ctx.rotate(0.9);
  ctx.fillText("HH GOA 2026 // SHIPS", 0, 0);
  ctx.restore();

  // Metallic Lanyard Clasp
  ctx.fillStyle = "#94a3b8"; // Silver metal clip
  ctx.fillRect(badgeCX - 12 * scale, 115 * scale, 24 * scale, 28 * scale);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(badgeCX - 12 * scale, 115 * scale, 24 * scale, 28 * scale);

  ctx.beginPath();
  ctx.arc(badgeCX, 148 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. The Badge in Transparent Holder Sleeve (Tilted Slightly)
  ctx.save();
  ctx.translate(badgeCX, badgeCY);
  ctx.rotate(-0.025);

  const bx = -badgeW / 2;
  const by = -badgeH / 2;

  // Transparent Holder Sleeve Outer Frame (With Drop Shadow)
  ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 12 * scale;

  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, bx - 14 * scale, by - 36 * scale, badgeW + 28 * scale, badgeH + 48 * scale, 20 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Transparent sleeve border
  ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, bx - 14 * scale, by - 36 * scale, badgeW + 28 * scale, badgeH + 48 * scale, 20 * scale);
  ctx.stroke();

  // Top punch-hole slot in sleeve
  ctx.fillStyle = "#e2e8f0";
  drawSquircle(ctx, -28 * scale, by - 24 * scale, 56 * scale, 10 * scale, 5 * scale);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, -28 * scale, by - 24 * scale, 56 * scale, 10 * scale, 5 * scale);
  ctx.stroke();

  // 5. Badge Card Body (Ocean Blue / Goa Emerald)
  const cardColor = "#2563eb"; // Disney-style oceanic royal blue
  ctx.fillStyle = cardColor;
  drawSquircle(ctx, bx, by, badgeW, badgeH, 12 * scale);
  ctx.fill();

  // 6. Left: Portrait Photo Window
  const photoW = 145 * scale;
  const photoH = 180 * scale;
  const photoX = bx + 22 * scale;
  const photoY = by + 30 * scale;

  // Crisp white polaroid photo border
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, photoX - 6 * scale, photoY - 6 * scale, photoW + 12 * scale, photoH + 12 * scale, 10 * scale);
  ctx.fill();

  ctx.save();
  drawSquircle(ctx, photoX, photoY, photoW, photoH, 6 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, photoX + photoW / 2, photoY + photoH / 2, photoW, photoH);
  } else {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", photoX + photoW / 2, photoY + photoH / 2);
  }
  ctx.restore();

  // 7. Right: Event Logo & Attendee Name
  const textX = photoX + photoW + 28 * scale;
  let ty = by + 50 * scale;

  ctx.fillStyle = "#ffffff";
  ctx.font = `italic 500 ${11 * scale}px 'Georgia', serif`;
  ctx.textAlign = "left";
  ctx.fillText("The", textX, ty);

  ty += 22 * scale;
  ctx.font = `900 ${20 * scale}px 'Georgia', serif`;
  ctx.fillText("HACKER HOUSE", textX, ty);

  ty += 14 * scale;
  ctx.font = `bold ${7.5 * scale}px sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText("Company and Affiliated Builders", textX, ty);

  // Big Attendee Name
  ty += 42 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${18 * scale}px sans-serif`;
  const name = card.name ? card.name.toUpperCase() : "ALEX RIVERA";
  ctx.fillText(name, textX, ty);

  // Handle & Role
  ty += 18 * scale;
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@alexbuilds";
  ctx.fillText(`${handle} · ${card.role || "FULLSTACK"}`, textX, ty);

  // Tech stack pills underneath
  ty += 18 * scale;
  const stack = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  let sx = textX;
  for (const t of stack.slice(0, 3)) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    const tw = ctx.measureText(t).width + 10 * scale;
    drawSquircle(ctx, sx, ty - 10 * scale, tw, 14 * scale, 3 * scale);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${7 * scale}px sans-serif`;
    ctx.fillText(t, sx + 5 * scale, ty);
    sx += tw + 4 * scale;
  }

  // 8. DIE-CUT STICKER OVERLAYS:
  // Sticker 1: Wizard Hat placed on photo
  ctx.save();
  ctx.translate(photoX + photoW / 2 + 10 * scale, photoY - 8 * scale);
  ctx.rotate(0.12);
  // Blue conical wizard hat with moon/stars
  ctx.fillStyle = "#ffffff"; // White die-cut border
  ctx.beginPath();
  ctx.moveTo(0, -28 * scale);
  ctx.lineTo(24 * scale, 12 * scale);
  ctx.lineTo(-24 * scale, 12 * scale);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#1d4ed8";
  ctx.beginPath();
  ctx.moveTo(0, -24 * scale);
  ctx.lineTo(20 * scale, 8 * scale);
  ctx.lineTo(-20 * scale, 8 * scale);
  ctx.closePath();
  ctx.fill();

  // White moon on hat
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${10 * scale}px sans-serif`;
  ctx.fillText("☾", -4 * scale, 2 * scale);
  ctx.restore();

  // Sticker 2: 3D Puffy "CHARACTER ART / BUILDER INTERN" Die-Cut Badge (Bottom-Left)
  ctx.save();
  ctx.translate(photoX - 10 * scale, photoY + photoH - 24 * scale);
  ctx.rotate(-0.08);

  const badgeStickerW = 160 * scale;
  const badgeStickerH = 46 * scale;

  // Thick white die-cut border + shadow
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 12 * scale;
  ctx.shadowOffsetY = 6 * scale;
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, 0, 0, badgeStickerW, badgeStickerH, 10 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Gold / Amber sticker body
  ctx.fillStyle = "#f59e0b";
  drawSquircle(ctx, 3 * scale, 3 * scale, badgeStickerW - 6 * scale, badgeStickerH - 6 * scale, 8 * scale);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.fillText("BUILDER", 10 * scale, 20 * scale);
  ctx.fillText("INTERN // FELLOW", 10 * scale, 36 * scale);
  ctx.restore();

  // Sticker 3: Oval Name Badge Pinned at Bottom Right
  ctx.save();
  const ovalW = 135 * scale;
  const ovalH = 60 * scale;
  ctx.translate(bx + badgeW - ovalW + 12 * scale, by + badgeH - ovalH + 16 * scale);

  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 14 * scale;
  ctx.shadowOffsetY = 6 * scale;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(ovalW / 2, ovalH / 2, ovalW / 2, ovalH / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.ellipse(ovalW / 2, ovalH / 2, ovalW / 2, ovalH / 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Star logo inside oval badge
  ctx.fillStyle = "#d97706";
  ctx.font = `bold ${10 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("✦", ovalW / 2, 18 * scale);

  // Big Nickname
  ctx.fillStyle = "#171717";
  ctx.font = `900 ${14 * scale}px sans-serif`;
  const nickname = card.nickname || card.name?.split(" ")[0] || "BUILDER";
  ctx.fillText(nickname.toUpperCase(), ovalW / 2, 38 * scale);

  ctx.restore();

  // Star doodles
  ctx.fillStyle = "#facc15";
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.fillText("✦", textX + 110 * scale, by + 26 * scale);
  ctx.fillText("★", textX + 140 * scale, by + 45 * scale);

  ctx.restore();
}

// ── Export high-res PNG blob ─────────────────────────────────
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png",
      1
    );
  });
}
