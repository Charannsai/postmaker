/* ──────────────────────────────────────────────────────────────
   Canvas Renderer – HH Goa 2026
   Pure HTML5 Canvas drawing engine for both PFP frames and
   Builder ID cards.  Renders at 2× for retina output.
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
  // convert "#rrggbb" + alpha 0-1 → "rgba(r,g,b,a)"
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

// ── PFP Frame Renderer (Format A) ───────────────────────────
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

  const tmpl = FRAME_TEMPLATES.find((t) => t.id === frame.templateId)!;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const outerR = SIZE / 2 - 4 * scale;
  const innerR = outerR - 28 * scale;
  const photoR = innerR - 4 * scale;

  // Background
  ctx.fillStyle = "#0a0d14";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Outer glow
  const glowGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR + 20 * scale);
  glowGrad.addColorStop(0, hex(tmpl.colors.glow, 0.6));
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Clip photo region
  ctx.save();
  if (frame.shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
    ctx.clip();
  } else {
    drawSquircle(ctx, cx - photoR, cy - photoR, photoR * 2, photoR * 2, 60 * scale);
    ctx.clip();
  }

  // Draw photo or placeholder
  if (img) {
    drawUserPhoto(ctx, img, photo, cx, cy, photoR);
  } else {
    const pg = ctx.createRadialGradient(cx, cy, 0, cx, cy, photoR);
    pg.addColorStop(0, "#1e2030");
    pg.addColorStop(1, "#0e1018");
    ctx.fillStyle = pg;
    ctx.fillRect(cx - photoR, cy - photoR, photoR * 2, photoR * 2);
    ctx.fillStyle = "#ffffff18";
    ctx.font = `bold ${32 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", cx, cy);
  }
  ctx.restore();

  // Frame ring
  drawFrameRing(ctx, cx, cy, innerR, outerR, tmpl, frame, scale);

  // Badge text
  if (frame.badgeEnabled && frame.badgeText) {
    drawFrameBadge(ctx, cx, cy, outerR, frame.badgeText, tmpl, scale);
  }

  // Branding watermark
  drawBranding(ctx, cx, SIZE, tmpl.colors.accent, scale);
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

function drawFrameRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  tmpl: (typeof FRAME_TEMPLATES)[0],
  frame: FrameSettings,
  scale: number
) {
  ctx.save();
  ctx.lineWidth = (outerR - innerR);

  const grad = ctx.createConicGradient(0, cx, cy);
  grad.addColorStop(0, tmpl.colors.primary);
  grad.addColorStop(0.25, tmpl.colors.secondary);
  grad.addColorStop(0.5, tmpl.colors.accent);
  grad.addColorStop(0.75, tmpl.colors.primary);
  grad.addColorStop(1, tmpl.colors.secondary);

  ctx.strokeStyle = grad;

  const midR = (innerR + outerR) / 2;
  if (frame.shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, midR, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const side = midR * 2;
    drawSquircle(ctx, cx - midR, cy - midR, side, side, 64 * scale);
    ctx.stroke();
  }

  // Inner highlight line
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeStyle = hex(tmpl.colors.accent, 0.5);
  if (frame.shape === "circle") {
    ctx.beginPath();
    ctx.arc(cx, cy, innerR + 2 * scale, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const side2 = (innerR + 2 * scale) * 2;
    drawSquircle(ctx, cx - innerR - 2 * scale, cy - innerR - 2 * scale, side2, side2, 56 * scale);
    ctx.stroke();
  }

  // Decorative dots for specific templates
  if (frame.templateId === "cyber-matrix" || frame.templateId === "holographic-foil") {
    drawDecorativeDots(ctx, cx, cy, outerR, tmpl, scale);
  }

  ctx.restore();
}

function drawDecorativeDots(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  tmpl: (typeof FRAME_TEMPLATES)[0],
  scale: number
) {
  const dotCount = 24;
  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    const dotR = outerR - 6 * scale;
    const dx = cx + Math.cos(angle) * dotR;
    const dy = cy + Math.sin(angle) * dotR;
    ctx.beginPath();
    ctx.arc(dx, dy, 2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0 ? tmpl.colors.accent : hex(tmpl.colors.primary, 0.3);
    ctx.fill();
  }
}

function drawFrameBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  text: string,
  tmpl: (typeof FRAME_TEMPLATES)[0],
  scale: number
) {
  ctx.save();
  const badgeY = cy + outerR - 20 * scale;
  const fontSize = 11 * scale;
  ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
  const metrics = ctx.measureText(text);
  const padX = 16 * scale;
  const padY = 8 * scale;
  const bw = metrics.width + padX * 2;
  const bh = fontSize + padY * 2;
  const bx = cx - bw / 2;
  const by = badgeY - bh / 2;

  // Badge background
  const badgeGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
  badgeGrad.addColorStop(0, tmpl.colors.primary);
  badgeGrad.addColorStop(1, tmpl.colors.secondary);
  ctx.fillStyle = badgeGrad;
  drawSquircle(ctx, bx, by, bw, bh, 12 * scale);
  ctx.fill();

  // Badge text
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, badgeY);
  ctx.restore();
}

function drawBranding(
  ctx: CanvasRenderingContext2D,
  cx: number,
  size: number,
  accentColor: string,
  scale: number
) {
  ctx.save();
  ctx.font = `600 ${9 * scale}px 'Inter', sans-serif`;
  ctx.fillStyle = hex(accentColor, 0.4);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("HH GOA 2026", cx, size - 8 * scale);
  ctx.restore();
}

// ── Builder ID Card Renderer (Format B) ─────────────────────
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
  const pad = 24 * scale;

  // ─ Background ─────────────────────────────────────────────
  ctx.fillStyle = tmpl.colors.bg;
  ctx.fillRect(0, 0, W, H);

  // Ambient glow
  const ambGrad = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, W * 0.7);
  ambGrad.addColorStop(0, hex(tmpl.colors.glow, 0.35));
  ambGrad.addColorStop(1, "transparent");
  ctx.fillStyle = ambGrad;
  ctx.fillRect(0, 0, W, H);

  // ─ Card body ──────────────────────────────────────────────
  const cardX = pad;
  const cardY = pad;
  const cardW = W - pad * 2;
  const cardH = H - pad * 2;
  const cardR = 20 * scale;

  // Card fill
  ctx.fillStyle = hex(tmpl.colors.card, 0.85);
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fill();

  // Card border
  ctx.strokeStyle = hex(tmpl.colors.accent, 0.3);
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.stroke();

  // ─ Top accent bar ────────────────────────────────────────
  ctx.save();
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.clip();
  const barH = 6 * scale;
  const barGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
  barGrad.addColorStop(0, tmpl.colors.accent);
  barGrad.addColorStop(0.5, tmpl.colors.text);
  barGrad.addColorStop(1, tmpl.colors.accent);
  ctx.fillStyle = barGrad;
  ctx.fillRect(cardX, cardY, cardW, barH);
  ctx.restore();

  // ─ Event header ──────────────────────────────────────────
  let y = cardY + barH + 18 * scale;
  ctx.font = `bold ${10 * scale}px 'Inter', monospace`;
  ctx.fillStyle = hex(tmpl.colors.accent, 0.7);
  ctx.textAlign = "center";
  ctx.fillText("HACKER HOUSE GOA 2026", W / 2, y);
  y += 6 * scale;
  ctx.font = `500 ${7 * scale}px 'Inter', monospace`;
  ctx.fillStyle = hex(tmpl.colors.text, 0.4);
  ctx.fillText("OFFICIAL BUILDER PASS", W / 2, y);

  // ─ Photo circle ──────────────────────────────────────────
  y += 18 * scale;
  const photoR = 48 * scale;
  const photoCX = W / 2;
  const photoCY = y + photoR;

  // Photo glow ring
  ctx.save();
  ctx.shadowColor = tmpl.colors.accent;
  ctx.shadowBlur = 20 * scale;
  ctx.beginPath();
  ctx.arc(photoCX, photoCY, photoR + 3 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = hex(tmpl.colors.accent, 0.6);
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Clip & draw photo
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, photoCX, photoCY, photoR);
  } else {
    ctx.fillStyle = hex(tmpl.colors.card, 1);
    ctx.fillRect(photoCX - photoR, photoCY - photoR, photoR * 2, photoR * 2);
    ctx.fillStyle = hex(tmpl.colors.text, 0.2);
    ctx.font = `bold ${16 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", photoCX, photoCY);
  }
  ctx.restore();

  // ─ Name ──────────────────────────────────────────────────
  y = photoCY + photoR + 20 * scale;
  ctx.font = `bold ${16 * scale}px 'Inter', sans-serif`;
  ctx.fillStyle = tmpl.colors.text;
  ctx.textAlign = "center";
  const displayName = card.name || "Your Name";
  ctx.fillText(displayName, W / 2, y);

  // ─ Fun title ──────────────────────────────────────────────
  y += 16 * scale;
  ctx.font = `italic ${9 * scale}px 'Inter', sans-serif`;
  ctx.fillStyle = tmpl.colors.accent;
  const displayTitle = card.funTitle || "10x Caffeine-to-Code Pipeline";
  ctx.fillText(`"${displayTitle}"`, W / 2, y);

  // ─ Handle & Role ──────────────────────────────────────────
  y += 16 * scale;
  ctx.font = `500 ${9 * scale}px 'Inter', monospace`;
  ctx.fillStyle = hex(tmpl.colors.text, 0.6);
  const handleText = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(`${handleText}  ·  ${card.role || "Fullstack"}`, W / 2, y);

  // ─ Tech stack pills ───────────────────────────────────────
  y += 18 * scale;
  const stackItems = card.techStack.length > 0 ? card.techStack : ["React", "Next.js", "TypeScript"];
  const pillH = 14 * scale;
  const pillGap = 5 * scale;
  const pillFont = `600 ${7 * scale}px 'Inter', sans-serif`;
  ctx.font = pillFont;

  // Measure total width to center
  const pillWidths = stackItems.map(
    (t) => ctx.measureText(t).width + 12 * scale
  );
  const totalPillW =
    pillWidths.reduce((a, b) => a + b, 0) +
    (pillWidths.length - 1) * pillGap;
  
  // Handle multi-row if too wide
  const maxRowW = cardW - 40 * scale;
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
      ctx.fillStyle = hex(tmpl.colors.accent, 0.15);
      drawSquircle(ctx, px, y - pillH / 2, pw, pillH, 6 * scale);
      ctx.fill();
      ctx.strokeStyle = hex(tmpl.colors.accent, 0.3);
      ctx.lineWidth = 1 * scale;
      drawSquircle(ctx, px, y - pillH / 2, pw, pillH, 6 * scale);
      ctx.stroke();
      ctx.fillStyle = tmpl.colors.accent;
      ctx.font = pillFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.items[i], px + pw / 2, y);
      px += pw + pillGap;
    }
    y += pillH + pillGap;
  }

  // ─ Tagline ────────────────────────────────────────────────
  y += 6 * scale;
  if (card.tagline) {
    ctx.font = `italic ${8 * scale}px 'Inter', sans-serif`;
    ctx.fillStyle = hex(tmpl.colors.text, 0.5);
    ctx.textAlign = "center";
    ctx.fillText(`"${card.tagline}"`, W / 2, y);
    y += 14 * scale;
  }

  // ─ Divider ────────────────────────────────────────────────
  y += 4 * scale;
  ctx.strokeStyle = hex(tmpl.colors.accent, 0.15);
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(cardX + 30 * scale, y);
  ctx.lineTo(cardX + cardW - 30 * scale, y);
  ctx.stroke();

  // ─ Badge ID & Event details ───────────────────────────────
  y += 16 * scale;
  ctx.font = `bold ${8 * scale}px 'Inter', monospace`;
  ctx.fillStyle = hex(tmpl.colors.accent, 0.6);
  ctx.textAlign = "center";
  ctx.fillText(`BADGE: ${card.badgeId || "HHG-26-0000"}`, W / 2, y);

  y += 12 * scale;
  ctx.font = `500 ${7 * scale}px 'Inter', sans-serif`;
  ctx.fillStyle = hex(tmpl.colors.text, 0.35);
  ctx.fillText("GOA, INDIA  ·  2026  ·  BUILD & VIBE", W / 2, y);

  // ─ Bottom accent bar ─────────────────────────────────────
  ctx.save();
  drawSquircle(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.clip();
  const botBarY = cardY + cardH - barH;
  ctx.fillStyle = barGrad;
  ctx.fillRect(cardX, botBarY, cardW, barH);
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
