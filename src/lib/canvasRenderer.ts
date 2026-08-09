/* ──────────────────────────────────────────────────────────────
   Canvas Engine – HH Goa 2026
   Design 1 (PFP): Retro Postage Stamp with scalloped edges,
       deep emerald background, bold retro block text.
   Design 2 (Builder ID): Woven Lanyard Conference Badge on
       textured event poster with starburst sticker & ticker tape.
   ────────────────────────────────────────────────────────────── */

import type {
  PhotoState,
  FrameSettings,
  CardData,
  BackgroundStyleId,
  CaptionStyleId,
} from "@/types";
import { getFilterCss } from "./templates";

// ── Utility ──────────────────────────────────────────────────
function drawSquircle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
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

function drawUserPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  photo: PhotoState,
  cx: number, cy: number, targetW: number, targetH: number
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
  if (imgAspect > targetAspect) { dh = targetH * zoom; dw = dh * imgAspect; }
  else { dw = targetW * zoom; dh = dw / imgAspect; }
  ctx.drawImage(img, -dw / 2 + photo.offsetX * zoom, -dh / 2 + photo.offsetY * zoom, dw, dh);
  ctx.filter = "none";
  ctx.restore();
}

// ── Scalloped Perforated Stamp Path ──────────────────────────
function drawPerforatedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, toothR: number
) {
  const step = toothR * 3.2;
  ctx.beginPath();

  // Top edge
  const nTop = Math.floor(w / step);
  const offTop = (w - nTop * step) / 2;
  ctx.moveTo(x, y);
  for (let i = 0; i < nTop; i++) {
    const tx = x + offTop + i * step + step / 2;
    ctx.lineTo(tx - toothR, y);
    ctx.arc(tx, y, toothR, Math.PI, 0, true);
  }
  ctx.lineTo(x + w, y);

  // Right edge
  const nRight = Math.floor(h / step);
  const offRight = (h - nRight * step) / 2;
  for (let i = 0; i < nRight; i++) {
    const ty = y + offRight + i * step + step / 2;
    ctx.lineTo(x + w, ty - toothR);
    ctx.arc(x + w, ty, toothR, -Math.PI / 2, Math.PI / 2, true);
  }
  ctx.lineTo(x + w, y + h);

  // Bottom edge
  for (let i = nTop - 1; i >= 0; i--) {
    const tx = x + offTop + i * step + step / 2;
    ctx.lineTo(tx + toothR, y + h);
    ctx.arc(tx, y + h, toothR, 0, Math.PI, true);
  }
  ctx.lineTo(x, y + h);

  // Left edge
  for (let i = nRight - 1; i >= 0; i--) {
    const ty = y + offRight + i * step + step / 2;
    ctx.lineTo(x, ty + toothR);
    ctx.arc(x, ty, toothR, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.closePath();
}

// ── Noise Grain Texture ──────────────────────────────────────
function addGrainTexture(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number, scale: number) {
  for (let i = 0; i < 800; i++) {
    const gx = Math.random() * w;
    const gy = Math.random() * h;
    const ga = Math.random() * alpha;
    ctx.fillStyle = Math.random() > 0.5
      ? `rgba(255,255,255,${ga})`
      : `rgba(0,0,0,${ga})`;
    ctx.fillRect(gx, gy, scale * (1 + Math.random()), scale * (1 + Math.random()));
  }
}

// ─────────────────────────────────────────────────────────────
// DESIGN 1: RETRO POSTAGE STAMP PFP
// (Reference: Deep colored bg, scalloped edges, cream border,
//  photo fills stamp, bold retro text, corner number)
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
  if (frame.aspectRatio === "1:1") { W = 512 * scale; H = 512 * scale; }
  else if (frame.aspectRatio === "9:16") { W = 450 * scale; H = 800 * scale; }

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // === 1. Deep Rich Background Fill ===
  const bgColor = "#0d4a2b"; // Deep Goa emerald
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial vignette to add depth
  const vig = ctx.createRadialGradient(W / 2, H * 0.45, W * 0.2, W / 2, H * 0.45, W * 0.9);
  vig.addColorStop(0, "rgba(16, 92, 54, 0.4)");
  vig.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Film grain on background
  addGrainTexture(ctx, W, H, 0.06, scale);

  // === 2. Scalloped Stamp Shape (Cream/Off-White) ===
  const stampMarginX = 36 * scale;
  const stampMarginTop = 36 * scale;
  const stampMarginBottom = 36 * scale;
  const stampW = W - stampMarginX * 2;
  const stampH = H - stampMarginTop - stampMarginBottom;
  const stampX = stampMarginX;
  const stampY = stampMarginTop;
  const toothR = 5.5 * scale;

  // Stamp drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 20 * scale;
  ctx.shadowOffsetY = 8 * scale;

  ctx.fillStyle = "#faf5ee"; // Cream/off-white stamp paper
  drawPerforatedRect(ctx, stampX, stampY, stampW, stampH, toothR);
  ctx.fill();
  ctx.restore();

  // === 3. Inner Photo Area (With Cream Border) ===
  const innerMargin = 16 * scale;
  const photoX = stampX + innerMargin;
  const photoY = stampY + innerMargin;
  const photoW = stampW - innerMargin * 2;
  // Leave room at the bottom for the bold text
  const textBlockH = 80 * scale;
  const photoH = stampH - innerMargin * 2 - textBlockH;

  // Photo background
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Draw user photo
  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, photoX + photoW / 2, photoY + photoH / 2, photoW, photoH);
  } else {
    // Placeholder gradient
    const grad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
    grad.addColorStop(0, "#0a3820");
    grad.addColorStop(1, "#08331e");
    ctx.fillStyle = grad;
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = "rgba(250, 204, 21, 0.3)";
    ctx.font = `600 ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", photoX + photoW / 2, photoY + photoH / 2);
  }
  ctx.restore();

  // === 4. Corner Number (Top-Right of Stamp) ===
  ctx.save();
  ctx.fillStyle = "#c53030"; // Deep red like the stamp reference
  ctx.font = `italic 900 ${22 * scale}px 'Georgia', serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("26", stampX + stampW - innerMargin - 4 * scale, stampY + innerMargin + 4 * scale);
  ctx.restore();

  // === 5. Small Top-Left Monogram / Logo ===
  ctx.save();
  ctx.fillStyle = "rgba(13, 74, 43, 0.6)";
  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("HACKER", stampX + innerMargin + 4 * scale, stampY + innerMargin + 4 * scale);
  ctx.fillText("HOUSE", stampX + innerMargin + 4 * scale, stampY + innerMargin + 14 * scale);
  ctx.fillText("GOA", stampX + innerMargin + 4 * scale, stampY + innerMargin + 24 * scale);
  ctx.restore();

  // === 6. Bold Retro Block Text at Bottom of Stamp ===
  const textY = photoY + photoH + 6 * scale;
  const textAreaH = stampH - innerMargin - (textY - stampY);
  const textCenterY = textY + textAreaH / 2;
  const captionText = frame.caption || "HH GOA";

  ctx.save();
  // Determine font size to fit width
  let fontSize = 42 * scale;
  ctx.font = `900 ${fontSize}px 'Impact', sans-serif`;
  while (ctx.measureText(captionText.toUpperCase()).width > photoW - 10 * scale && fontSize > 16 * scale) {
    fontSize -= 2 * scale;
    ctx.font = `900 ${fontSize}px 'Impact', sans-serif`;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Yellow fill with slight 3D depth (red outline behind)
  // Red shadow/outline layer
  ctx.fillStyle = "#c53030";
  ctx.fillText(captionText.toUpperCase(), stampX + stampW / 2 + 2 * scale, textCenterY + 2 * scale);

  // Main yellow fill
  ctx.fillStyle = "#facc15";
  ctx.fillText(captionText.toUpperCase(), stampX + stampW / 2, textCenterY);

  ctx.restore();

  // === 7. Subtle Film Grain Over Stamp ===
  ctx.save();
  ctx.beginPath();
  drawPerforatedRect(ctx, stampX, stampY, stampW, stampH, toothR);
  ctx.clip();
  addGrainTexture(ctx, W, H, 0.03, scale);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// DESIGN 2: LANYARD CONFERENCE BADGE EVENT POSTER (Builder ID)
// (Reference: Textured event poster bg, woven lanyard + metal clip,
//  badge card with gradient + geometric patterns, photo, starburst
//  logo sticker, attendee info, bottom ticker tape)
// ─────────────────────────────────────────────────────────────
export function renderBuilderCard(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  scale: number = 2
) {
  const W = 480 * scale;
  const H = 850 * scale;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // === 1. Textured Event Poster Background ===
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#063d23");
  bgGrad.addColorStop(0.5, "#0d4a2b");
  bgGrad.addColorStop(1, "#072e1a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Large faded watermark event text behind everything
  ctx.save();
  ctx.fillStyle = "rgba(250, 204, 21, 0.06)";
  ctx.font = `900 ${120 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("HH", W / 2 - 20 * scale, H * 0.25);
  ctx.fillText("GOA", W / 2 + 30 * scale, H * 0.45);
  ctx.restore();

  // Faded geometric circles
  ctx.save();
  ctx.strokeStyle = "rgba(250, 204, 21, 0.05)";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(W * 0.8, H * 0.15, 60 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W * 0.2, H * 0.7, 45 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Film grain
  addGrainTexture(ctx, W, H, 0.04, scale);

  // === 2. Event Title (Top of Poster) ===
  ctx.save();
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${28 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("HACKER", W / 2, 50 * scale);

  ctx.fillStyle = "#ffffff";
  ctx.font = `italic 600 ${16 * scale}px 'Georgia', serif`;
  ctx.fillText("of", W / 2 - 60 * scale, 72 * scale);

  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${40 * scale}px 'Impact', sans-serif`;
  ctx.fillText("GOA", W / 2 + 10 * scale, 78 * scale);

  ctx.fillStyle = "#ec4899";
  ctx.font = `italic 900 ${22 * scale}px 'Georgia', serif`;
  ctx.fillText("House", W / 2 + 70 * scale, 78 * scale);
  ctx.restore();

  // === 3. Event Details (Left side) ===
  let ey = 120 * scale;
  ctx.save();
  ctx.textAlign = "left";
  const leftX = 28 * scale;

  ctx.fillStyle = "#facc15";
  ctx.font = `italic 900 ${14 * scale}px 'Georgia', serif`;
  ctx.fillText("Wednesday", leftX, ey);

  ey += 22 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${28 * scale}px 'Impact', sans-serif`;
  ctx.fillText("13 AUG", leftX, ey);

  ey += 20 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${12 * scale}px 'Impact', sans-serif`;
  ctx.fillText("BUILDERS", leftX, ey);

  ey += 16 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${10 * scale}px monospace`;
  ctx.fillText("10.00 IST", leftX, ey);

  ey += 24 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${12 * scale}px 'Impact', sans-serif`;
  ctx.fillText("HACKERS", leftX, ey);

  ey += 16 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${10 * scale}px monospace`;
  ctx.fillText("18.00 IST", leftX, ey);

  ey += 24 * scale;
  ctx.fillStyle = "#ec4899";
  ctx.font = `italic bold ${10 * scale}px 'Georgia', serif`;
  ctx.fillText("At", leftX, ey);
  ey += 14 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${12 * scale}px 'Impact', sans-serif`;
  ctx.fillText("GOA, INDIA", leftX, ey);

  ctx.restore();

  // === 4. Starburst Logo Sticker (Top Right) ===
  const starX = W - 70 * scale;
  const starY = 115 * scale;
  const starR = 34 * scale;

  ctx.save();
  ctx.translate(starX, starY);
  ctx.rotate(0.15);

  // Starburst shape
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  const spikes = 12;
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? starR : starR * 0.72;
    const sx = Math.cos(angle) * r;
    const sy = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();

  // Text inside starburst
  ctx.fillStyle = "#072e1a";
  ctx.font = `900 ${7 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("HACKER", 0, -4 * scale);
  ctx.font = `italic 900 ${9 * scale}px 'Georgia', serif`;
  ctx.fillText("GoA", 0, 8 * scale);
  ctx.restore();

  // === 5. Woven Lanyard Strap & Metal Clip ===
  const badgeCX = W / 2 + 5 * scale;
  const clipY = 100 * scale;

  ctx.save();
  // Left strap arm
  ctx.fillStyle = "#171717";
  ctx.beginPath();
  ctx.moveTo(badgeCX - 80 * scale, 0);
  ctx.lineTo(badgeCX - 55 * scale, 0);
  ctx.lineTo(badgeCX - 8 * scale, clipY);
  ctx.lineTo(badgeCX - 30 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Right strap arm
  ctx.beginPath();
  ctx.moveTo(badgeCX + 55 * scale, 0);
  ctx.lineTo(badgeCX + 80 * scale, 0);
  ctx.lineTo(badgeCX + 30 * scale, clipY);
  ctx.lineTo(badgeCX + 8 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Lanyard text
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.font = `bold ${6 * scale}px monospace`;
  ctx.save();
  ctx.translate(badgeCX - 60 * scale, 40 * scale);
  ctx.rotate(0.85);
  ctx.fillText("+ HH GOA 2026 +", 0, 0);
  ctx.restore();

  // Two-tone stripe on straps
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(badgeCX - 72 * scale, 0);
  ctx.lineTo(badgeCX - 65 * scale, 0);
  ctx.lineTo(badgeCX - 22 * scale, clipY);
  ctx.lineTo(badgeCX - 26 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(badgeCX + 65 * scale, 0);
  ctx.lineTo(badgeCX + 72 * scale, 0);
  ctx.lineTo(badgeCX + 26 * scale, clipY);
  ctx.lineTo(badgeCX + 22 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Metal Clip
  ctx.fillStyle = "#94a3b8";
  drawSquircle(ctx, badgeCX - 14 * scale, clipY - 4 * scale, 28 * scale, 30 * scale, 4 * scale);
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, badgeCX - 14 * scale, clipY - 4 * scale, 28 * scale, 30 * scale, 4 * scale);
  ctx.stroke();

  // Clip ring hole
  ctx.fillStyle = "#475569";
  ctx.beginPath();
  ctx.arc(badgeCX, clipY + 18 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.arc(badgeCX, clipY + 18 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // === 6. Badge Card ===
  const cardW = W - 55 * scale;
  const cardH = 420 * scale;
  const cardX = (W - cardW) / 2;
  const cardY = clipY + 36 * scale;

  // Card shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 10 * scale;

  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 14 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.restore();

  // Card inner body gradient (Goa emerald/teal)
  const cardInnerMargin = 6 * scale;
  const innerX = cardX + cardInnerMargin;
  const innerY = cardY + cardInnerMargin;
  const innerW = cardW - cardInnerMargin * 2;
  const innerH = cardH - cardInnerMargin * 2;

  ctx.save();
  drawSquircle(ctx, innerX, innerY, innerW, innerH, 10 * scale);
  ctx.clip();

  const cardGrad = ctx.createLinearGradient(innerX, innerY, innerX + innerW, innerY + innerH);
  cardGrad.addColorStop(0, "#0d4a2b");
  cardGrad.addColorStop(0.5, "#105c36");
  cardGrad.addColorStop(1, "#0a3820");
  ctx.fillStyle = cardGrad;
  ctx.fillRect(innerX, innerY, innerW, innerH);

  // Geometric wave pattern inside card
  ctx.strokeStyle = "rgba(250, 204, 21, 0.08)";
  ctx.lineWidth = 2 * scale;
  for (let wy = innerY; wy < innerY + innerH; wy += 18 * scale) {
    ctx.beginPath();
    for (let wx = innerX; wx < innerX + innerW; wx += 6 * scale) {
      const y = wy + Math.sin((wx - innerX) * 0.04) * 8 * scale;
      if (wx === innerX) ctx.moveTo(wx, y);
      else ctx.lineTo(wx, y);
    }
    ctx.stroke();
  }

  // Circular pattern overlays
  ctx.strokeStyle = "rgba(250, 204, 21, 0.06)";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.arc(innerX + innerW * 0.8, innerY + 40 * scale, 40 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(innerX + 30 * scale, innerY + innerH - 60 * scale, 30 * scale, 0, Math.PI * 2);
  ctx.stroke();

  // === 7. Card Header Bar ===
  const headerH = 28 * scale;
  ctx.fillStyle = "rgba(250, 204, 21, 0.15)";
  ctx.fillRect(innerX, innerY, innerW, headerH);

  ctx.fillStyle = "#facc15";
  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("HACKER HOUSE", innerX + 10 * scale, innerY + 18 * scale);

  ctx.textAlign = "center";
  ctx.fillText("BUILDERS", innerX + innerW / 2, innerY + 18 * scale);

  ctx.textAlign = "right";
  ctx.fillText("GOA 2026", innerX + innerW - 10 * scale, innerY + 18 * scale);

  // Small circle icons in header
  ctx.strokeStyle = "rgba(250, 204, 21, 0.5)";
  ctx.lineWidth = 1 * scale;
  const iconY = innerY + 14 * scale;
  [innerX + innerW * 0.3, innerX + innerW * 0.7].forEach(ix => {
    ctx.beginPath();
    ctx.arc(ix, iconY, 5 * scale, 0, Math.PI * 2);
    ctx.stroke();
    // Cross inside
    ctx.beginPath();
    ctx.moveTo(ix - 3 * scale, iconY);
    ctx.lineTo(ix + 3 * scale, iconY);
    ctx.moveTo(ix, iconY - 3 * scale);
    ctx.lineTo(ix, iconY + 3 * scale);
    ctx.stroke();
  });

  // === 8. Photo Window ===
  const pW = innerW - 36 * scale;
  const pH = pW * 0.85;
  const pX = innerX + 18 * scale;
  const pY = innerY + headerH + 14 * scale;

  // White border around photo
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, pX - 4 * scale, pY - 4 * scale, pW + 8 * scale, pH + 8 * scale, 8 * scale);
  ctx.fill();

  ctx.save();
  drawSquircle(ctx, pX, pY, pW, pH, 6 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, pX + pW / 2, pY + pH / 2, pW, pH);
  } else {
    const pGrad = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
    pGrad.addColorStop(0, "#1e40af");
    pGrad.addColorStop(1, "#0d4a2b");
    ctx.fillStyle = pGrad;
    ctx.fillRect(pX, pY, pW, pH);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = `600 ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", pX + pW / 2, pY + pH / 2);
  }
  ctx.restore();

  // === 9. Attendee Info Below Photo ===
  let ty = pY + pH + 22 * scale;

  ctx.fillStyle = "#facc15";
  ctx.font = `italic bold ${9 * scale}px 'Georgia', serif`;
  ctx.textAlign = "left";
  ctx.fillText(card.role?.toUpperCase() || "FULLSTACK", innerX + 18 * scale, ty);

  ctx.textAlign = "right";
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillStyle = "rgba(254, 252, 232, 0.6)";
  ctx.font = `500 ${8 * scale}px monospace`;
  ctx.fillText(handle, innerX + innerW - 18 * scale, ty);

  ty += 24 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${20 * scale}px sans-serif`;
  ctx.textAlign = "center";
  const displayName = card.name || "YOUR NAME";
  ctx.fillText(displayName, innerX + innerW / 2, ty);

  // Tagline / fun title
  ty += 20 * scale;
  ctx.fillStyle = "rgba(254, 252, 232, 0.5)";
  ctx.font = `italic ${8 * scale}px 'Georgia', serif`;
  ctx.fillText(card.funTitle || "10X BUILDER", innerX + innerW / 2, ty);

  // Tech stack pills
  ty += 18 * scale;
  const stack = card.techStack?.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  ctx.font = `bold ${7 * scale}px sans-serif`;
  const pillWidths = stack.slice(0, 4).map(t => ctx.measureText(t).width + 12 * scale);
  const totalPillW = pillWidths.reduce((a, b) => a + b, 0) + (pillWidths.length - 1) * 4 * scale;
  let sx = innerX + (innerW - totalPillW) / 2;
  for (let i = 0; i < Math.min(stack.length, 4); i++) {
    const pw = pillWidths[i];
    ctx.fillStyle = "rgba(250, 204, 21, 0.2)";
    drawSquircle(ctx, sx, ty - 9 * scale, pw, 14 * scale, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#facc15";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, ty);
    sx += pw + 4 * scale;
  }

  ctx.restore(); // End card clip

  // === 10. QR-style Barcode Block (Bottom Right of Card) ===
  const qrSize = 48 * scale;
  const qrX = cardX + cardW - qrSize - 18 * scale;
  const qrY = cardY + cardH - qrSize - 14 * scale;

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qrX - 4 * scale, qrY - 4 * scale, qrSize + 8 * scale, qrSize + 8 * scale);

  // Generate a fake QR-like pattern
  const cellSize = 4 * scale;
  const gridN = Math.floor(qrSize / cellSize);
  for (let gx = 0; gx < gridN; gx++) {
    for (let gy = 0; gy < gridN; gy++) {
      if (Math.random() > 0.45) {
        ctx.fillStyle = "#171717";
        ctx.fillRect(qrX + gx * cellSize, qrY + gy * cellSize, cellSize - 0.5 * scale, cellSize - 0.5 * scale);
      }
    }
  }
  // Corner finder patterns
  [
    [qrX, qrY],
    [qrX + qrSize - 12 * scale, qrY],
    [qrX, qrY + qrSize - 12 * scale],
  ].forEach(([fx, fy]) => {
    ctx.fillStyle = "#171717";
    ctx.fillRect(fx, fy, 12 * scale, 12 * scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(fx + 2 * scale, fy + 2 * scale, 8 * scale, 8 * scale);
    ctx.fillStyle = "#171717";
    ctx.fillRect(fx + 4 * scale, fy + 4 * scale, 4 * scale, 4 * scale);
  });
  ctx.restore();

  // === 11. Bottom Ticker Tape ===
  const tickerY = H - 22 * scale;
  const tickerH = 22 * scale;

  ctx.save();
  ctx.fillStyle = "#facc15";
  ctx.fillRect(0, tickerY, W, tickerH);

  ctx.fillStyle = "#072e1a";
  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const tickerText = "+ Hacker House Goa 2026 ";
  let tx = 0;
  while (tx < W + 200 * scale) {
    ctx.fillText(tickerText, tx, tickerY + tickerH / 2);
    tx += ctx.measureText(tickerText).width;
  }
  ctx.restore();

  // === 12. Bottom Info Text (Above Ticker) ===
  ctx.save();
  ctx.fillStyle = "rgba(254, 252, 232, 0.4)";
  ctx.font = `500 ${7 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(
    "PASS NO. " + (card.badgeId || "HHG-26-0000") + " · GOA, INDIA · EVERYTHING INTENTIONAL",
    W / 2,
    tickerY - 12 * scale
  );
  ctx.restore();
}

// ── Export ────────────────────────────────────────────────────
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => { if (blob) resolve(blob); else reject(new Error("Canvas toBlob failed")); },
      "image/png", 1
    );
  });
}
