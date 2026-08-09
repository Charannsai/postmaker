/* ──────────────────────────────────────────────────────────────
   Canvas Renderer – Clean Minimal Black & White
   ────────────────────────────────────────────────────────────── */

import type {
  PhotoState,
  FrameSettings,
  FrameTemplateId,
  CardData,
  CardTemplateId,
} from "@/types";
import { FRAME_TEMPLATES, CARD_TEMPLATES, getFilterCss } from "./templates";

// ── Helpers ──────────────────────────────────────────────────
function hex(c: string, a: number): string {
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function drawUserPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  photo: PhotoState,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((photo.rotation * Math.PI) / 180);
  ctx.scale(photo.flipH ? -1 : 1, photo.flipV ? -1 : 1);

  const filterCss = getFilterCss(photo.filter);
  if (filterCss !== "none") ctx.filter = filterCss;

  const zoom = photo.zoom;
  const aspect = img.width / img.height;
  let dw: number, dh: number;
  if (aspect > 1) {
    dh = radius * 2 * zoom;
    dw = dh * aspect;
  } else {
    dw = radius * 2 * zoom;
    dh = dw / aspect;
  }

  ctx.drawImage(img, -dw / 2 + photo.offsetX * zoom, -dh / 2 + photo.offsetY * zoom, dw, dh);
  ctx.filter = "none";
  ctx.restore();
}

function drawSquircle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

// ── PFP Frame Renderer ──────────────────────────────────────
export function renderPfpFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  frame: FrameSettings,
  scale: number = 2
) {
  const SIZE = 512 * scale;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, SIZE, SIZE);

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const outerR = SIZE / 2 - 4 * scale;
  const ringWidth = 20 * scale;
  const innerR = outerR - ringWidth;
  const photoR = innerR - 2 * scale;

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Clip photo
  ctx.save();
  if (frame.shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
    ctx.clip();
  } else {
    drawSquircle(ctx, cx - photoR, cy - photoR, photoR * 2, photoR * 2, 50 * scale);
    ctx.clip();
  }

  if (img) {
    drawUserPhoto(ctx, img, photo, cx, cy, photoR);
  } else {
    ctx.fillStyle = "#111";
    ctx.fillRect(cx - photoR, cy - photoR, photoR * 2, photoR * 2);
    ctx.fillStyle = "#333";
    ctx.font = `500 ${24 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", cx, cy);
  }
  ctx.restore();

  // Frame ring — clean gradient using template colors with muted opacity
  const tmpl = FRAME_TEMPLATES.find((t) => t.id === frame.templateId)!;
  ctx.save();
  ctx.lineWidth = ringWidth;

  // Create a subtle gradient ring
  const grad = ctx.createConicGradient(0, cx, cy);
  grad.addColorStop(0, hex(tmpl.colors.primary, 0.7));
  grad.addColorStop(0.25, hex(tmpl.colors.secondary, 0.5));
  grad.addColorStop(0.5, hex(tmpl.colors.accent, 0.4));
  grad.addColorStop(0.75, hex(tmpl.colors.primary, 0.6));
  grad.addColorStop(1, hex(tmpl.colors.secondary, 0.5));
  ctx.strokeStyle = grad;

  const midR = (innerR + outerR) / 2;
  if (frame.shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, midR, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const side = midR * 2;
    drawSquircle(ctx, cx - midR, cy - midR, side, side, 54 * scale);
    ctx.stroke();
  }

  // Inner border line
  ctx.lineWidth = 1 * scale;
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  if (frame.shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Outer border line
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  if (frame.shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Badge
  if (frame.badgeEnabled && frame.badgeText) {
    ctx.save();
    const badgeY = cy + outerR - 16 * scale;
    const fontSize = 10 * scale;
    ctx.font = `600 ${fontSize}px sans-serif`;
    const tw = ctx.measureText(frame.badgeText).width;
    const padX = 14 * scale;
    const padY = 7 * scale;
    const bw = tw + padX * 2;
    const bh = fontSize + padY * 2;
    const bx = cx - bw / 2;
    const by = badgeY - bh / 2;

    ctx.fillStyle = "#111";
    drawSquircle(ctx, bx, by, bw, bh, 8 * scale);
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1 * scale;
    drawSquircle(ctx, bx, by, bw, bh, 8 * scale);
    ctx.stroke();

    ctx.fillStyle = "#d4d4d4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(frame.badgeText, cx, badgeY);
    ctx.restore();
  }

  // Bottom branding
  ctx.save();
  ctx.font = `500 ${8 * scale}px sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("HH GOA 2026", cx, SIZE - 8 * scale);
  ctx.restore();
}

// ── Builder ID Card Renderer ────────────────────────────────
export function renderBuilderCard(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  templateId: CardTemplateId,
  scale: number = 2
) {
  const W = 440 * scale;
  const H = 580 * scale;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  const tmpl = CARD_TEMPLATES.find((t) => t.id === templateId)!;
  const pad = 20 * scale;

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);

  // Card body
  const cardX = pad;
  const cardY = pad;
  const cardW = W - pad * 2;
  const cardH = H - pad * 2;
  const cardR = 16 * scale;

  ctx.fillStyle = "#111";
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fill();

  ctx.strokeStyle = "#1f1f1f";
  ctx.lineWidth = 1 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.stroke();

  // Top accent line — muted color from template
  ctx.save();
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.clip();
  const barH = 3 * scale;
  ctx.fillStyle = hex(tmpl.colors.accent, 0.5);
  ctx.fillRect(cardX, cardY, cardW, barH);
  ctx.restore();

  // Event header
  let y = cardY + barH + 20 * scale;
  ctx.font = `600 ${9 * scale}px sans-serif`;
  ctx.fillStyle = "#525252";
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA 2026", W / 2, y);
  y += 5 * scale;
  ctx.font = `500 ${7 * scale}px sans-serif`;
  ctx.fillStyle = "#333";
  ctx.fillText("BUILDER PASS", W / 2, y);

  // Photo
  y += 16 * scale;
  const photoR = 42 * scale;
  const photoCX = W / 2;
  const photoCY = y + photoR;

  // Photo ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCX, photoCY, photoR + 2 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Clip & draw photo
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, photoCX, photoCY, photoR);
  } else {
    ctx.fillStyle = "#161616";
    ctx.fillRect(photoCX - photoR, photoCY - photoR, photoR * 2, photoR * 2);
    ctx.fillStyle = "#333";
    ctx.font = `bold ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", photoCX, photoCY);
  }
  ctx.restore();

  // Name
  y = photoCY + photoR + 18 * scale;
  ctx.font = `bold ${15 * scale}px sans-serif`;
  ctx.fillStyle = "#e5e5e5";
  ctx.textAlign = "center";
  ctx.fillText(card.name || "Your Name", W / 2, y);

  // Fun title
  y += 14 * scale;
  ctx.font = `italic ${8 * scale}px sans-serif`;
  ctx.fillStyle = "#525252";
  ctx.fillText(`"${card.funTitle || "10x Caffeine-to-Code Pipeline"}"`, W / 2, y);

  // Handle & Role
  y += 14 * scale;
  ctx.font = `500 ${8 * scale}px monospace`;
  ctx.fillStyle = "#404040";
  const handleText = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handleText}  ·  ${card.role || "Fullstack"}`, W / 2, y);

  // Tech stack pills
  y += 16 * scale;
  const stackItems = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "TypeScript"];
  const pillH = 13 * scale;
  const pillGap = 4 * scale;
  const pillFont = `500 ${7 * scale}px sans-serif`;
  ctx.font = pillFont;

  const pillWidths = stackItems.map((t) => ctx.measureText(t).width + 10 * scale);
  const maxRowW = cardW - 36 * scale;
  const rows: { items: string[]; widths: number[] }[] = [];
  let currentRow: { items: string[]; widths: number[] } = { items: [], widths: [] };
  let currentRowW = 0;

  for (let i = 0; i < stackItems.length; i++) {
    const pw = pillWidths[i] + (currentRow.items.length > 0 ? pillGap : 0);
    if (currentRowW + pw > maxRowW && currentRow.items.length > 0) {
      rows.push(currentRow);
      currentRow = { items: [], widths: [] };
      currentRowW = 0;
    }
    currentRow.items.push(stackItems[i]);
    currentRow.widths.push(pillWidths[i]);
    currentRowW += pw;
  }
  if (currentRow.items.length > 0) rows.push(currentRow);

  for (const row of rows) {
    const rowW = row.widths.reduce((a, b) => a + b, 0) + (row.widths.length - 1) * pillGap;
    let px = W / 2 - rowW / 2;
    for (let i = 0; i < row.items.length; i++) {
      const pw = row.widths[i];
      ctx.fillStyle = "#161616";
      drawSquircle(ctx, px, y - pillH / 2, pw, pillH, 4 * scale);
      ctx.fill();
      ctx.strokeStyle = "#262626";
      ctx.lineWidth = 0.8 * scale;
      drawSquircle(ctx, px, y - pillH / 2, pw, pillH, 4 * scale);
      ctx.stroke();
      ctx.fillStyle = "#737373";
      ctx.font = pillFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.items[i], px + pw / 2, y);
      px += pw + pillGap;
    }
    y += pillH + pillGap;
  }

  // Tagline
  y += 4 * scale;
  if (card.tagline) {
    ctx.font = `italic ${8 * scale}px sans-serif`;
    ctx.fillStyle = "#404040";
    ctx.textAlign = "center";
    ctx.fillText(`"${card.tagline}"`, W / 2, y);
    y += 12 * scale;
  }

  // Divider
  y += 4 * scale;
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(cardX + 28 * scale, y);
  ctx.lineTo(cardX + cardW - 28 * scale, y);
  ctx.stroke();

  // Badge ID
  y += 14 * scale;
  ctx.font = `600 ${7 * scale}px monospace`;
  ctx.fillStyle = "#333";
  ctx.textAlign = "center";
  ctx.fillText(`BADGE: ${card.badgeId || "HHG-26-0000"}`, W / 2, y);

  y += 10 * scale;
  ctx.font = `400 ${6.5 * scale}px sans-serif`;
  ctx.fillStyle = "#262626";
  ctx.fillText("GOA, INDIA  ·  2026  ·  BUILD & VIBE", W / 2, y);

  // Bottom accent
  ctx.save();
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.clip();
  ctx.fillStyle = hex(tmpl.colors.accent, 0.3);
  ctx.fillRect(cardX, cardY + cardH - barH, cardW, barH);
  ctx.restore();
}

// ── Export helper ────────────────────────────────────────────
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => { if (blob) resolve(blob); else reject(new Error("Canvas toBlob failed")); },
      "image/png", 1
    );
  });
}
