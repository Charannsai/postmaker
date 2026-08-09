/* ──────────────────────────────────────────────────────────────
   Aesthetic Canvas Engine – HH Goa 2026
   Supports Polaroids, Festival Wristbands, Streetwear Posters,
   Cinema Tickets, Postage Stamps, Retro Players, Editorial
   Collages, Boarding Passes, Holographic Passes, & Stickers.
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

// ── Background Renderers ─────────────────────────────────────
export function drawCanvasBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  styleId: BackgroundStyleId,
  scale: number
) {
  ctx.save();
  if (styleId === "yellow-gingham") {
    ctx.fillStyle = "#fffbeb";
    ctx.fillRect(0, 0, w, h);

    const step = 28 * scale;
    ctx.fillStyle = "rgba(253, 224, 71, 0.45)";
    for (let x = 0; x < w; x += step * 2) {
      ctx.fillRect(x, 0, step, h);
    }
    for (let y = 0; y < h; y += step * 2) {
      ctx.fillRect(0, y, w, step);
    }
    ctx.fillStyle = "rgba(250, 204, 21, 0.55)";
    for (let x = 0; x < w; x += step * 2) {
      for (let y = 0; y < h; y += step * 2) {
        ctx.fillRect(x, y, step, step);
      }
    }
  } else if (styleId === "red-texture") {
    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#7f1d1d";
    const dotStep = 6 * scale;
    for (let x = 0; x < w; x += dotStep) {
      for (let y = 0; y < h; y += dotStep) {
        ctx.fillRect(x + ((y / dotStep) % 2) * (dotStep / 2), y, 1.5 * scale, 1.5 * scale);
      }
    }
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
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
  } else if (styleId === "blueprint-grid") {
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
    ctx.lineWidth = 1 * scale;
    const gStep = 24 * scale;
    for (let x = 0; x < w; x += gStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else {
    // Dark Studio Minimal
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

// ── Caption Typography Renderer ──────────────────────────────
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
    // Streetwear black & yellow hazard block
    ctx.font = `900 ${14 * scale}px 'Impact', sans-serif`;
    const tw = Math.min(ctx.measureText(text.toUpperCase()).width + 24 * scale, maxWidth);
    const th = 26 * scale;
    ctx.fillStyle = "#facc15";
    drawSquircle(ctx, cx - tw / 2, cy - th / 2, tw, th, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), cx, cy);
  } else if (style === "typewriter-tape") {
    // Typewriter yellow tape
    ctx.rotate(-0.02);
    ctx.font = `600 ${12 * scale}px 'Courier New', monospace`;
    const tw = Math.min(ctx.measureText(text).width + 20 * scale, maxWidth);
    const th = 22 * scale;
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(cx - tw / 2, cy - th / 2, tw, th);
    ctx.fillStyle = "#171717";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy);
  } else if (style === "hacker-mono") {
    // Hacker monospace HUD text
    ctx.font = `bold ${12 * scale}px monospace`;
    ctx.fillStyle = "#06b6d4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`> ${text}`, cx, cy);
  } else if (style === "golden-serif") {
    // Luxury serif
    ctx.font = `bold italic ${15 * scale}px 'Georgia', serif`;
    ctx.fillStyle = "#d97706";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`✦ ${text} ✦`, cx, cy);
  } else {
    // Default Handwritten / Aesthetic script
    ctx.font = `bold italic ${15 * scale}px 'Georgia', serif`;
    ctx.fillStyle = "#d97706";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy);
  }
  ctx.restore();
}

// ── Sticker Drawers ──────────────────────────────────────────
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

  if (type === "washi-tape") {
    ctx.rotate(-0.06);
    ctx.fillStyle = "rgba(253, 224, 71, 0.75)";
    const tw = size * 1.8;
    const th = size * 0.45;
    ctx.fillRect(-tw / 2, -th / 2, tw, th);
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(-tw / 2, -th / 2, tw, 2 * scale);
  } else if (type === "sunflower") {
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 10 * scale;
    ctx.shadowOffsetY = 4 * scale;

    const r = size * 0.4;
    const petalCount = 14;
    for (let i = 0; i < petalCount; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / petalCount);
      const grad = ctx.createLinearGradient(0, 0, 0, -r * 1.3);
      grad.addColorStop(0, "#eab308");
      grad.addColorStop(0.8, "#facc15");
      grad.addColorStop(1, "#fef08a");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.8, r * 0.28, r * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.55);
    centerGrad.addColorStop(0, "#291305");
    centerGrad.addColorStop(0.8, "#451a03");
    centerGrad.addColorStop(1, "#78350f");
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "verified") {
    // VIP Verified Lightning Badge
    ctx.shadowColor = "rgba(250, 204, 21, 0.4)";
    ctx.shadowBlur = 12 * scale;
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = `900 ${size * 0.5}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⚡", 0, 1 * scale);
  } else if (type === "hazard-tape") {
    // Caution Hazard Strip
    ctx.rotate(0.08);
    const tw = size * 2.2;
    const th = size * 0.4;
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-tw / 2, -th / 2, tw, th);
    ctx.fillStyle = "#000000";
    ctx.font = `bold ${8 * scale}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("/// HH GOA 2026 ///", 0, 0);
  } else if (type === "ticket-stamp") {
    // Admit One Stamp
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
    ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
    ctx.font = `bold ${7 * scale}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HH GOA AIR MAIL", 0, -size * 0.12);
    ctx.fillText("AUG 2026", 0, size * 0.12);
  } else if (type === "palm") {
    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.15, size * 0.5, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "barcode") {
    ctx.fillStyle = "#ffffff";
    const bw = size * 1.4;
    const bh = size * 0.45;
    ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
    ctx.strokeStyle = "#e5e5e5";
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

  if (frame.templateId === "polaroid-tape") {
    renderVintagePolaroid(ctx, img, photo, frame, W, H, cx, cy, scale);
  } else if (frame.templateId === "festival-wristband") {
    renderFestivalWristband(ctx, img, photo, frame, W, H, cx, cy, scale);
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
      if (st === "sunflower") {
        drawSticker(ctx, "sunflower", W - 70 * scale, H - 70 * scale, 110 * scale, scale);
      } else if (st === "verified") {
        drawSticker(ctx, "verified", W - 60 * scale, 60 * scale, 45 * scale, scale);
      } else if (st === "hazard-tape") {
        drawSticker(ctx, "hazard-tape", cx, 30 * scale, 100 * scale, scale);
      } else if (st === "ticket-stamp") {
        drawSticker(ctx, "ticket-stamp", 70 * scale, 70 * scale, 70 * scale, scale);
      } else if (st === "washi-tape") {
        drawSticker(ctx, "washi-tape", cx - 60 * scale, cy - 170 * scale, 70 * scale, scale);
      } else if (st === "postmark") {
        drawSticker(ctx, "postmark", 80 * scale, 80 * scale, 80 * scale, scale);
      } else if (st === "barcode") {
        drawSticker(ctx, "barcode", 80 * scale, H - 50 * scale, 60 * scale, scale);
      } else if (st === "sparkles") {
        drawSticker(ctx, "sparkles", W - 60 * scale, 70 * scale, 36 * scale, scale);
      } else if (st === "palm") {
        drawSticker(ctx, "palm", 50 * scale, cy, 70 * scale, scale);
      }
    });
  }
}

// ── Template 1: Vintage Polaroid & Washi Tape ────────────────
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

  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 12 * scale;

  ctx.fillStyle = "#faf9f5";
  drawSquircle(ctx, px, py, pWidth, pHeight, 6 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

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
  const captionText = frame.caption || "I am coming to HH GOA 26, Are you? 🌴";

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

// ── Template 2: Festival VIP Wristband Frame ─────────────────
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

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 12 * scale;

  ctx.fillStyle = "#121212";
  drawSquircle(ctx, x, y, cardW, cardH, 16 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Photo area
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

  // Diagonal/Bottom Festival Wristband Ribbon
  const bandY = y + cardH - 52 * scale;
  const bandH = 38 * scale;

  ctx.fillStyle = "#facc15";
  drawSquircle(ctx, x + 8 * scale, bandY, cardW - 16 * scale, bandH, 8 * scale);
  ctx.fill();

  // Bold Punchy Festival Text
  ctx.fillStyle = "#000000";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const caption = frame.caption || "I AM COMING TO HH GOA 26, ARE YOU?";
  ctx.fillText(caption.toUpperCase(), 0, bandY + bandH / 2 - 4 * scale);

  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.fillText("★ OFFICIAL VIP PASS · AUG 13-16 2026 ★", 0, bandY + bandH / 2 + 8 * scale);

  ctx.restore();
}

// ── Template 3: Streetwear Poster ────────────────────────────
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

  ctx.fillStyle = "#000000";
  ctx.fillRect(px, py, pWidth, pHeight);

  // Big Bold Top Typography
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${16 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("I AM COMING TO HH GOA '26", 0, py + 22 * scale);

  // Photo
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

  // Bottom text & coordinates
  const by = py + pHeight - 42 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${14 * scale}px 'Impact', sans-serif`;
  ctx.fillText(frame.caption || "ARE YOU READY TO SHIP?", 0, by);

  ctx.fillStyle = "#737373";
  ctx.font = `600 ${7.5 * scale}px monospace`;
  ctx.fillText("15.2993° N, 74.1240° E · HACKER HOUSE GOA", 0, by + 18 * scale);

  ctx.restore();
}

// ── Template 4: Admit One Cinema Ticket ──────────────────────
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

  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 20 * scale;

  ctx.fillStyle = "#f59e0b"; // Warm golden cinema ticket
  drawSquircle(ctx, tx, ty, tWidth, tHeight, 14 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Ticket Notch Cutouts on left & right
  ctx.fillStyle = "#0c0c0c";
  ctx.beginPath();
  ctx.arc(tx, 0, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tx + tWidth, 0, 16 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Inner border
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([4 * scale, 4 * scale]);
  ctx.strokeRect(tx + 12 * scale, ty + 12 * scale, tWidth - 24 * scale, tHeight - 24 * scale);
  ctx.setLineDash([]);

  // Header
  ctx.fillStyle = "#78350f";
  ctx.font = `bold ${10 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("★ ADMIT ONE BUILDER // HH GOA 2026 ★", 0, ty + 28 * scale);

  // Photo
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

  // Bottom Ticket Info
  const by = pyy + ph + 24 * scale;
  ctx.fillStyle = "#451a03";
  ctx.font = `bold italic ${13 * scale}px 'Georgia', serif`;
  ctx.fillText(frame.caption || "I am coming to HH GOA 26, Are you? 🌴", 0, by);

  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.fillText("№ 2026-0842 · VIP ADMISSION · BEACH STAGE", 0, by + 18 * scale);

  ctx.restore();
}

// ── Template 5: Cyber Biometric Scanner ──────────────────────
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

  ctx.fillStyle = "#050811";
  drawSquircle(ctx, x, y, cardW, cardH, 12 * scale);
  ctx.fill();

  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, x, y, cardW, cardH, 12 * scale);
  ctx.stroke();

  // Header HUD
  ctx.fillStyle = "#06b6d4";
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("[BIOMETRIC_ID: CONFIRMED]", x + 16 * scale, y + 22 * scale);
  ctx.textAlign = "right";
  ctx.fillText("HH_GOA // 2026", x + cardW - 16 * scale, y + 22 * scale);

  // Photo Window
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

  // HUD Crosshairs & Target Box
  ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
  ctx.lineWidth = 1 * scale;
  const boxS = 80 * scale;
  ctx.strokeRect(-boxS / 2, py + photoH / 2 - boxS / 2, boxS, boxS);

  // Bottom Status
  const by = y + cardH - 30 * scale;
  ctx.fillStyle = "#10b981";
  ctx.font = `bold ${12 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`STATUS: ${frame.caption || "I AM COMING TO HH GOA 26"}`, 0, by);

  ctx.fillStyle = "#06b6d4";
  ctx.font = `500 ${7.5 * scale}px monospace`;
  ctx.fillText("PING: 12ms · ACCESS GRANTED · BEACH RADAR ACTIVE", 0, by + 15 * scale);

  ctx.restore();
}

// ── Template 6: Perforated Postage Stamp (Air Mail) ──────────
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

  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 20 * scale;
  ctx.shadowOffsetY = 10 * scale;

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

// ── Template 7: Retro Music Player / Cassette ────────────────
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

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 10 * scale;

  ctx.fillStyle = "#141414";
  drawSquircle(ctx, x, y, cardW, cardH, 20 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

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
  ctx.fillText(frame.caption || "I am coming to HH GOA 26 🌴", artX, py);

  ctx.fillStyle = "#737373";
  ctx.font = `500 ${10 * scale}px sans-serif`;
  ctx.fillText("HH Goa 2026 · Beach Session", artX, py + 16 * scale);

  ctx.fillStyle = "#facc15";
  ctx.font = `bold ${10 * scale}px sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText("♥ 1.2 lakh", artX + artW, py + 8 * scale);

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
  ctx.fillText("🔀      ⏮        ▶        ⏭      🔁", 0, py);

  ctx.restore();
}

// ── Template 8: Editorial Magazine Cover ─────────────────────
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

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 10 * scale;

  ctx.fillStyle = "#000000";
  drawSquircle(ctx, mx, my, magW, magH, 8 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

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
  ctx.fillText(frame.caption || "I am coming to HH GOA 26, Are you?", 0, quoteY + 15 * scale);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("SHIPPING BY THE SHORE", mx + 16 * scale, my + magH - 36 * scale);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `500 ${8 * scale}px sans-serif`;
  ctx.fillText("Hacker House Goa · Official Pass · Aug 2026", mx + 16 * scale, my + magH - 22 * scale);

  drawSticker(ctx, "barcode", mx + magW - 40 * scale, my + magH - 26 * scale, 45 * scale, scale);

  ctx.restore();
}

// ── Template 9: Minimal Gallery Passe-Partout ────────────────
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

  ctx.fillStyle = "#141414";
  ctx.fillRect(fx, fy, fWidth, fHeight);
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

// ── Circular PFP Frame (Branded X Profile) ───────────────────
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
    ctx.fillText(frame.badgeText || "SEE YOU IN GOA 🌴", cx, badgeY);
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

  drawCanvasBackground(ctx, W, H, card.bgStyle || "dark-minimal", scale);

  const tmpl = CARD_TEMPLATES.find((t) => t.id === templateId)!;
  const pad = 22 * scale;
  const cardX = pad;
  const cardY = pad;
  const cardW = W - pad * 2;
  const cardH = H - pad * 2;

  if (templateId === "scrapbook-pass") {
    renderScrapbookCard(ctx, img, photo, card, W, H, cardX, cardY, cardW, cardH, scale);
  } else if (templateId === "festival-access") {
    renderFestivalAccessCard(ctx, img, photo, card, W, H, cardX, cardY, cardW, cardH, scale);
  } else if (templateId === "boarding-pass") {
    renderBoardingPassCard(ctx, img, photo, card, W, H, cardX, cardY, cardW, cardH, scale);
  } else {
    renderStandardIdCard(ctx, img, photo, card, tmpl, W, H, cardX, cardY, cardW, cardH, scale);
  }
}

// ── Card Template 1: Scrapbook Pass ──────────────────────────
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
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 22 * scale;
  ctx.shadowOffsetY = 10 * scale;

  ctx.fillStyle = "#faf9f5";
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Washi Tape at Top
  ctx.fillStyle = "rgba(250, 204, 21, 0.85)";
  const tw = 120 * scale;
  ctx.fillRect(w / 2 - tw / 2, cardY - 6 * scale, tw, 18 * scale);

  // Header
  let y = cardY + 28 * scale;
  ctx.fillStyle = "#171717";
  ctx.font = `bold ${12 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA · 2026", w / 2, y);

  ctx.fillStyle = "#d97706";
  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.fillText("★ I AM COMING TO HH GOA 26 ★", w / 2, y + 12 * scale);

  // Photo Area
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

  // Name & Fun Title
  y += photoSize + 22 * scale;
  ctx.fillStyle = "#171717";
  ctx.font = `bold ${18 * scale}px sans-serif`;
  ctx.fillText(card.name || "Your Name", w / 2, y);

  y += 16 * scale;
  ctx.fillStyle = "#b45309";
  ctx.font = `italic 600 ${9.5 * scale}px 'Georgia', serif`;
  ctx.fillText(`"${card.funTitle || "10x Caffeine-to-Code Pipeline"}"`, w / 2, y);

  // Handle & Role
  y += 16 * scale;
  ctx.fillStyle = "#525252";
  ctx.font = `600 ${9 * scale}px monospace`;
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handle}  ·  ${card.role || "Fullstack"}`, w / 2, y);

  // Tech stack pills
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

  // Bottom Barcode & Verification
  y = cardY + cardH - 36 * scale;
  drawSticker(ctx, "barcode", w / 2, y, 70 * scale, scale);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `500 ${7 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`BADGE: ${card.badgeId || "HHG-26-0000"} · GOA, INDIA`, w / 2, cardY + cardH - 12 * scale);

  ctx.restore();
}

// ── Card Template 2: Festival Access Pass ────────────────────
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
  ctx.fillStyle = "#161616";
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.fill();

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.stroke();

  // Top Yellow Lanyard Ribbon
  ctx.fillStyle = "#facc15";
  ctx.fillRect(cardX, cardY, cardW, 8 * scale);

  // Big Header
  let y = cardY + 36 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${14 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("HH GOA 2026 // ALL-ACCESS PASS", w / 2, y);

  // Photo
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

  // Name & Slogan
  y += photoSize + 22 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${18 * scale}px sans-serif`;
  ctx.fillText(card.name || "Your Name", w / 2, y);

  y += 18 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.fillText("I AM COMING TO HH GOA 26, ARE YOU?", w / 2, y);

  y += 16 * scale;
  ctx.fillStyle = "#a3a3a3";
  ctx.font = `600 ${9 * scale}px monospace`;
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handle}  ·  ${card.role || "Fullstack"}`, w / 2, y);

  // Barcode at bottom
  y = cardY + cardH - 36 * scale;
  drawSticker(ctx, "barcode", w / 2, y, 70 * scale, scale);

  ctx.restore();
}

// ── Card Template 3: Boarding Pass ───────────────────────────
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
  ctx.fillStyle = "#141414";
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 14 * scale);
  ctx.fill();

  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 14 * scale);
  ctx.stroke();

  ctx.fillStyle = "#f59e0b";
  ctx.font = `bold ${10 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("HH AIRWAYS // GOA FLIGHT 2026", cardX + 16 * scale, cardY + 24 * scale);

  ctx.textAlign = "right";
  ctx.fillText("PRIORITY BOARDING", cardX + cardW - 16 * scale, cardY + 24 * scale);

  let y = cardY + 54 * scale;
  ctx.fillStyle = "#f5f5f5";
  ctx.font = `bold ${24 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("ANY", cardX + 20 * scale, y);

  ctx.fillStyle = "#f59e0b";
  ctx.font = `bold ${16 * scale}px sans-serif`;
  ctx.fillText("✈ ────", cardX + 90 * scale, y - 4 * scale);

  ctx.fillStyle = "#f5f5f5";
  ctx.fillText("GOI", cardX + 180 * scale, y);

  y += 24 * scale;
  const photoSize = 84 * scale;
  const px = cardX + 18 * scale;

  ctx.save();
  drawSquircle(ctx, px, y, photoSize, photoSize, 8 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, px + photoSize / 2, y + photoSize / 2, photoSize, photoSize);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(px, y, photoSize, photoSize);
  }
  ctx.restore();

  const textX = px + photoSize + 18 * scale;
  ctx.fillStyle = "#f5f5f5";
  ctx.font = `bold ${15 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(card.name || "PASSENGER NAME", textX, y + 20 * scale);

  ctx.fillStyle = "#f59e0b";
  ctx.font = `italic ${9 * scale}px 'Georgia', serif`;
  ctx.fillText(`"${card.funTitle || "10x Builder"}"`, textX, y + 38 * scale);

  ctx.fillStyle = "#737373";
  ctx.font = `500 ${8.5 * scale}px monospace`;
  ctx.fillText(`ROLE: ${card.role || "FULLSTACK"}`, textX, y + 54 * scale);
  ctx.fillText(`HANDLE: @${card.handle?.replace("@", "") || "BUILDER"}`, textX, y + 68 * scale);

  y += photoSize + 28 * scale;
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([6 * scale, 6 * scale]);
  ctx.beginPath();
  ctx.moveTo(cardX + 10 * scale, y);
  ctx.lineTo(cardX + cardW - 10 * scale, y);
  ctx.stroke();
  ctx.setLineDash([]);

  y += 20 * scale;
  ctx.fillStyle = "#a3a3a3";
  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.fillText("SEAT: 01A  ·  GATE: BEACH 04  ·  ZONE: VIP", cardX + 18 * scale, y);

  y += 38 * scale;
  drawSticker(ctx, "barcode", w / 2, y, 90 * scale, scale);

  ctx.restore();
}

// ── Card Template 4: Standard / Holographic / Cyber / Swiss ──
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
  ctx.fillStyle = tmpl.colors.card;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.fill();

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
