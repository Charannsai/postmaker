/* ──────────────────────────────────────────────────────────────
   Aesthetic Canvas Engine – HH Goa 2026 Paper Studio
   Featuring the Editorial Paper Scrapbook Collage (Sticker Cutout,
   Spiral Notebook Stack, Taped Mini Polaroid, & Doodles).
   ────────────────────────────────────────────────────────────── */

import type {
  PhotoState,
  FrameSettings,
  CardData,
  CardTemplateId,
  BackgroundStyleId,
  StickerType,
  CaptionStyleId,
} from "@/types";
import { getFilterCss, CARD_TEMPLATES } from "./templates";

// ── Utility helpers ──────────────────────────────────────────
function hex(c: string, a: number): string {
  if (!c || !c.startsWith("#")) return `rgba(200,200,200,${a})`;
  const r = parseInt(c.slice(1, 3), 16) || 0;
  const g = parseInt(c.slice(3, 5), 16) || 0;
  const b = parseInt(c.slice(5, 7), 16) || 0;
  return `rgba(${r},${g},${b},${a})`;
}

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

// ── Double Overlay Drop Shadow Pass ──────────────────────────
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
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetY = 14 * scale;
  drawSquircle(ctx, x, y, w, h, r);
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 8 * scale;
  ctx.shadowOffsetY = 3 * scale;
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
  if (styleId === "paper-wrinkled" || !styleId) {
    // Realistic Off-White Wrinkled Paper Sheet
    ctx.fillStyle = "#f5f2eb";
    ctx.fillRect(0, 0, w, h);

    // Subtle paper creases & grain
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3);
    ctx.lineTo(w, h * 0.25);
    ctx.lineTo(w, h * 0.27);
    ctx.lineTo(0, h * 0.32);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.lineTo(w, h * 0.7);
    ctx.lineTo(w, h * 0.72);
    ctx.lineTo(0, h * 0.67);
    ctx.fill();

    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.4, w / 2, h / 2, w * 0.8);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(0, 0, 0, 0.06)");
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
  } else if (styleId === "yellow-gingham") {
    ctx.fillStyle = "#fffbeb";
    ctx.fillRect(0, 0, w, h);

    const step = 28 * scale;
    ctx.fillStyle = "rgba(253, 224, 71, 0.4)";
    for (let x = 0; x < w; x += step * 2) {
      ctx.fillRect(x, 0, step, h);
    }
    for (let y = 0; y < h; y += step * 2) {
      ctx.fillRect(0, y, w, step);
    }
    ctx.fillStyle = "rgba(250, 204, 21, 0.5)";
    for (let x = 0; x < w; x += step * 2) {
      for (let y = 0; y < h; y += step * 2) {
        ctx.fillRect(x, y, step, step);
      }
    }
  } else if (styleId === "kraft-paper") {
    ctx.fillStyle = "#d7c4a3";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(
        Math.random() * w,
        Math.random() * h,
        (Math.random() * 2 + 1) * scale,
        (Math.random() * 2 + 1) * scale
      );
    }
  } else if (styleId === "clean-white") {
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(0, 0, w, h);
    const vig = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
    vig.addColorStop(0, "#161616");
    vig.addColorStop(1, "#090909");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
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

// ── Perforated Stamp Edge Path ────────────────────────────────
function drawPerforatedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  toothRadius: number
) {
  const toothD = toothRadius * 2;
  const gap = toothRadius * 1.6;
  const step = toothD + gap;

  ctx.beginPath();
  ctx.moveTo(x, y);
  const numTeethX = Math.floor(w / step);
  const startOffsetX = (w - numTeethX * step) / 2;
  for (let i = 0; i < numTeethX; i++) {
    const tx = x + startOffsetX + i * step + gap / 2;
    ctx.lineTo(tx, y);
    ctx.arc(tx + toothRadius, y, toothRadius, Math.PI, 0, true);
  }
  ctx.lineTo(x + w, y);

  const numTeethY = Math.floor(h / step);
  const startOffsetY = (h - numTeethY * step) / 2;
  for (let i = 0; i < numTeethY; i++) {
    const ty = y + startOffsetY + i * step + gap / 2;
    ctx.lineTo(x + w, ty);
    ctx.arc(x + w, ty + toothRadius, toothRadius, -Math.PI / 2, Math.PI / 2, true);
  }
  ctx.lineTo(x + w, y + h);

  for (let i = numTeethX - 1; i >= 0; i--) {
    const tx = x + startOffsetX + i * step + gap / 2;
    ctx.lineTo(tx + toothD, y + h);
    ctx.arc(tx + toothRadius, y + h, toothRadius, 0, Math.PI, true);
  }
  ctx.lineTo(x, y + h);

  for (let i = numTeethY - 1; i >= 0; i--) {
    const ty = y + startOffsetY + i * step + gap / 2;
    ctx.lineTo(x, ty + toothD);
    ctx.arc(x, ty + toothRadius, toothRadius, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.lineTo(x, y);
  ctx.closePath();
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
    ctx.fillStyle = "#072e1a";
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
  } else if (style === "golden-serif") {
    ctx.font = `bold italic ${14 * scale}px 'Georgia', serif`;
    ctx.fillStyle = "#d97706";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`✦ ${text} ✦`, cx, cy);
  } else {
    ctx.font = `bold italic ${14.5 * scale}px 'Georgia', serif`;
    ctx.fillStyle = "#d97706";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy);
  }
  ctx.restore();
}

// ── Clean Paper Stickers & Motifs (Zero Emojis) ──────────────
export function drawSticker(
  ctx: CanvasRenderingContext2D,
  type: StickerType,
  x: number,
  y: number,
  size: number,
  scale: number
) {
  ctx.save();
  ctx.translate(x, y);

  if (type === "signpost") {
    ctx.fillStyle = "#78350f";
    ctx.fillRect(-2 * scale, -size * 0.45, 4 * scale, size * 0.9);

    ctx.fillStyle = "#fde047";
    ctx.fillRect(-size * 0.38, -size * 0.35, size * 0.68, 11 * scale);
    ctx.fillStyle = "#072e1a";
    ctx.font = `bold ${6 * scale}px sans-serif`;
    ctx.fillText("HACK ➔", -size * 0.08, -size * 0.35 + 8 * scale);

    ctx.fillStyle = "#ec4899";
    ctx.fillRect(-size * 0.32, -size * 0.12, size * 0.68, 11 * scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("⬅ BEACH", -size * 0.04, -size * 0.12 + 8 * scale);

    ctx.fillStyle = "#0d4a2b";
    ctx.fillRect(-size * 0.35, size * 0.1, size * 0.7, 11 * scale);
    ctx.fillStyle = "#facc15";
    ctx.fillText("GOA '26 ➔", -size * 0.04, size * 0.1 + 8 * scale);
  } else if (type === "sun-rising") {
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.38, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1.5 * scale;
    for (let i = 0; i < 7; i++) {
      const angle = Math.PI + (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (size * 0.42), Math.sin(angle) * (size * 0.42));
      ctx.lineTo(Math.cos(angle) * (size * 0.58), Math.sin(angle) * (size * 0.58));
      ctx.stroke();
    }
  } else if (type === "washi-tape") {
    ctx.rotate(-0.06);
    ctx.fillStyle = "rgba(253, 224, 71, 0.85)";
    const tw = size * 1.8;
    const th = size * 0.42;
    ctx.fillRect(-tw / 2, -th / 2, tw, th);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(-tw / 2, -th / 2, tw, 2 * scale);
  } else if (type === "verified") {
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1.5 * scale;
    drawSquircle(ctx, -size * 0.7, -size * 0.22, size * 1.4, size * 0.44, 4 * scale);
    ctx.stroke();
    ctx.fillStyle = "#facc15";
    ctx.font = `bold ${7 * scale}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ VERIFIED BUILDER ✦", 0, 0);
  } else if (type === "hazard-tape") {
    ctx.rotate(0.08);
    const tw = size * 2.2;
    const th = size * 0.38;
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-tw / 2, -th / 2, tw, th);
    ctx.fillStyle = "#072e1a";
    ctx.font = `bold ${7.5 * scale}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("/// HH GOA 2026 ///", 0, 0);
  } else if (type === "ticket-stamp") {
    ctx.rotate(-0.1);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeRect(-size * 0.6, -size * 0.25, size * 1.2, size * 0.5);
    ctx.fillStyle = "#ef4444";
    ctx.font = `bold ${7 * scale}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ADMIT ONE · VIP", 0, 0);
  } else if (type === "postmark") {
    ctx.rotate(0.12);
    ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
    ctx.font = `bold ${6.5 * scale}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HH GOA AIR MAIL", 0, -size * 0.12);
    ctx.fillText("AUG 2026", 0, size * 0.12);
  } else if (type === "barcode") {
    ctx.fillStyle = "#faf9f5";
    const bw = size * 1.4;
    const bh = size * 0.45;
    ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
    ctx.strokeStyle = "#e5e5dc";
    ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);

    ctx.fillStyle = "#171717";
    const bars = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1];
    let bx = -bw / 2 + 6 * scale;
    for (const b of bars) {
      ctx.fillRect(bx, -bh / 2 + 4 * scale, b * scale, bh - 12 * scale);
      bx += (b + 1.5) * scale;
    }
    ctx.font = `600 ${5 * scale}px monospace`;
    ctx.fillText("HH-GOA-2026", 0, bh / 2 - 3 * scale);
  } else if (type === "sparkles") {
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    const r1 = size * 0.35;
    const r2 = size * 0.1;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const radius = i % 2 === 0 ? r1 : r2;
      const sx = Math.cos(angle) * radius;
      const sy = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// FORMAT A: AESTHETIC PFP & PHOTO FRAMES
// ─────────────────────────────────────────────────────────────
export function renderPfpFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  scale: number = 2
) {
  let W = 512 * scale;
  let H = 512 * scale;
  if (frame.aspectRatio === "9:16") {
    W = 450 * scale;
    H = 800 * scale;
  } else if (frame.aspectRatio === "4:5") {
    W = 480 * scale;
    H = 600 * scale;
  }

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  drawCanvasBackground(ctx, W, H, frame.bgStyle, scale);

  const cx = W / 2;
  const cy = H / 2;

  if (frame.templateId === "hh-goa-paper-collage") {
    renderPaperCollage(ctx, img, photo, frame, W, H, scale);
  } else if (frame.templateId === "hh-goa-official") {
    renderHhGoaOfficial(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "hh-goa-signpost") {
    renderHhGoaSignpost(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "festival-wristband") {
    renderFestivalWristband(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "polaroid-tape") {
    renderVintagePolaroid(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "streetwear-poster") {
    renderStreetwearPoster(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "cinema-ticket") {
    renderCinemaTicket(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "postage-stamp") {
    renderPostageStamp(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "music-player") {
    renderRetroMusicPlayer(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "magazine-editorial") {
    renderEditorialMagazine(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "cyber-hud-scanner") {
    renderCyberScanner(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "minimal-gallery") {
    renderMinimalGallery(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else {
    renderCircularPfp(ctx, img, photo, frame, W, H, cx, cy, scale);
  }

  if (frame.stickers && frame.stickers.length > 0) {
    frame.stickers.forEach((st) => {
      if (st === "signpost") {
        drawSticker(ctx, "signpost", 70 * scale, H - 70 * scale, 90 * scale, scale);
      } else if (st === "sun-rising") {
        drawSticker(ctx, "sun-rising", cx, 60 * scale, 70 * scale, scale);
      } else if (st === "verified") {
        drawSticker(ctx, "verified", W - 70 * scale, 60 * scale, 50 * scale, scale);
      } else if (st === "washi-tape") {
        drawSticker(ctx, "washi-tape", cx - 60 * scale, cy - 170 * scale, 70 * scale, scale);
      } else if (st === "postmark") {
        drawSticker(ctx, "postmark", 80 * scale, 80 * scale, 80 * scale, scale);
      } else if (st === "barcode") {
        drawSticker(ctx, "barcode", 80 * scale, H - 50 * scale, 60 * scale, scale);
      } else if (st === "sparkles") {
        drawSticker(ctx, "sparkles", W - 60 * scale, 70 * scale, 36 * scale, scale);
      }
    });
  }
}

// ── FLAGSHIP TEMPLATE: Editorial Paper Scrapbook Collage ──────
// Directly reproduction of the reference image layout:
// Die-cut white sticker cutout, spiral notebook stack, taped polaroid & doodles!
function renderPaperCollage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  scale: number
) {
  ctx.save();

  // 1. Top Header Bar (Category on left, Date on right)
  ctx.fillStyle = "#171717";
  ctx.font = `600 ${9.5 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("Hacker House Goa 2026", 28 * scale, 30 * scale);

  ctx.textAlign = "right";
  ctx.fillText("08.13.2026", w - 28 * scale, 30 * scale);

  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(28 * scale, 38 * scale);
  ctx.lineTo(w - 28 * scale, 38 * scale);
  ctx.stroke();

  // 2. Bold Top Title & Kraft Highlight Badge
  ctx.fillStyle = "#171717";
  ctx.font = `900 ${28 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("BUILDER", 28 * scale, 72 * scale);
  ctx.fillText("PORTFOLIO", 28 * scale, 100 * scale);

  // Kraft Name Highlight Box
  const nameText = "Alex Rivera";
  ctx.font = `bold ${12 * scale}px sans-serif`;
  const nW = ctx.measureText(nameText).width + 16 * scale;
  const nH = 22 * scale;
  ctx.fillStyle = "#fed7aa"; // Kraft peach highlight
  ctx.fillRect(28 * scale, 110 * scale, nW, nH);
  ctx.fillStyle = "#7c2d12";
  ctx.textBaseline = "middle";
  ctx.fillText(nameText, 36 * scale, 110 * scale + nH / 2);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#525252";
  ctx.font = `500 ${8 * scale}px sans-serif`;
  ctx.fillText("Everything Intentional · Shipping in Goa", 28 * scale, 144 * scale);

  // 3. Right Side: Spiral Notebook Page ("Developer Stack")
  const noteW = 140 * scale;
  const noteH = 175 * scale;
  const noteX = w - noteW - 24 * scale;
  const noteY = 56 * scale;

  ctx.save();
  ctx.translate(noteX, noteY);
  ctx.rotate(0.02);

  // Notebook double shadow
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 16 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, noteW, noteH);
  ctx.shadowColor = "transparent";

  // Lined paper rules
  ctx.strokeStyle = "rgba(14, 165, 233, 0.2)";
  ctx.lineWidth = 1 * scale;
  for (let ly = 32 * scale; ly < noteH - 10 * scale; ly += 16 * scale) {
    ctx.beginPath();
    ctx.moveTo(18 * scale, ly);
    ctx.lineTo(noteW - 10 * scale, ly);
    ctx.stroke();
  }

  // Left red margin
  ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
  ctx.beginPath();
  ctx.moveTo(22 * scale, 0);
  ctx.lineTo(22 * scale, noteH);
  ctx.stroke();

  // Spiral Wire Holes along left spine
  for (let sy = 12 * scale; sy < noteH - 8 * scale; sy += 14 * scale) {
    ctx.fillStyle = "#e5e5e5";
    ctx.beginPath();
    ctx.arc(8 * scale, sy, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#a3a3a3";
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
  }

  // Notebook Header
  ctx.fillStyle = "#171717";
  ctx.font = `900 ${11 * scale}px sans-serif`;
  ctx.fillText("Goa Stack", 28 * scale, 24 * scale);

  // Stack Items with Clean Square Badges
  const stackItems = [
    { tag: "Re", name: "React", bg: "#0284c7" },
    { tag: "Nx", name: "Next.js", bg: "#171717" },
    { tag: "Ts", name: "TypeScript", bg: "#2563eb" },
    { tag: "So", name: "Solana", bg: "#7c3aed" },
    { tag: "Tw", name: "Tailwind", bg: "#0d9488" },
  ];

  let iy = 44 * scale;
  for (const item of stackItems) {
    // Square icon badge
    ctx.fillStyle = item.bg;
    drawSquircle(ctx, 26 * scale, iy - 8 * scale, 12 * scale, 12 * scale, 2.5 * scale);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${6 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(item.tag, 32 * scale, iy);

    ctx.fillStyle = "#171717";
    ctx.font = `600 ${8 * scale}px sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(item.name, 44 * scale, iy);
    iy += 16 * scale;
  }

  // Top washi tape on notebook
  ctx.fillStyle = "rgba(254, 215, 170, 0.85)";
  ctx.fillRect(noteW / 2 - 25 * scale, -8 * scale, 50 * scale, 16 * scale);

  ctx.restore();

  // 4. Center Hero: White Die-Cut Sticker Cutout (Photo)
  const heroCX = w * 0.48;
  const heroCY = h * 0.54;
  const heroSize = Math.min(w * 0.52, 250 * scale);

  // Die-cut white border + Double Overlay Drop Shadow
  ctx.save();
  ctx.translate(heroCX, heroCY);

  // Deep shadow pass
  ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = 28 * scale;
  ctx.shadowOffsetY = 14 * scale;

  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, -heroSize / 2 - 8 * scale, -heroSize / 2 - 8 * scale, heroSize + 16 * scale, heroSize + 16 * scale, 18 * scale);
  ctx.fill();

  // Tight contact shadow pass
  ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetY = 2 * scale;
  drawSquircle(ctx, -heroSize / 2 - 8 * scale, -heroSize / 2 - 8 * scale, heroSize + 16 * scale, heroSize + 16 * scale, 18 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Photo Window
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
  const polY = h - polH - 30 * scale;

  ctx.save();
  ctx.translate(polX + polW / 2, polY + polH / 2);
  ctx.rotate(-0.07);

  // Polaroid shadow
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 18 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = "#faf9f5";
  ctx.fillRect(-polW / 2, -polH / 2, polW, polH);
  ctx.shadowColor = "transparent";

  // Polaroid inner photo
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

  // Handwritten note on polaroid
  ctx.fillStyle = "#d97706";
  ctx.font = `bold italic ${7.5 * scale}px 'Georgia', serif`;
  ctx.textAlign = "center";
  ctx.fillText("See you in Goa", 0, polH / 2 - 10 * scale);

  // Washi tape at top of polaroid
  ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
  ctx.fillRect(-22 * scale, -polH / 2 - 6 * scale, 44 * scale, 14 * scale);

  ctx.restore();

  // 6. Bottom Right: Sticky Note & Doodles
  const stickW = 100 * scale;
  const stickH = 45 * scale;
  const stickX = w - stickW - 28 * scale;
  const stickY = h - stickH - 55 * scale;

  ctx.save();
  ctx.translate(stickX, stickY);
  ctx.rotate(0.04);
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 10 * scale;
  ctx.shadowOffsetY = 4 * scale;
  ctx.fillStyle = "#fef08a"; // Yellow post-it
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

  // Doodles & Arrows
  ctx.save();
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 1.5 * scale;

  // Hand-drawn star doodles
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.fillStyle = "#171717";
  ctx.fillText("✦", w - 40 * scale, 40 * scale);
  ctx.fillText("★", 28 * scale, h * 0.42);

  // Motion marks around hero
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.arc(heroCX - heroSize / 2 - 14 * scale, heroCY - 30 * scale, 12 * scale, -0.6, 0.6);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(heroCX - heroSize / 2 - 20 * scale, heroCY - 30 * scale, 18 * scale, -0.6, 0.6);
  ctx.stroke();

  // Hand-drawn arrow to photo
  ctx.beginPath();
  ctx.moveTo(w - 70 * scale, h - 35 * scale);
  ctx.quadraticCurveTo(w - 90 * scale, h - 20 * scale, w - 120 * scale, h - 30 * scale);
  ctx.stroke();

  // Bottom Text Ribbon
  const botCaption = frame.caption || "I AM COMING TO HH GOA '26 · ARE YOU?";
  drawStyledCaption(ctx, botCaption, frame.captionStyle || "bold-street", w / 2, h - 20 * scale, w - 40 * scale, scale);

  ctx.restore();
}

// ── Official Template 2: HH Goa Poster ───────────────────────
function renderHhGoaOfficial(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const cardW = Math.min(w * 0.86, 390 * scale);
  const cardH = cardW * 1.32;
  const x = -cardW / 2;
  const y = -cardH / 2;

  drawDoubleShadowCard(ctx, x, y, cardW, cardH, 18 * scale, "#0d4a2b", scale);

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, x, y, cardW, cardH, 18 * scale);
  ctx.stroke();

  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.arc(0, y + 40 * scale, 30 * scale, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = "#fde047";
  ctx.font = `900 ${22 * scale}px 'Georgia', serif`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE", 0, y + 36 * scale);

  ctx.fillStyle = "#ec4899";
  drawSquircle(ctx, -26 * scale, y + 40 * scale, 52 * scale, 14 * scale, 4 * scale);
  ctx.fill();
  ctx.fillStyle = "#fefce8";
  ctx.font = `bold ${8 * scale}px sans-serif`;
  ctx.fillText("GOA '26", 0, y + 50 * scale);

  const photoW = cardW - 36 * scale;
  const photoH = photoW * 0.95;
  const px = -photoW / 2;
  const py = y + 62 * scale;

  ctx.fillStyle = "#08331e";
  drawSquircle(ctx, px, py, photoW, photoH, 10 * scale);
  ctx.fill();

  ctx.save();
  drawSquircle(ctx, px, py, photoW, photoH, 10 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, py + photoH / 2, photoW, photoH);
  } else {
    ctx.fillStyle = "#08331e";
    ctx.fillRect(px, py, photoW, photoH);
    ctx.fillStyle = "rgba(254, 252, 232, 0.4)";
    ctx.font = `600 ${12 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", 0, py + photoH / 2);
  }
  ctx.restore();

  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, px, py, photoW, photoH, 10 * scale);
  ctx.stroke();

  const by = py + photoH + 20 * scale;
  const caption = frame.caption || "I AM COMING TO HH GOA '26 · ARE YOU?";

  const rw = cardW - 30 * scale;
  const rh = 30 * scale;
  ctx.fillStyle = "#ec4899";
  drawSquircle(ctx, -rw / 2, by, rw, rh, 6 * scale);
  ctx.fill();

  ctx.fillStyle = "#fefce8";
  ctx.font = `900 ${10.5 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(caption.toUpperCase(), 0, by + rh / 2);

  ctx.fillStyle = "#fde047";
  ctx.font = `600 ${7.5 * scale}px monospace`;
  ctx.fillText("★ EVERYTHING INTENTIONAL · AUGUST 13-16 2026 ★", 0, by + rh + 14 * scale);

  ctx.restore();
}

// ── Official Template 3: Beach Signpost Frame ────────────────
function renderHhGoaSignpost(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const cardW = Math.min(w * 0.85, 380 * scale);
  const cardH = cardW * 1.3;
  const x = -cardW / 2;
  const y = -cardH / 2;

  drawDoubleShadowCard(ctx, x, y, cardW, cardH, 16 * scale, "#08331e", scale);

  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, x, y, cardW, cardH, 16 * scale);
  ctx.stroke();

  const photoW = cardW - 32 * scale;
  const photoH = cardH - 100 * scale;
  const px = -photoW / 2;
  const py = y + 20 * scale;

  ctx.save();
  drawSquircle(ctx, px, py, photoW, photoH, 10 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, py + photoH / 2, photoW, photoH);
  }
  ctx.restore();

  drawSticker(ctx, "signpost", px + 36 * scale, py + photoH - 20 * scale, 75 * scale, scale);

  const by = py + photoH + 24 * scale;
  ctx.fillStyle = "#fde047";
  ctx.font = `900 ${14 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(frame.caption || "I AM COMING TO HH GOA '26 · ARE YOU?", 0, by);

  ctx.fillStyle = "#ec4899";
  ctx.font = `italic bold ${8.5 * scale}px 'Georgia', serif`;
  ctx.fillText("Everything intentional. Shipping in Goa.", 0, by + 16 * scale);

  ctx.restore();
}

// ── Template: Vintage Matte Polaroid with Washi Tape ─────────
function renderVintagePolaroid(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.015);

  const pWidth = Math.min(w * 0.82, 380 * scale);
  const pHeight = pWidth * 1.22;
  const px = -pWidth / 2;
  const py = -pHeight / 2;

  drawDoubleShadowCard(ctx, px, py, pWidth, pHeight, 6 * scale, "#faf9f5", scale);

  const photoMargin = 16 * scale;
  const photoW = pWidth - photoMargin * 2;
  const photoH = photoW;
  const photoX = px + photoMargin;
  const photoY = py + photoMargin + 4 * scale;

  ctx.fillStyle = "#111111";
  ctx.fillRect(photoX, photoY, photoW, photoH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, photoX + photoW / 2, photoY + photoH / 2, photoW, photoH);
  } else {
    ctx.fillStyle = "#222222";
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = `600 ${16 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", photoX + photoW / 2, photoY + photoH / 2);
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  const captionY = photoY + photoH + (pHeight - (photoY + photoH - py)) / 2 + 4 * scale;
  const captionText = frame.caption || "I AM COMING TO HH GOA '26 · ARE YOU?";

  drawStyledCaption(ctx, captionText, frame.captionStyle || "handwritten", 0, captionY - 6 * scale, photoW, scale);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `500 ${8 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText("HH GOA 2026 · 08.13.26", 0, captionY + 14 * scale);

  ctx.save();
  ctx.rotate(0.03);
  ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
  const tapeW = pWidth * 0.42;
  const tapeH = 22 * scale;
  ctx.fillRect(-tapeW / 2, py - tapeH / 2, tapeW, tapeH);
  ctx.restore();

  ctx.restore();
}

// ── Template: Festival VIP Wristband ─────────────────────────
function renderFestivalWristband(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const cardW = Math.min(w * 0.84, 380 * scale);
  const cardH = cardW * 1.25;
  const x = -cardW / 2;
  const y = -cardH / 2;

  drawDoubleShadowCard(ctx, x, y, cardW, cardH, 16 * scale, "#121212", scale);

  const photoMargin = 16 * scale;
  const photoW = cardW - photoMargin * 2;
  const photoH = cardH - 80 * scale;
  const px = x + photoMargin;
  const py = y + photoMargin;

  ctx.save();
  drawSquircle(ctx, px, py, photoW, photoH, 10 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, py + photoH / 2, photoW, photoH);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(px, py, photoW, photoH);
  }
  ctx.restore();

  const bandY = y + cardH - 52 * scale;
  const bandH = 38 * scale;

  ctx.fillStyle = "#facc15";
  drawSquircle(ctx, x + 8 * scale, bandY, cardW - 16 * scale, bandH, 8 * scale);
  ctx.fill();

  ctx.fillStyle = "#072e1a";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const caption = frame.caption || "I AM COMING TO HH GOA 26, ARE YOU?";
  ctx.fillText(caption.toUpperCase(), 0, bandY + bandH / 2 - 4 * scale);

  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.fillText("★ OFFICIAL VIP PASS · AUG 13-16 2026 ★", 0, bandY + bandH / 2 + 8 * scale);

  ctx.restore();
}

// ── Template: Streetwear Typographic Poster ───────────────────
function renderStreetwearPoster(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const pWidth = Math.min(w * 0.85, 380 * scale);
  const pHeight = pWidth * 1.3;
  const px = -pWidth / 2;
  const py = -pHeight / 2;

  drawDoubleShadowCard(ctx, px, py, pWidth, pHeight, 0, "#000000", scale);

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${16 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("I AM COMING TO HH GOA '26", 0, py + 22 * scale);

  const photoW = pWidth - 24 * scale;
  const photoH = pHeight - 90 * scale;
  const photox = -photoW / 2;
  const photoy = py + 32 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.rect(photox, photoy, photoW, photoH);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, photoy + photoH / 2, photoW, photoH);
  } else {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(photox, photoy, photoW, photoH);
  }
  ctx.restore();

  const by = py + pHeight - 42 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${14 * scale}px 'Impact', sans-serif`;
  ctx.fillText(frame.caption || "ARE YOU READY TO SHIP?", 0, by);

  ctx.fillStyle = "#737373";
  ctx.font = `600 ${7.5 * scale}px monospace`;
  ctx.fillText("15.2993° N, 74.1240° E · HACKER HOUSE GOA", 0, by + 18 * scale);

  ctx.restore();
}

// ── Template: Admit One Cinema Ticket ────────────────────────
function renderCinemaTicket(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const tWidth = Math.min(w * 0.84, 380 * scale);
  const tHeight = tWidth * 1.25;
  const tx = -tWidth / 2;
  const ty = -tHeight / 2;

  drawDoubleShadowCard(ctx, tx, ty, tWidth, tHeight, 14 * scale, "#f59e0b", scale);

  ctx.fillStyle = "#f5f2eb";
  ctx.beginPath();
  ctx.arc(tx, 0, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tx + tWidth, 0, 16 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([4 * scale, 4 * scale]);
  ctx.strokeRect(tx + 12 * scale, ty + 12 * scale, tWidth - 24 * scale, tHeight - 24 * scale);
  ctx.setLineDash([]);

  ctx.fillStyle = "#78350f";
  ctx.font = `bold ${10 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("★ ADMIT ONE BUILDER // HH GOA 2026 ★", 0, ty + 28 * scale);

  const pw = tWidth - 50 * scale;
  const ph = pw * 0.9;
  const pxx = -pw / 2;
  const pyy = ty + 38 * scale;

  ctx.save();
  drawSquircle(ctx, pxx, pyy, pw, ph, 8 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, pyy + ph / 2, pw, ph);
  } else {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(pxx, pyy, pw, ph);
  }
  ctx.restore();

  const by = pyy + ph + 24 * scale;
  ctx.fillStyle = "#451a03";
  ctx.font = `bold italic ${13 * scale}px 'Georgia', serif`;
  ctx.fillText(frame.caption || "I AM COMING TO HH GOA '26 · ARE YOU?", 0, by);

  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.fillText("№ 2026-0842 · VIP ADMISSION · BEACH STAGE", 0, by + 18 * scale);

  ctx.restore();
}

// ── Template: Cyber Scanner ──────────────────────────────────
function renderCyberScanner(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const cardW = Math.min(w * 0.84, 380 * scale);
  const cardH = cardW * 1.28;
  const x = -cardW / 2;
  const y = -cardH / 2;

  drawDoubleShadowCard(ctx, x, y, cardW, cardH, 12 * scale, "#050811", scale);

  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, x, y, cardW, cardH, 12 * scale);
  ctx.stroke();

  ctx.fillStyle = "#06b6d4";
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("[BIOMETRIC_ID: CONFIRMED]", x + 16 * scale, y + 22 * scale);
  ctx.textAlign = "right";
  ctx.fillText("HH_GOA // 2026", x + cardW - 16 * scale, y + 22 * scale);

  const photoMargin = 16 * scale;
  const photoW = cardW - photoMargin * 2;
  const photoH = cardH - 85 * scale;
  const px = x + photoMargin;
  const py = y + 32 * scale;

  ctx.save();
  drawSquircle(ctx, px, py, photoW, photoH, 6 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, py + photoH / 2, photoW, photoH);
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
  ctx.lineWidth = 1 * scale;
  const boxS = 80 * scale;
  ctx.strokeRect(-boxS / 2, py + photoH / 2 - boxS / 2, boxS, boxS);

  const by = y + cardH - 30 * scale;
  ctx.fillStyle = "#10b981";
  ctx.font = `bold ${12 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`STATUS: ${frame.caption || "I AM COMING TO HH GOA 26"}`, 0, by);

  ctx.fillStyle = "#06b6d4";
  ctx.font = `500 ${7.5 * scale}px monospace`;
  ctx.fillText("PING: 12ms · ACCESS GRANTED · RADAR ACTIVE", 0, by + 15 * scale);

  ctx.restore();
}

// ── Template: Postage Stamp ──────────────────────────────────
function renderPostageStamp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const stampW = Math.min(w * 0.8, 360 * scale);
  const stampH = stampW * 1.25;
  const sx = -stampW / 2;
  const sy = -stampH / 2;

  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 12 * scale;

  ctx.fillStyle = "#faf8f5";
  drawPerforatedRect(ctx, sx, sy, stampW, stampH, 5 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  const margin = 14 * scale;
  const innerW = stampW - margin * 2;
  const innerH = stampH - margin * 2;
  const ix = sx + margin;
  const iy = sy + margin;

  ctx.strokeStyle = "#b91c1c";
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(ix, iy, innerW, innerH);

  ctx.fillStyle = "#b91c1c";
  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText("★ HACKER HOUSE GOA · AIR MAIL ★", 0, iy + 12 * scale);

  const photoW = innerW - 12 * scale;
  const photoH = innerH - 42 * scale;
  const px = -photoW / 2;
  const py = iy + 18 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, photoW, photoH);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, py + photoH / 2, photoW, photoH);
  } else {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(px, py, photoW, photoH);
  }
  ctx.restore();

  ctx.fillStyle = "#1e3a8a";
  ctx.font = `bold ${11 * scale}px 'Georgia', serif`;
  ctx.textAlign = "left";
  ctx.fillText("₹2026", ix + 8 * scale, iy + innerH - 6 * scale);

  ctx.fillStyle = "#b91c1c";
  ctx.font = `italic ${8 * scale}px 'Georgia', serif`;
  ctx.textAlign = "right";
  ctx.fillText(frame.caption || "BUILDER EDITION", ix + innerW - 8 * scale, iy + innerH - 6 * scale);

  ctx.restore();
}

// ── Template: Retro Music Player ─────────────────────────────
function renderRetroMusicPlayer(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const cardW = Math.min(w * 0.84, 380 * scale);
  const cardH = cardW * 1.32;
  const x = -cardW / 2;
  const y = -cardH / 2;

  drawDoubleShadowCard(ctx, x, y, cardW, cardH, 20 * scale, "#141414", scale);

  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, x, y, cardW, cardH, 20 * scale);
  ctx.stroke();

  ctx.fillStyle = "#facc15";
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText("● NOW PLAYING // HH GOA 2026", 0, y + 24 * scale);

  const artMargin = 22 * scale;
  const artW = cardW - artMargin * 2;
  const artH = artW * 0.95;
  const artX = -artW / 2;
  const artY = y + 36 * scale;

  ctx.save();
  drawSquircle(ctx, artX, artY, artW, artH, 12 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, artY + artH / 2, artW, artH);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(artX, artY, artW, artH);
  }
  ctx.restore();

  let py = artY + artH + 24 * scale;
  ctx.fillStyle = "#f5f5f5";
  ctx.font = `bold ${15 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(frame.caption || "I AM COMING TO HH GOA '26", artX, py);

  ctx.fillStyle = "#737373";
  ctx.font = `500 ${10 * scale}px sans-serif`;
  ctx.fillText("HH Goa 2026 · Live Session", artX, py + 16 * scale);

  ctx.fillStyle = "#facc15";
  ctx.font = `bold ${10 * scale}px sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText("♥ 1.2K", artX + artW, py + 8 * scale);

  py += 36 * scale;
  ctx.fillStyle = "#262626";
  drawSquircle(ctx, artX, py, artW, 4 * scale, 2 * scale);
  ctx.fill();

  const progressW = artW * 0.48;
  ctx.fillStyle = "#facc15";
  drawSquircle(ctx, artX, py, progressW, 4 * scale, 2 * scale);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(artX + progressW, py + 2 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#525252";
  ctx.font = `500 ${8 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("1:50", artX, py + 14 * scale);
  ctx.textAlign = "right";
  ctx.fillText("3:45", artX + artW, py + 14 * scale);

  py += 28 * scale;
  ctx.fillStyle = "#a3a3a3";
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("TRACK 01 // HH GOA BEACH SESSION", 0, py);

  ctx.restore();
}

// ── Template: Magazine Editorial ─────────────────────────────
function renderEditorialMagazine(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const magW = Math.min(w * 0.85, 380 * scale);
  const magH = magW * 1.35;
  const mx = -magW / 2;
  const my = -magH / 2;

  drawDoubleShadowCard(ctx, mx, my, magW, magH, 8 * scale, "#000000", scale);

  ctx.save();
  drawSquircle(ctx, mx, my, magW, magH, 8 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, 0, magW, magH);
  }
  const grad = ctx.createLinearGradient(0, my, 0, my + magH);
  grad.addColorStop(0, "rgba(0,0,0,0.7)");
  grad.addColorStop(0.3, "transparent");
  grad.addColorStop(0.65, "transparent");
  grad.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = grad;
  ctx.fillRect(mx, my, magW, magH);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${44 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("GOA", 0, my + 48 * scale);

  ctx.fillStyle = "#facc15";
  ctx.font = `600 ${8 * scale}px monospace`;
  ctx.fillText("THE BUILDER ISSUE // NO. 2026", 0, my + 62 * scale);

  const quoteY = my + magH * 0.35;
  ctx.fillStyle = "#fef08a";
  const qw = magW * 0.72;
  const qh = 24 * scale;
  drawSquircle(ctx, -qw / 2, quoteY, qw, qh, 4 * scale);
  ctx.fill();

  ctx.fillStyle = "#171717";
  ctx.font = `bold italic ${9 * scale}px 'Georgia', serif`;
  ctx.fillText(frame.caption || "I AM COMING TO HH GOA '26 · ARE YOU?", 0, quoteY + 15 * scale);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("SHIPPING IN GOA", mx + 16 * scale, my + magH - 36 * scale);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `500 ${8 * scale}px sans-serif`;
  ctx.fillText("Hacker House Goa · Official Pass · Aug 2026", mx + 16 * scale, my + magH - 22 * scale);

  drawSticker(ctx, "barcode", mx + magW - 40 * scale, my + magH - 26 * scale, 45 * scale, scale);

  ctx.restore();
}

// ── Template: Gallery Passe-Partout ──────────────────────────
function renderMinimalGallery(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const fWidth = Math.min(w * 0.82, 380 * scale);
  const fHeight = fWidth * 1.25;
  const fx = -fWidth / 2;
  const fy = -fHeight / 2;

  drawDoubleShadowCard(ctx, fx, fy, fWidth, fHeight, 0, "#141414", scale);
  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(fx, fy, fWidth, fHeight);

  const matte = 28 * scale;
  const photoW = fWidth - matte * 2;
  const photoH = photoW * 1.05;
  const photoX = fx + matte;
  const photoY = fy + matte;

  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, photoX + photoW / 2, photoY + photoH / 2, photoW, photoH);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  ctx.strokeStyle = "#333333";
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  const textY = photoY + photoH + 28 * scale;
  ctx.fillStyle = "#e5e5e5";
  ctx.font = `600 ${11 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA — 2026", 0, textY);

  ctx.fillStyle = "#737373";
  ctx.font = `500 ${8 * scale}px monospace`;
  ctx.fillText(frame.caption || "15.2993° N, 74.1240° E · EXHIBIT NO. 26", 0, textY + 14 * scale);

  ctx.restore();
}

// ── Circular PFP Frame ───────────────────────────────────────
function renderCircularPfp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  const outerR = Math.min(w, h) / 2 - 16 * scale;
  const ringWidth = 24 * scale;
  const photoR = outerR - ringWidth;

  ctx.save();
  const grad = ctx.createConicGradient(0, cx, cy);
  grad.addColorStop(0, "#ff6b35");
  grad.addColorStop(0.3, "#f857a6");
  grad.addColorStop(0.6, "#00f2fe");
  grad.addColorStop(0.85, "#facc15");
  grad.addColorStop(1, "#ff6b35");

  ctx.strokeStyle = grad;
  ctx.lineWidth = ringWidth;
  ctx.beginPath();
  ctx.arc(cx, cy, (outerR + photoR) / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, cx, cy, photoR * 2, photoR * 2);
  } else {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(cx - photoR, cy - photoR, photoR * 2, photoR * 2);
  }
  ctx.restore();

  if (frame.badgeEnabled) {
    const badgeY = cy + outerR - 16 * scale;
    ctx.fillStyle = "#171717";
    const bw = 160 * scale;
    const bh = 22 * scale;
    drawSquircle(ctx, cx - bw / 2, badgeY - bh / 2, bw, bh, 6 * scale);
    ctx.fill();
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1.5 * scale;
    drawSquircle(ctx, cx - bw / 2, badgeY - bh / 2, bw, bh, 6 * scale);
    ctx.stroke();

    ctx.fillStyle = "#facc15";
    ctx.font = `bold ${9 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(frame.badgeText || "SEE YOU IN GOA", cx, badgeY);
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// FORMAT B: BUILDER ID CARDS
// ─────────────────────────────────────────────────────────────
export function renderBuilderCard(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  templateId: CardTemplateId,
  scale: number = 2
) {
  const W = 440 * scale;
  const H = 600 * scale;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  drawCanvasBackground(ctx, W, H, card.bgStyle || "paper-wrinkled", scale);

  const tmpl = CARD_TEMPLATES.find((t) => t.id === templateId)!;
  const pad = 20 * scale;
  const cardX = pad;
  const cardY = pad;
  const cardW = W - pad * 2;
  const cardH = H - pad * 2;

  if (templateId === "hh-goa-paper-scrapbook") {
    renderPaperScrapbookCard(ctx, img, photo, card, W, H, scale);
  } else if (templateId === "hh-goa-emerald-badge") {
    renderHhGoaEmeraldCard(ctx, img, photo, card, W, H, cardX, cardY, cardW, cardH, scale);
  } else if (templateId === "boarding-pass") {
    renderBoardingPassCard(ctx, img, photo, card, W, H, cardX, cardY, cardW, cardH, scale);
  } else if (templateId === "scrapbook-pass") {
    renderScrapbookCard(ctx, img, photo, card, W, H, cardX, cardY, cardW, cardH, scale);
  } else if (templateId === "festival-access") {
    renderFestivalAccessCard(ctx, img, photo, card, W, H, cardX, cardY, cardW, cardH, scale);
  } else {
    renderStandardIdCard(ctx, img, photo, card, tmpl, W, H, cardX, cardY, cardW, cardH, scale);
  }
}

// ── Card Flagship: Paper Scrapbook Profile Card ───────────────
function renderPaperScrapbookCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  w: number,
  h: number,
  scale: number
) {
  ctx.save();

  // Top Rule & Header
  ctx.fillStyle = "#171717";
  ctx.font = `600 ${9 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("Hacker House Goa 2026", 24 * scale, 28 * scale);

  ctx.textAlign = "right";
  ctx.fillText("08.13.2026", w - 24 * scale, 28 * scale);

  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(24 * scale, 34 * scale);
  ctx.lineTo(w - 24 * scale, 34 * scale);
  ctx.stroke();

  // Top Big Title & Name
  ctx.fillStyle = "#171717";
  ctx.font = `900 ${22 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(card.role ? `${card.role.toUpperCase()} BUILDER` : "FULLSTACK BUILDER", 24 * scale, 62 * scale);

  // Kraft Name Highlight Box
  const nameText = card.name || "Alex Rivera";
  ctx.font = `bold ${13 * scale}px sans-serif`;
  const nW = ctx.measureText(nameText).width + 16 * scale;
  const nH = 22 * scale;
  ctx.fillStyle = "#fed7aa";
  ctx.fillRect(24 * scale, 72 * scale, nW, nH);
  ctx.fillStyle = "#7c2d12";
  ctx.textBaseline = "middle";
  ctx.fillText(nameText, 32 * scale, 72 * scale + nH / 2);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#525252";
  ctx.font = `italic 500 ${8.5 * scale}px 'Georgia', serif`;
  ctx.fillText(`"${card.funTitle || "10x Caffeine-to-Code Pipeline"}"`, 24 * scale, 108 * scale);

  // Center Hero: White Die-Cut Sticker Cutout
  const heroCX = w * 0.5;
  const heroCY = h * 0.44;
  const heroSize = 190 * scale;

  ctx.save();
  ctx.translate(heroCX, heroCY);

  // Deep shadow pass
  ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 12 * scale;

  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, -heroSize / 2 - 8 * scale, -heroSize / 2 - 8 * scale, heroSize + 16 * scale, heroSize + 16 * scale, 16 * scale);
  ctx.fill();

  ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetY = 2 * scale;
  drawSquircle(ctx, -heroSize / 2 - 8 * scale, -heroSize / 2 - 8 * scale, heroSize + 16 * scale, heroSize + 16 * scale, 16 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Photo
  ctx.save();
  drawSquircle(ctx, -heroSize / 2, -heroSize / 2, heroSize, heroSize, 10 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, 0, 0, heroSize, heroSize);
  } else {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-heroSize / 2, -heroSize / 2, heroSize, heroSize);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", 0, 0);
  }
  ctx.restore();

  ctx.restore();

  // Bottom Left: Taped Mini Polaroid with Handle
  const polW = 100 * scale;
  const polH = 120 * scale;
  const polX = 24 * scale;
  const polY = h - polH - 24 * scale;

  ctx.save();
  ctx.translate(polX + polW / 2, polY + polH / 2);
  ctx.rotate(-0.06);

  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 16 * scale;
  ctx.shadowOffsetY = 6 * scale;
  ctx.fillStyle = "#faf9f5";
  ctx.fillRect(-polW / 2, -polH / 2, polW, polH);
  ctx.shadowColor = "transparent";

  const inMargin = 6 * scale;
  const inW = polW - inMargin * 2;
  const inH = inW * 0.9;
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

  ctx.fillStyle = "#525252";
  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.textAlign = "center";
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(handle, 0, polH / 2 - 8 * scale);

  ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
  ctx.fillRect(-18 * scale, -polH / 2 - 5 * scale, 36 * scale, 12 * scale);

  ctx.restore();

  // Bottom Right: Tech Stack Pills & Barcode
  const rightX = w - 160 * scale;
  let ry = h - 140 * scale;

  ctx.fillStyle = "#171717";
  ctx.font = `bold ${9 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("Goa Tech Stack", rightX, ry);

  ry += 12 * scale;
  const stack = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  for (const t of stack.slice(0, 4)) {
    ctx.fillStyle = "#fed7aa";
    drawSquircle(ctx, rightX, ry, ctx.measureText(t).width + 12 * scale, 15 * scale, 3 * scale);
    ctx.fill();
    ctx.fillStyle = "#7c2d12";
    ctx.font = `bold ${7.5 * scale}px sans-serif`;
    ctx.fillText(t, rightX + 6 * scale, ry + 11 * scale);
    ry += 18 * scale;
  }

  // Barcode
  drawSticker(ctx, "barcode", w - 70 * scale, h - 30 * scale, 65 * scale, scale);

  ctx.restore();
}

// ── Card 1: Official HH Goa Emerald & Gold Card ──────────────
function renderHhGoaEmeraldCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number,
  scale: number
) {
  ctx.save();
  drawDoubleShadowCard(ctx, cardX, cardY, cardW, cardH, 18 * scale, "#0d4a2b", scale);

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 18 * scale);
  ctx.stroke();

  let y = cardY + 28 * scale;
  ctx.fillStyle = "#fde047";
  ctx.font = `900 ${16 * scale}px 'Georgia', serif`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA", w / 2, y);

  y += 14 * scale;
  ctx.fillStyle = "#ec4899";
  drawSquircle(ctx, w / 2 - 45 * scale, y - 9 * scale, 90 * scale, 14 * scale, 4 * scale);
  ctx.fill();
  ctx.fillStyle = "#fefce8";
  ctx.font = `bold ${7.5 * scale}px sans-serif`;
  ctx.fillText("OFFICIAL BUILDER", w / 2, y);

  y += 24 * scale;
  const photoSize = 105 * scale;
  const px = w / 2 - photoSize / 2;

  ctx.save();
  drawSquircle(ctx, px, y, photoSize, photoSize, 12 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, w / 2, y + photoSize / 2, photoSize, photoSize);
  } else {
    ctx.fillStyle = "#08331e";
    ctx.fillRect(px, y, photoSize, photoSize);
    ctx.fillStyle = "rgba(254, 252, 232, 0.4)";
    ctx.font = `600 ${11 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", w / 2, y + photoSize / 2);
  }
  ctx.restore();

  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, px, y, photoSize, photoSize, 12 * scale);
  ctx.stroke();

  y += photoSize + 22 * scale;
  ctx.fillStyle = "#fefce8";
  ctx.font = `bold ${18 * scale}px sans-serif`;
  ctx.fillText(card.name || "Your Name", w / 2, y);

  y += 16 * scale;
  ctx.fillStyle = "#fde047";
  ctx.font = `italic 600 ${9.5 * scale}px 'Georgia', serif`;
  ctx.fillText(`"${card.funTitle || "10x Builder"}"`, w / 2, y);

  y += 16 * scale;
  ctx.fillStyle = "#fefce8";
  ctx.font = `600 ${9 * scale}px monospace`;
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handle}  ·  ${card.role || "Fullstack"}`, w / 2, y);

  y += 22 * scale;
  const stack = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  const pillH = 14 * scale;
  const pillGap = 5 * scale;
  ctx.font = `bold ${7.5 * scale}px sans-serif`;

  const widths = stack.map((t) => ctx.measureText(t).width + 12 * scale);
  const totalW = widths.reduce((a, b) => a + b, 0) + (stack.length - 1) * pillGap;
  let sx = w / 2 - Math.min(totalW, cardW - 30 * scale) / 2;

  for (let i = 0; i < stack.length; i++) {
    const pw = widths[i];
    ctx.fillStyle = "#fde047";
    drawSquircle(ctx, sx, y - pillH / 2, pw, pillH, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#0d4a2b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, y);
    sx += pw + pillGap;
  }

  y = cardY + cardH - 42 * scale;
  ctx.fillStyle = "#fde047";
  ctx.font = `italic 600 ${8.5 * scale}px 'Georgia', serif`;
  ctx.fillText("Everything intentional. Shipping in Goa.", w / 2, y);

  y += 16 * scale;
  drawSticker(ctx, "barcode", w / 2, y, 70 * scale, scale);

  ctx.restore();
}

// ── Card 2: Luxury Aviation Boarding Pass ─────────────────────
function renderBoardingPassCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number,
  scale: number
) {
  ctx.save();
  drawDoubleShadowCard(ctx, cardX, cardY, cardW, cardH, 16 * scale, "#141414", scale);

  ctx.strokeStyle = "#2e2e2e";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.stroke();

  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(cardX + 16 * scale, cardY + 8 * scale, cardW - 32 * scale, 3 * scale);

  let y = cardY + 28 * scale;
  ctx.fillStyle = "#f59e0b";
  ctx.font = `bold ${9.5 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("HH AIRWAYS // FLIGHT HH-2026", cardX + 18 * scale, y);

  ctx.textAlign = "right";
  ctx.fillText("BOARDING PASS // VIP", cardX + cardW - 18 * scale, y);

  y += 28 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${24 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("ANY", cardX + 22 * scale, y);

  ctx.fillStyle = "#f59e0b";
  ctx.font = `bold ${16 * scale}px sans-serif`;
  ctx.fillText("✈ ────────", cardX + 85 * scale, y - 4 * scale);

  ctx.fillStyle = "#ffffff";
  ctx.fillText("GOI", cardX + cardW - 65 * scale, y);

  y += 18 * scale;
  ctx.fillStyle = "#737373";
  ctx.font = `500 ${8 * scale}px monospace`;
  ctx.fillText("DATE: AUG 13, 2026", cardX + 22 * scale, y);
  ctx.fillText("BOARDING: 09:00 AM", cardX + 130 * scale, y);
  ctx.fillText("GATE: 04-VIP", cardX + cardW - 85 * scale, y);

  y += 22 * scale;
  const photoSize = 90 * scale;
  const px = cardX + 20 * scale;

  ctx.save();
  drawSquircle(ctx, px, y, photoSize, photoSize, 10 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, px + photoSize / 2, y + photoSize / 2, photoSize, photoSize);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(px, y, photoSize, photoSize);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = `bold ${9 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Photo", px + photoSize / 2, y + photoSize / 2);
  }
  ctx.restore();

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1 * scale;
  drawSquircle(ctx, px, y, photoSize, photoSize, 10 * scale);
  ctx.stroke();

  const textX = px + photoSize + 16 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${16 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(card.name || "PASSENGER NAME", textX, y + 20 * scale);

  ctx.fillStyle = "#f59e0b";
  ctx.font = `italic ${9.5 * scale}px 'Georgia', serif`;
  ctx.fillText(`"${card.funTitle || "10x Builder"}"`, textX, y + 38 * scale);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `500 ${8.5 * scale}px monospace`;
  ctx.fillText(`ROLE: ${card.role || "FULLSTACK"}`, textX, y + 54 * scale);
  ctx.fillText(`HANDLE: @${card.handle?.replace("@", "") || "BUILDER"}`, textX, y + 68 * scale);

  y += photoSize + 22 * scale;
  const stack = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  const pillH = 14 * scale;
  const pillGap = 5 * scale;
  ctx.font = `bold ${7.5 * scale}px sans-serif`;

  const widths = stack.map((t) => ctx.measureText(t).width + 12 * scale);
  let sx = cardX + 20 * scale;

  for (let i = 0; i < stack.length; i++) {
    const pw = widths[i];
    ctx.fillStyle = "#222222";
    drawSquircle(ctx, sx, y - pillH / 2, pw, pillH, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, y);
    sx += pw + pillGap;
  }

  y += 26 * scale;
  ctx.strokeStyle = "#383838";
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([5 * scale, 5 * scale]);
  ctx.beginPath();
  ctx.moveTo(cardX + 16 * scale, y);
  ctx.lineTo(cardX + cardW - 16 * scale, y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#f5f2eb";
  ctx.beginPath();
  ctx.arc(cardX, y, 10 * scale, 0, Math.PI * 2);
  ctx.arc(cardX + cardW, y, 10 * scale, 0, Math.PI * 2);
  ctx.fill();

  y += 24 * scale;
  ctx.fillStyle = "#f5f5f5";
  ctx.font = `bold ${10 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("SEAT: 01A", cardX + 22 * scale, y);
  ctx.fillText("ZONE: VIP", cardX + 120 * scale, y);
  ctx.textAlign = "right";
  ctx.fillText(`PASS: ${card.badgeId || "HHG-26-8420"}`, cardX + cardW - 22 * scale, y);

  y += 40 * scale;
  drawSticker(ctx, "barcode", w / 2, y, 120 * scale, scale);

  y += 24 * scale;
  ctx.fillStyle = "#525252";
  ctx.font = `500 ${7.5 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA 2026 · KEEP THIS STUB FOR ENTRY", w / 2, y);

  ctx.restore();
}

// ── Card 3: Scrapbook Pass ───────────────────────────────────
function renderScrapbookCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number,
  scale: number
) {
  ctx.save();
  drawDoubleShadowCard(ctx, cardX, cardY, cardW, cardH, 16 * scale, "#faf9f5", scale);

  ctx.fillStyle = "rgba(250, 204, 21, 0.85)";
  const tw = 120 * scale;
  ctx.fillRect(w / 2 - tw / 2, cardY - 6 * scale, tw, 18 * scale);

  let y = cardY + 28 * scale;
  ctx.fillStyle = "#171717";
  ctx.font = `bold ${12 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA · 2026", w / 2, y);

  ctx.fillStyle = "#d97706";
  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.fillText("★ I AM COMING TO HH GOA '26 ★", w / 2, y + 12 * scale);

  y += 24 * scale;
  const photoSize = 110 * scale;
  const px = w / 2 - photoSize / 2;

  ctx.fillStyle = "#111111";
  drawSquircle(ctx, px, y, photoSize, photoSize, 8 * scale);
  ctx.fill();

  ctx.save();
  drawSquircle(ctx, px, y, photoSize, photoSize, 8 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, w / 2, y + photoSize / 2, photoSize, photoSize);
  } else {
    ctx.fillStyle = "#222222";
    ctx.fillRect(px, y, photoSize, photoSize);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = `600 ${10 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", w / 2, y + photoSize / 2);
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1 * scale;
  drawSquircle(ctx, px, y, photoSize, photoSize, 8 * scale);
  ctx.stroke();

  y += photoSize + 22 * scale;
  ctx.fillStyle = "#171717";
  ctx.font = `bold ${18 * scale}px sans-serif`;
  ctx.fillText(card.name || "Your Name", w / 2, y);

  y += 16 * scale;
  ctx.fillStyle = "#b45309";
  ctx.font = `italic 600 ${9.5 * scale}px 'Georgia', serif`;
  ctx.fillText(`"${card.funTitle || "10x Builder"}"`, w / 2, y);

  y += 16 * scale;
  ctx.fillStyle = "#525252";
  ctx.font = `600 ${9 * scale}px monospace`;
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handle}  ·  ${card.role || "Fullstack"}`, w / 2, y);

  y += 22 * scale;
  const stack = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "Solana"];
  const pillH = 14 * scale;
  const pillGap = 5 * scale;
  ctx.font = `bold ${7.5 * scale}px sans-serif`;

  const widths = stack.map((t) => ctx.measureText(t).width + 12 * scale);
  const totalW = widths.reduce((a, b) => a + b, 0) + (stack.length - 1) * pillGap;
  let sx = w / 2 - Math.min(totalW, cardW - 30 * scale) / 2;

  for (let i = 0; i < stack.length; i++) {
    const pw = widths[i];
    ctx.fillStyle = "#fef08a";
    drawSquircle(ctx, sx, y - pillH / 2, pw, pillH, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#854d0e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, y);
    sx += pw + pillGap;
  }

  y = cardY + cardH - 36 * scale;
  drawSticker(ctx, "barcode", w / 2, y, 70 * scale, scale);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `500 ${7 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`BADGE: ${card.badgeId || "HHG-26-0000"} · GOA, INDIA`, w / 2, cardY + cardH - 12 * scale);

  ctx.restore();
}

// ── Card 4: Festival Access Pass ─────────────────────────────
function renderFestivalAccessCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number,
  scale: number
) {
  ctx.save();
  drawDoubleShadowCard(ctx, cardX, cardY, cardW, cardH, 16 * scale, "#161616", scale);

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.stroke();

  ctx.fillStyle = "#facc15";
  ctx.fillRect(cardX, cardY, cardW, 8 * scale);

  let y = cardY + 36 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${14 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("HH GOA 2026 // ALL-ACCESS PASS", w / 2, y);

  y += 24 * scale;
  const photoSize = 100 * scale;
  const px = w / 2 - photoSize / 2;

  ctx.save();
  drawSquircle(ctx, px, y, photoSize, photoSize, 10 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, w / 2, y + photoSize / 2, photoSize, photoSize);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(px, y, photoSize, photoSize);
  }
  ctx.restore();

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, px, y, photoSize, photoSize, 10 * scale);
  ctx.stroke();

  y += photoSize + 22 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${18 * scale}px sans-serif`;
  ctx.fillText(card.name || "Your Name", w / 2, y);

  y += 18 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.fillText("I AM COMING TO HH GOA '26", w / 2, y);

  y += 16 * scale;
  ctx.fillStyle = "#a3a3a3";
  ctx.font = `600 ${9 * scale}px monospace`;
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handle}  ·  ${card.role || "Fullstack"}`, w / 2, y);

  y = cardY + cardH - 36 * scale;
  drawSticker(ctx, "barcode", w / 2, y, 70 * scale, scale);

  ctx.restore();
}

// ── Card 5: Standard / Holographic / Cyber / Swiss ───────────
function renderStandardIdCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  tmpl: (typeof CARD_TEMPLATES)[0],
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number,
  scale: number
) {
  ctx.save();
  drawDoubleShadowCard(ctx, cardX, cardY, cardW, cardH, 16 * scale, tmpl.colors.card, scale);

  ctx.strokeStyle = hex(tmpl.colors.accent, 0.25);
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.stroke();

  const barH = 5 * scale;
  ctx.fillStyle = tmpl.colors.accent;
  ctx.fillRect(cardX, cardY, cardW, barH);

  ctx.fillStyle = "#0c0c0c";
  drawSquircle(ctx, w / 2 - 18 * scale, cardY + 12 * scale, 36 * scale, 8 * scale, 4 * scale);
  ctx.fill();

  let y = cardY + 40 * scale;
  ctx.fillStyle = tmpl.colors.text;
  ctx.font = `bold ${11 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA 2026", w / 2, y);

  ctx.fillStyle = tmpl.colors.accent;
  ctx.font = `bold ${7.5 * scale}px monospace`;
  ctx.fillText("OFFICIAL BUILDER PASS", w / 2, y + 12 * scale);

  y += 24 * scale;
  const photoR = 50 * scale;
  const photoCX = w / 2;
  const photoCY = y + photoR;

  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCX, photoCY, photoR + 2.5 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = tmpl.colors.accent;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, photoCX, photoCY, photoR * 2, photoR * 2);
  } else {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(photoCX - photoR, photoCY - photoR, photoR * 2, photoR * 2);
  }
  ctx.restore();

  y = photoCY + photoR + 20 * scale;
  ctx.fillStyle = tmpl.colors.text;
  ctx.font = `bold ${16 * scale}px sans-serif`;
  ctx.fillText(card.name || "Your Name", w / 2, y);

  y += 15 * scale;
  ctx.fillStyle = tmpl.colors.accent;
  ctx.font = `italic ${9 * scale}px 'Georgia', serif`;
  ctx.fillText(`"${card.funTitle || "10x Builder"}"`, w / 2, y);

  y += 15 * scale;
  ctx.fillStyle = hex(tmpl.colors.text, 0.6);
  ctx.font = `500 ${8.5 * scale}px monospace`;
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handle}  ·  ${card.role || "Fullstack"}`, w / 2, y);

  y += 18 * scale;
  const stack = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "Solana"];
  const pillH = 13 * scale;
  const pillGap = 4 * scale;
  ctx.font = `600 ${7 * scale}px sans-serif`;

  const widths = stack.map((t) => ctx.measureText(t).width + 10 * scale);
  const totalW = widths.reduce((a, b) => a + b, 0) + (stack.length - 1) * pillGap;
  let sx = w / 2 - Math.min(totalW, cardW - 30 * scale) / 2;

  for (let i = 0; i < stack.length; i++) {
    const pw = widths[i];
    ctx.fillStyle = hex(tmpl.colors.accent, 0.15);
    drawSquircle(ctx, sx, y - pillH / 2, pw, pillH, 4 * scale);
    ctx.fill();
    ctx.fillStyle = tmpl.colors.accent;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, y);
    sx += pw + pillGap;
  }

  if (card.tagline) {
    y += 18 * scale;
    ctx.fillStyle = hex(tmpl.colors.text, 0.45);
    ctx.font = `italic ${7.5 * scale}px sans-serif`;
    ctx.fillText(`"${card.tagline}"`, w / 2, y);
  }

  ctx.fillStyle = hex(tmpl.colors.text, 0.35);
  ctx.font = `500 ${7 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`BADGE: ${card.badgeId || "HHG-26-0000"} · GOA 2026`, w / 2, cardY + cardH - 12 * scale);

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
