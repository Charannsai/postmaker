
import type {
  PhotoState,
  FrameSettings,
  CardData,
  BackgroundStyleId,
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

// ── Film Grain ───────────────────────────────────────────────
function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number, s: number) {
  for (let i = 0; i < 1200; i++) {
    const a = Math.random() * alpha;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, s * (1 + Math.random()), s * (1 + Math.random()));
  }
}

// ── Scalloped Stamp Edges ────────────────────────────────────
function drawStampPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, tr: number
) {
  const step = tr * 3.2;
  ctx.beginPath();
  const nX = Math.floor(w / step);
  const offX = (w - nX * step) / 2;
  const nY = Math.floor(h / step);
  const offY = (h - nY * step) / 2;

  ctx.moveTo(x, y);
  for (let i = 0; i < nX; i++) {
    const tx = x + offX + i * step + step / 2;
    ctx.lineTo(tx - tr, y);
    ctx.arc(tx, y, tr, Math.PI, 0, true);
  }
  ctx.lineTo(x + w, y);
  for (let i = 0; i < nY; i++) {
    const ty = y + offY + i * step + step / 2;
    ctx.lineTo(x + w, ty - tr);
    ctx.arc(x + w, ty, tr, -Math.PI / 2, Math.PI / 2, true);
  }
  ctx.lineTo(x + w, y + h);
  for (let i = nX - 1; i >= 0; i--) {
    const tx = x + offX + i * step + step / 2;
    ctx.lineTo(tx + tr, y + h);
    ctx.arc(tx, y + h, tr, 0, Math.PI, true);
  }
  ctx.lineTo(x, y + h);
  for (let i = nY - 1; i >= 0; i--) {
    const ty = y + offY + i * step + step / 2;
    ctx.lineTo(x, ty + tr);
    ctx.arc(x, ty, tr, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.closePath();
}

// ─────────────────────────────────────────────────────────────
// DESIGN 1: RETRO MAGAZINE COVER / STAMP PFP
// Big bold text BEHIND, photo as white sticker cutout ON TOP
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

  // === 1. Deep Emerald Background ===
  ctx.fillStyle = "#063d23";
  ctx.fillRect(0, 0, W, H);

  // Radial warm glow
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, W * 0.8);
  glow.addColorStop(0, "rgba(16, 92, 54, 0.5)");
  glow.addColorStop(1, "rgba(5, 32, 18, 0.8)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  addGrain(ctx, W, H, 0.07, scale);

  // === 2. Scalloped Stamp Frame ===
  const mx = 28 * scale;
  const my = 28 * scale;
  const stampW = W - mx * 2;
  const stampH = H - my * 2;
  const tr = 5 * scale;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetY = 10 * scale;
  ctx.fillStyle = "#faf5ee";
  drawStampPath(ctx, mx, my, stampW, stampH, tr);
  ctx.fill();
  ctx.restore();

  // Clip everything inside stamp
  ctx.save();
  drawStampPath(ctx, mx, my, stampW, stampH, tr);
  ctx.clip();

  // Inner cream fill
  ctx.fillStyle = "#faf5ee";
  ctx.fillRect(mx, my, stampW, stampH);

  // === 3. MASSIVE BOLD TEXT BEHIND THE PHOTO ===
  // This is the key visual — huge chunky text filling the stamp
  const caption = frame.caption || "HH GOA";
  const words = caption.toUpperCase().split(" ").filter(w => w.length > 0);

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Calculate font size to fill the width
  let bigFontSize = 70 * scale;
  ctx.font = `900 ${bigFontSize}px 'Impact', sans-serif`;

  // Draw each word stacked, filling the frame
  const totalWords = words.length || 1;
  const lineH = bigFontSize * 1.05;
  const textBlockH = totalWords * lineH;
  const textStartY = my + stampH * 0.5 - textBlockH / 2 + lineH / 2;

  // Red shadow layer (3D depth effect like the reference)
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Auto-size each word to fill stamp width
    let wSize = bigFontSize;
    ctx.font = `900 ${wSize}px 'Impact', sans-serif`;
    while (ctx.measureText(word).width > stampW - 24 * scale && wSize > 20 * scale) {
      wSize -= 2 * scale;
      ctx.font = `900 ${wSize}px 'Impact', sans-serif`;
    }
    // Make it actually fill the width
    while (ctx.measureText(word).width < stampW - 50 * scale && wSize < 140 * scale) {
      wSize += 2 * scale;
      ctx.font = `900 ${wSize}px 'Impact', sans-serif`;
    }

    const wy = textStartY + i * lineH;

    // Red 3D shadow
    ctx.fillStyle = "#b91c1c";
    ctx.font = `900 ${wSize}px 'Impact', sans-serif`;
    ctx.fillText(word, mx + stampW / 2 + 3 * scale, wy + 3 * scale);

    // Main yellow fill
    ctx.fillStyle = "#facc15";
    ctx.fillText(word, mx + stampW / 2, wy);
  }
  ctx.restore();

  // === 4. PHOTO AS WHITE STICKER CUTOUT ON TOP ===
  // The photo sits ON TOP of the text with a thick white border
  if (img) {
    const photoW = stampW * 0.72;
    const photoH = stampH * 0.65;
    const photoCX = mx + stampW / 2;
    const photoCY = my + stampH * 0.48;

    // Thick white sticker border (the die-cut effect)
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 16 * scale;
    ctx.shadowOffsetY = 6 * scale;
    drawSquircle(ctx, photoCX - photoW / 2 - 6 * scale, photoCY - photoH / 2 - 6 * scale,
      photoW + 12 * scale, photoH + 12 * scale, 14 * scale);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    // Photo inside
    ctx.save();
    drawSquircle(ctx, photoCX - photoW / 2, photoCY - photoH / 2, photoW, photoH, 10 * scale);
    ctx.clip();
    drawUserPhoto(ctx, img, photo, photoCX, photoCY, photoW, photoH);
    ctx.restore();
  } else {
    // Placeholder
    const phW = stampW * 0.6;
    const phH = stampH * 0.5;
    const phCX = mx + stampW / 2;
    const phCY = my + stampH * 0.45;
    ctx.fillStyle = "rgba(13, 74, 43, 0.15)";
    drawSquircle(ctx, phCX - phW / 2, phCY - phH / 2, phW, phH, 12 * scale);
    ctx.fill();
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `600 ${12 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", phCX, phCY);
  }

  // === 5. Corner Number ===
  ctx.fillStyle = "#0d4a2b";
  ctx.font = `italic 900 ${24 * scale}px 'Georgia', serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("26", mx + stampW - 16 * scale, my + 14 * scale);

  // === 6. Top-Left Small Monogram ===
  ctx.fillStyle = "rgba(13, 74, 43, 0.5)";
  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("HACKER HOUSE", mx + 14 * scale, my + 14 * scale);
  ctx.fillText("GOA 2026", mx + 14 * scale, my + 24 * scale);

  // === 7. Bottom Barcode ===
  const barcodeY = my + stampH - 26 * scale;
  const barcodeX = mx + 14 * scale;
  const barcodeW = 60 * scale;
  const barH = 16 * scale;

  ctx.fillStyle = "#171717";
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2];
  let bx = barcodeX;
  for (const b of bars) {
    ctx.fillRect(bx, barcodeY, b * scale * 0.8, barH);
    bx += (b + 1.2) * scale * 0.8;
  }
  ctx.font = `500 ${5 * scale}px monospace`;
  ctx.fillText("HH-GOA-2026-PFP", barcodeX, barcodeY + barH + 4 * scale);

  // Grain over stamp
  addGrain(ctx, W, H, 0.025, scale);

  ctx.restore(); // End stamp clip
}

// ─────────────────────────────────────────────────────────────
// DESIGN 2: EVENT POSTER WITH LANYARD BADGE (Builder ID)
// Matches reference 3: textured poster bg, event title, sidebar
// info, lanyard + clip, badge card with abstract patterns,
// starburst sticker, QR code, bottom ticker
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

  // === 1. Textured Poster Background ===
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#063d23");
  bg.addColorStop(0.4, "#0a4a2d");
  bg.addColorStop(1, "#052012");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Large faded watermark letters (like reference)
  ctx.save();
  ctx.fillStyle = "rgba(250, 204, 21, 0.05)";
  ctx.font = `900 ${160 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("H", W * 0.3, H * 0.35);
  ctx.fillText("H", W * 0.7, H * 0.35);
  ctx.font = `900 ${200 * scale}px 'Impact', sans-serif`;
  ctx.fillText("G", W * 0.35, H * 0.65);
  ctx.restore();

  // Faded circular and cross geometric patterns
  ctx.save();
  ctx.strokeStyle = "rgba(250, 204, 21, 0.04)";
  ctx.lineWidth = 2 * scale;
  // Large circle
  ctx.beginPath();
  ctx.arc(W * 0.75, H * 0.2, 50 * scale, 0, Math.PI * 2);
  ctx.stroke();
  // Globe icon pattern
  ctx.beginPath();
  ctx.arc(W * 0.2, H * 0.75, 35 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.2 - 35 * scale, H * 0.75);
  ctx.lineTo(W * 0.2 + 35 * scale, H * 0.75);
  ctx.moveTo(W * 0.2, H * 0.75 - 35 * scale);
  ctx.lineTo(W * 0.2, H * 0.75 + 35 * scale);
  ctx.stroke();
  ctx.restore();

  addGrain(ctx, W, H, 0.05, scale);

  // === 2. Event Title (Top — Mixed Editorial Typography) ===
  ctx.save();
  // "HACKER" in gold
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${36 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText("HACKER", 24 * scale, 52 * scale);

  // "of" in italic white
  ctx.fillStyle = "#ffffff";
  ctx.font = `italic 500 ${18 * scale}px 'Georgia', serif`;
  ctx.fillText("of", 24 * scale, 78 * scale);

  // "GOA" in huge gold
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${52 * scale}px 'Impact', sans-serif`;
  ctx.fillText("GOA", 56 * scale, 82 * scale);

  // "House" in pink italic script
  ctx.fillStyle = "#ec4899";
  ctx.font = `italic 900 ${28 * scale}px 'Georgia', serif`;
  ctx.fillText("House", 175 * scale, 82 * scale);
  ctx.restore();

  // === 3. Starburst Logo Sticker (Top Right) ===
  const starCX = W - 56 * scale;
  const starCY = 60 * scale;
  const starR = 32 * scale;

  ctx.save();
  ctx.translate(starCX, starCY);
  ctx.rotate(0.12);

  // Drop shadow
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 10 * scale;
  ctx.shadowOffsetY = 4 * scale;

  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI) / 12 - Math.PI / 2;
    const r = i % 2 === 0 ? starR : starR * 0.78;
    const sx = Math.cos(angle) * r;
    const sy = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#072e1a";
  ctx.font = `bold ${7 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("HACKER", 0, -5 * scale);
  ctx.font = `italic 900 ${10 * scale}px 'Georgia', serif`;
  ctx.fillText("GoA", 0, 7 * scale);
  ctx.restore();

  // === 4. Event Info Sidebar (Left) ===
  let ey = 115 * scale;
  ctx.save();
  ctx.textAlign = "left";
  const lx = 24 * scale;

  ctx.fillStyle = "#facc15";
  ctx.font = `italic 900 ${13 * scale}px 'Georgia', serif`;
  ctx.fillText("Wednesday", lx, ey);

  ey += 8 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${32 * scale}px 'Impact', sans-serif`;
  ctx.fillText("13", lx, ey + 24 * scale);
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${16 * scale}px 'Impact', sans-serif`;
  ctx.fillText("AUG", lx + 40 * scale, ey + 24 * scale);
  ey += 36 * scale;

  ey += 14 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.fillText("BUILDERS", lx, ey);
  ey += 14 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.fillText("10.00 IST", lx, ey);

  ey += 18 * scale;
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.fillText("HACKERS", lx, ey);
  ey += 14 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.fillText("18.00 IST", lx, ey);

  ey += 20 * scale;
  ctx.fillStyle = "#ec4899";
  ctx.font = `italic bold ${10 * scale}px 'Georgia', serif`;
  ctx.fillText("At", lx, ey);
  ey += 14 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.fillText("GOA,", lx, ey);
  ey += 14 * scale;
  ctx.fillText("INDIA", lx, ey);
  ctx.restore();

  // === 5. Woven Lanyard + Metal Clip ===
  const badgeCX = W / 2 + 20 * scale;
  const clipY = 95 * scale;

  ctx.save();
  // Left strap
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.moveTo(badgeCX - 90 * scale, 0);
  ctx.lineTo(badgeCX - 60 * scale, 0);
  ctx.lineTo(badgeCX - 10 * scale, clipY);
  ctx.lineTo(badgeCX - 35 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Right strap
  ctx.beginPath();
  ctx.moveTo(badgeCX + 60 * scale, 0);
  ctx.lineTo(badgeCX + 90 * scale, 0);
  ctx.lineTo(badgeCX + 35 * scale, clipY);
  ctx.lineTo(badgeCX + 10 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Gold/yellow accent stripes on straps
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(badgeCX - 78 * scale, 0);
  ctx.lineTo(badgeCX - 70 * scale, 0);
  ctx.lineTo(badgeCX - 24 * scale, clipY);
  ctx.lineTo(badgeCX - 30 * scale, clipY);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(badgeCX + 70 * scale, 0);
  ctx.lineTo(badgeCX + 78 * scale, 0);
  ctx.lineTo(badgeCX + 30 * scale, clipY);
  ctx.lineTo(badgeCX + 24 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Metal clip body
  ctx.fillStyle = "#b0b8c4";
  const clipW = 32 * scale;
  const clipH = 34 * scale;
  drawSquircle(ctx, badgeCX - clipW / 2, clipY - 6 * scale, clipW, clipH, 5 * scale);
  ctx.fill();
  // Clip highlight
  ctx.fillStyle = "#d4dae2";
  ctx.fillRect(badgeCX - clipW / 2 + 3 * scale, clipY - 4 * scale, 4 * scale, clipH - 8 * scale);
  // Clip outline
  ctx.strokeStyle = "#78849a";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, badgeCX - clipW / 2, clipY - 6 * scale, clipW, clipH, 5 * scale);
  ctx.stroke();
  // Ring hole
  ctx.fillStyle = "#5a6577";
  ctx.beginPath();
  ctx.arc(badgeCX, clipY + 20 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#b0b8c4";
  ctx.beginPath();
  ctx.arc(badgeCX, clipY + 20 * scale, 3.5 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // === 6. Badge Card (White Outer Sleeve + Inner Emerald Card) ===
  const cardW = 340 * scale;
  const cardH = 420 * scale;
  const cardX = badgeCX - cardW / 2;
  const cardY = clipY + 38 * scale;

  // Outer white sleeve with shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 28 * scale;
  ctx.shadowOffsetY = 12 * scale;
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, cardX - 8 * scale, cardY - 8 * scale, cardW + 16 * scale, cardH + 16 * scale, 16 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.restore();

  // Sleeve border
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, cardX - 8 * scale, cardY - 8 * scale, cardW + 16 * scale, cardH + 16 * scale, 16 * scale);
  ctx.stroke();

  // Top punch-hole slot
  ctx.fillStyle = "#e2e8f0";
  drawSquircle(ctx, badgeCX - 24 * scale, cardY - 14 * scale, 48 * scale, 10 * scale, 5 * scale);
  ctx.fill();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1 * scale;
  drawSquircle(ctx, badgeCX - 24 * scale, cardY - 14 * scale, 48 * scale, 10 * scale, 5 * scale);
  ctx.stroke();

  // Inner card body
  ctx.save();
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 12 * scale);
  ctx.clip();

  // Emerald gradient fill
  const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  cardGrad.addColorStop(0, "#0d6b3e");
  cardGrad.addColorStop(0.3, "#0a8a4e");
  cardGrad.addColorStop(0.6, "#0d6b3e");
  cardGrad.addColorStop(1, "#074d2c");
  ctx.fillStyle = cardGrad;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Abstract wave overlay patterns (like reference)
  ctx.strokeStyle = "rgba(250, 204, 21, 0.08)";
  ctx.lineWidth = 2.5 * scale;
  for (let wy = cardY - 20 * scale; wy < cardY + cardH + 20 * scale; wy += 14 * scale) {
    ctx.beginPath();
    for (let wx = cardX; wx <= cardX + cardW; wx += 4 * scale) {
      const offset = Math.sin((wx - cardX) * 0.025 + wy * 0.01) * 12 * scale;
      if (wx === cardX) ctx.moveTo(wx, wy + offset);
      else ctx.lineTo(wx, wy + offset);
    }
    ctx.stroke();
  }

  // Larger decorative circles
  ctx.strokeStyle = "rgba(250, 204, 21, 0.06)";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(cardX + cardW * 0.82, cardY + 60 * scale, 45 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cardX + 35 * scale, cardY + cardH - 80 * scale, 35 * scale, 0, Math.PI * 2);
  ctx.stroke();

  // Globe icon (top right of card)
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1.5 * scale;
  const gx = cardX + cardW - 40 * scale;
  const gy = cardY + 40 * scale;
  ctx.beginPath();
  ctx.arc(gx, gy, 14 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(gx - 14 * scale, gy);
  ctx.lineTo(gx + 14 * scale, gy);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(gx, gy, 7 * scale, 14 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();

  // === Header Bar ===
  const hdrH = 26 * scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(cardX, cardY, cardW, hdrH);

  ctx.fillStyle = "#facc15";
  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("HACKER", cardX + 12 * scale, cardY + 17 * scale);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = `900 ${8 * scale}px sans-serif`;
  ctx.fillText("BUILDERS", cardX + cardW / 2, cardY + 17 * scale);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `bold ${7 * scale}px monospace`;
  ctx.textAlign = "right";
  ctx.fillText("IN GOA", cardX + cardW - 12 * scale, cardY + 11 * scale);
  ctx.fillText("2026", cardX + cardW - 12 * scale, cardY + 22 * scale);

  // Small icons in header
  ctx.strokeStyle = "rgba(250, 204, 21, 0.6)";
  ctx.lineWidth = 1 * scale;
  [cardX + cardW * 0.3, cardX + cardW * 0.6].forEach(ix => {
    ctx.beginPath();
    ctx.arc(ix, cardY + 13 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ix - 3 * scale, cardY + 13 * scale);
    ctx.lineTo(ix + 3 * scale, cardY + 13 * scale);
    ctx.moveTo(ix, cardY + 10 * scale);
    ctx.lineTo(ix, cardY + 16 * scale);
    ctx.stroke();
  });

  // === Photo Window ===
  const pW = cardW - 40 * scale;
  const pH = pW * 0.78;
  const pX = cardX + 20 * scale;
  const pY = cardY + hdrH + 16 * scale;

  // White photo border
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, pX - 5 * scale, pY - 5 * scale, pW + 10 * scale, pH + 10 * scale, 10 * scale);
  ctx.fill();

  ctx.save();
  drawSquircle(ctx, pX, pY, pW, pH, 7 * scale);
  ctx.clip();
  if (img) {
    drawUserPhoto(ctx, img, photo, pX + pW / 2, pY + pH / 2, pW, pH);
  } else {
    const pg = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
    pg.addColorStop(0, "#1e40af");
    pg.addColorStop(1, "#0d6b3e");
    ctx.fillStyle = pg;
    ctx.fillRect(pX, pY, pW, pH);

    // Abstract swirl pattern in placeholder
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 3 * scale;
    for (let sw = pY; sw < pY + pH; sw += 20 * scale) {
      ctx.beginPath();
      for (let sx = pX; sx < pX + pW; sx += 4 * scale) {
        const sy = sw + Math.sin((sx - pX) * 0.03 + sw * 0.02) * 15 * scale;
        if (sx === pX) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `600 ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload Photo", pX + pW / 2, pY + pH / 2);
  }
  ctx.restore();

  // === Attendee Info ===
  let ty = pY + pH + 20 * scale;

  // Role tag
  ctx.fillStyle = "#facc15";
  ctx.font = `italic bold ${8 * scale}px 'Georgia', serif`;
  ctx.textAlign = "left";
  ctx.fillText((card.role || "FULLSTACK").toUpperCase(), cardX + 20 * scale, ty);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(254,252,232,0.5)";
  ctx.font = `500 ${8 * scale}px monospace`;
  const handle = card.handle ? `@${card.handle.replace("@", "")}` : "@handle";
  ctx.fillText(handle, cardX + cardW - 20 * scale, ty);

  // Big name
  ty += 24 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${22 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(card.name || "YOUR NAME", cardX + cardW / 2, ty);

  // Fun title
  ty += 18 * scale;
  ctx.fillStyle = "rgba(254,252,232,0.45)";
  ctx.font = `italic ${8 * scale}px 'Georgia', serif`;
  ctx.fillText(card.funTitle || "Everything intentional. Shipping in Goa.", cardX + cardW / 2, ty);

  // Tech stack pills
  ty += 16 * scale;
  const stack = card.techStack?.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  ctx.font = `bold ${7 * scale}px sans-serif`;
  const widths = stack.slice(0, 4).map(t => ctx.measureText(t).width + 12 * scale);
  const total = widths.reduce((a, b) => a + b, 0) + (widths.length - 1) * 4 * scale;
  let sx = cardX + (cardW - total) / 2;
  for (let i = 0; i < Math.min(stack.length, 4); i++) {
    const pw = widths[i];
    ctx.fillStyle = "rgba(250, 204, 21, 0.2)";
    drawSquircle(ctx, sx, ty - 9 * scale, pw, 14 * scale, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#facc15";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, ty);
    sx += pw + 4 * scale;
  }
  ctx.textBaseline = "alphabetic";

  ctx.restore(); // End card clip

  // === QR Code (Bottom Right of Card) ===
  const qrS = 50 * scale;
  const qrX = cardX + cardW - qrS - 16 * scale;
  const qrY = cardY + cardH - qrS - 12 * scale;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qrX - 4 * scale, qrY - 4 * scale, qrS + 8 * scale, qrS + 8 * scale);

  const cs = 4 * scale;
  const gn = Math.floor(qrS / cs);
  // Seeded pseudo-random for consistent look
  let seed = 42;
  const seededRand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let gx = 0; gx < gn; gx++) {
    for (let gy = 0; gy < gn; gy++) {
      if (seededRand() > 0.42) {
        ctx.fillStyle = "#171717";
        ctx.fillRect(qrX + gx * cs, qrY + gy * cs, cs - 0.5 * scale, cs - 0.5 * scale);
      }
    }
  }
  // Finder patterns
  [[qrX, qrY], [qrX + qrS - 12 * scale, qrY], [qrX, qrY + qrS - 12 * scale]].forEach(([fx, fy]) => {
    ctx.fillStyle = "#171717";
    ctx.fillRect(fx, fy, 12 * scale, 12 * scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(fx + 2 * scale, fy + 2 * scale, 8 * scale, 8 * scale);
    ctx.fillStyle = "#171717";
    ctx.fillRect(fx + 4 * scale, fy + 4 * scale, 4 * scale, 4 * scale);
  });

  // === Small Info Below Card ===
  ctx.fillStyle = "rgba(254,252,232,0.3)";
  ctx.font = `500 ${6.5 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(
    "PASS NO. " + (card.badgeId || "HHG-26-0000") + " // EVERYTHING INTENTIONAL // GOA, INDIA",
    W / 2,
    cardY + cardH + 30 * scale
  );

  // === Bottom Ticker Tape ===
  const tickerH = 24 * scale;
  const tickerY = H - tickerH;

  ctx.fillStyle = "#facc15";
  ctx.fillRect(0, tickerY, W, tickerH);

  ctx.fillStyle = "#072e1a";
  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const tickerText = "+ Hacker House Goa 2026 + Hacker House Goa 2026 ";
  let tx = 0;
  while (tx < W + 300 * scale) {
    ctx.fillText(tickerText, tx, tickerY + tickerH / 2);
    tx += ctx.measureText(tickerText).width;
  }
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
