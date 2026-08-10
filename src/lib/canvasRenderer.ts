
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

  // === 3. PHOTO STICKER CUTOUT (Die-cut card frame in center) ===
  const photoW = stampW * 0.58;
  const photoH = stampH * 0.50;
  const photoCX = mx + stampW / 2;
  const photoCY = my + stampH * 0.53;

  if (img) {
    // Thick white sticker border (die-cut effect)
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 16 * scale;
    ctx.shadowOffsetY = 6 * scale;
    drawSquircle(
      ctx,
      photoCX - photoW / 2 - 6 * scale,
      photoCY - photoH / 2 - 6 * scale,
      photoW + 12 * scale,
      photoH + 12 * scale,
      14 * scale
    );
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
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 12 * scale;
    ctx.shadowOffsetY = 4 * scale;
    drawSquircle(
      ctx,
      photoCX - photoW / 2 - 6 * scale,
      photoCY - photoH / 2 - 6 * scale,
      photoW + 12 * scale,
      photoH + 12 * scale,
      14 * scale
    );
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(13, 74, 43, 0.08)";
    drawSquircle(ctx, photoCX - photoW / 2, photoCY - photoH / 2, photoW, photoH, 10 * scale);
    ctx.fill();

    ctx.fillStyle = "#737373";
    ctx.font = `600 ${13 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to upload photo", photoCX, photoCY);
  }

  // === 4. MASSIVE BOLD STAMP TEXT (PROMINENT & UN-COVERED) ===
  const caption = (frame.caption || "HH GOA").trim();
  const words = caption.toUpperCase().split(/\s+/).filter((w) => w.length > 0);

  let topText = "";
  let bottomText = "";

  if (words.length >= 2) {
    const mid = Math.ceil(words.length / 2);
    topText = words.slice(0, mid).join(" ");
    bottomText = words.slice(mid).join(" ");
  } else if (words.length === 1) {
    topText = words[0];
    bottomText = frame.subcaption ? frame.subcaption.toUpperCase() : "GOA 2026";
  } else {
    topText = "HH";
    bottomText = "GOA";
  }

  const drawBoldTextLine = (text: string, cy: number) => {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let fontSize = 68 * scale;
    ctx.font = `900 ${fontSize}px 'Impact', sans-serif`;

    const maxW = stampW - 32 * scale;
    while (ctx.measureText(text).width > maxW && fontSize > 20 * scale) {
      fontSize -= 2 * scale;
      ctx.font = `900 ${fontSize}px 'Impact', sans-serif`;
    }
    while (ctx.measureText(text).width < maxW * 0.7 && fontSize < 110 * scale) {
      fontSize += 2 * scale;
      ctx.font = `900 ${fontSize}px 'Impact', sans-serif`;
    }

    const cx = mx + stampW / 2;

    // Dark outline stroke for crisp contrast pop
    ctx.strokeStyle = "#052012";
    ctx.lineWidth = 4 * scale;
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2;
    ctx.strokeText(text, cx + 3 * scale, cy + 3 * scale);

    // Deep Red 3D Shadow
    ctx.fillStyle = "#b91c1c";
    ctx.font = `900 ${fontSize}px 'Impact', sans-serif`;
    ctx.fillText(text, cx + 3 * scale, cy + 3 * scale);

    // Main Yellow Fill
    ctx.fillStyle = "#facc15";
    ctx.fillText(text, cx, cy);

    ctx.restore();
  };

  // Top header text line (Y ~ 20% of stamp height)
  drawBoldTextLine(topText, my + stampH * 0.2);

  // Bottom text line (Y ~ 84% of stamp height)
  drawBoldTextLine(bottomText, my + stampH * 0.84);

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

  // === 8. Active Stamps & Scribble Stickers ===
  const activeStickers = frame.stickers || [];
  if (activeStickers.includes("postmark")) {
    drawRubberPostmark(ctx, mx + stampW - 75 * scale, my + 65 * scale, scale);
  }
  if (activeStickers.includes("approved-stamp")) {
    drawApprovedStamp(ctx, mx + 75 * scale, my + stampH * 0.72, "APPROVED FOR GOA", scale);
  }
  if (activeStickers.includes("goa-sunset-stamp")) {
    drawGoaSunsetStamp(ctx, mx + 55 * scale, my + 55 * scale, scale);
  }
  if (activeStickers.includes("gold-starburst")) {
    drawGoldStarburst(ctx, mx + stampW - 55 * scale, my + stampH * 0.74, 28 * scale, scale);
  }
  if (activeStickers.includes("scribble-doodles")) {
    drawScribblesAndDoodles(ctx, W, H, "pfp-frame", scale);
  }

  // Grain over stamp
  addGrain(ctx, W, H, 0.025, scale);

  ctx.restore(); // End stamp clip
}


// ── Scribble & Stamp Helpers ─────────────────────────────────
function drawRubberPostmark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.14);

  ctx.strokeStyle = "rgba(185, 28, 28, 0.85)";
  ctx.lineWidth = 2.5 * scale;

  ctx.beginPath();
  ctx.arc(0, 0, 36 * scale, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 31 * scale, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(185, 28, 28, 0.9)";
  ctx.font = `bold ${6.5 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AIR MAIL · GOA", 0, -10 * scale);
  ctx.font = `900 ${11 * scale}px 'Impact', sans-serif`;
  ctx.fillText("AUG 2026", 0, 2 * scale);
  ctx.font = `bold ${5.5 * scale}px monospace`;
  ctx.fillText("POSTAL SERVICE", 0, 13 * scale);

  // Wavy cancellation lines extending out
  ctx.beginPath();
  for (let wave = -20 * scale; wave <= 20 * scale; wave += 10 * scale) {
    ctx.moveTo(38 * scale, wave);
    for (let x = 38 * scale; x <= 105 * scale; x += 4 * scale) {
      const y = wave + Math.sin((x - 38 * scale) * 0.1) * 3 * scale;
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.restore();
}

function drawApprovedStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  text: string,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.16);

  const stampW = 126 * scale;
  const stampH = 36 * scale;

  ctx.strokeStyle = "rgba(220, 38, 38, 0.85)";
  ctx.lineWidth = 3 * scale;
  ctx.strokeRect(-stampW / 2, -stampH / 2, stampW, stampH);

  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(-stampW / 2 + 3 * scale, -stampH / 2 + 3 * scale, stampW - 6 * scale, stampH - 6 * scale);

  ctx.fillStyle = "rgba(220, 38, 38, 0.9)";
  ctx.font = `900 ${13 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), 0, 0);

  ctx.restore();
}

function drawGoaSunsetStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.08);

  const r = 32 * scale;
  ctx.strokeStyle = "rgba(217, 119, 6, 0.85)";
  ctx.lineWidth = 2.5 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(217, 119, 6, 0.9)";
  ctx.font = `bold ${7 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🌴 GOA VIBES 🌴", 0, -r + 10 * scale);
  ctx.font = `900 ${12 * scale}px 'Impact', sans-serif`;
  ctx.fillText("2026", 0, 2 * scale);
  ctx.font = `700 ${6 * scale}px monospace`;
  ctx.fillText("#FrameInGoa", 0, r - 10 * scale);

  ctx.restore();
}

function drawGoldStarburst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  starR: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.12);

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
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#072e1a";
  ctx.font = `bold ${7 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("★ 100% ★", 0, -5 * scale);
  ctx.font = `italic 900 ${10 * scale}px 'Georgia', serif`;
  ctx.fillText("BUILDER", 0, 7 * scale);
  ctx.restore();
}

function drawScribblesAndDoodles(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  mode: string,
  scale: number
) {
  ctx.save();
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = "round";

  if (mode === "pfp-frame") {
    drawScribbleStar(ctx, W * 0.84, H * 0.22, 10 * scale, "#d97706", scale);
    drawScribbleStar(ctx, W * 0.16, H * 0.78, 8 * scale, "#b91c1c", scale);

    ctx.beginPath();
    ctx.moveTo(W * 0.14, H * 0.38);
    ctx.quadraticCurveTo(W * 0.18, H * 0.44, W * 0.22, H * 0.46);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W * 0.20, H * 0.43);
    ctx.lineTo(W * 0.22, H * 0.46);
    ctx.lineTo(W * 0.18, H * 0.47);
    ctx.stroke();

    ctx.fillStyle = "#0d4a2b";
    ctx.font = `700 ${14 * scale}px 'Caveat', cursive, serif`;
    ctx.textAlign = "left";
    ctx.fillText("shipping in Goa ☕", W * 0.06, H * 0.34);
  } else {
    drawScribbleStar(ctx, W * 0.88, H * 0.16, 9 * scale, "#facc15", scale);
    drawScribbleStar(ctx, W * 0.12, H * 0.80, 7 * scale, "#ec4899", scale);

    ctx.fillStyle = "#facc15";
    ctx.font = `700 ${14 * scale}px 'Caveat', cursive, serif`;
    ctx.textAlign = "right";
    ctx.fillText("100% Legit Builder ✦", W * 0.92, H * 0.10);
  }

  ctx.restore();
}

function drawScribbleStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  scale: number
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(angle) * r, cy - Math.sin(angle) * r);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWavyUnderline(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  color: string,
  scale: number
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  const len = x2 - x1;
  const segments = 14;
  const dx = len / segments;
  for (let i = 0; i <= segments; i++) {
    const x = x1 + i * dx;
    const y = y1 + Math.sin(i * 0.7) * 3 * scale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}


// ─────────────────────────────────────────────────────────────
// DESIGN 2: EVENT PASS (BUILDER ID)
// Ultra-clean physical VIP badge on rich dark backdrop with
// handwritten scribble touches, high contrast, and zero clutter.
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

  // === 1. Deep Emerald Poster Background ===
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#031c10");
  bg.addColorStop(0.5, "#07331b");
  bg.addColorStop(1, "#02130a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle organic doodle waves in low opacity gold behind badge
  ctx.save();
  ctx.strokeStyle = "rgba(250, 204, 21, 0.05)";
  ctx.lineWidth = 2 * scale;
  for (let y = 100 * scale; y < H - 50 * scale; y += 40 * scale) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 10 * scale) {
      const dy = Math.sin((x + y) * 0.015) * 15 * scale;
      if (x === 0) ctx.moveTo(x, y + dy);
      else ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  // Faded background watermark letters
  ctx.fillStyle = "rgba(250, 204, 21, 0.04)";
  ctx.font = `900 ${180 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GOA", W / 2, H * 0.65);
  ctx.restore();

  addGrain(ctx, W, H, 0.04, scale);

  // === 2. Clean Editorial Poster Header (Top Canvas) ===
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Top title: "HACKER HOUSE GOA '26"
  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${32 * scale}px 'Impact', sans-serif`;
  ctx.fillText("HACKER HOUSE GOA '26", W / 2, 22 * scale);

  // Handwritten tag: "✦ Official Builder Pass · Aug 13-16, Goa ✦"
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = `700 ${16 * scale}px 'Caveat', cursive, 'Georgia', serif`;
  ctx.fillText("✦ Official Builder Pass · Aug 13-16, Goa ✦", W / 2, 60 * scale);
  ctx.restore();

  // === 3. Woven Lanyard Straps & Metal Clip ===
  const badgeCX = W / 2;
  const clipY = 112 * scale;

  ctx.save();
  // Left woven strap
  ctx.fillStyle = "#141414";
  ctx.beginPath();
  ctx.moveTo(badgeCX - 80 * scale, 0);
  ctx.lineTo(badgeCX - 50 * scale, 0);
  ctx.lineTo(badgeCX - 12 * scale, clipY);
  ctx.lineTo(badgeCX - 36 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Right woven strap
  ctx.beginPath();
  ctx.moveTo(badgeCX + 50 * scale, 0);
  ctx.lineTo(badgeCX + 80 * scale, 0);
  ctx.lineTo(badgeCX + 36 * scale, clipY);
  ctx.lineTo(badgeCX + 12 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Gold accent weave stripes on lanyard
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.moveTo(badgeCX - 68 * scale, 0);
  ctx.lineTo(badgeCX - 62 * scale, 0);
  ctx.lineTo(badgeCX - 24 * scale, clipY);
  ctx.lineTo(badgeCX - 30 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(badgeCX + 62 * scale, 0);
  ctx.lineTo(badgeCX + 68 * scale, 0);
  ctx.lineTo(badgeCX + 30 * scale, clipY);
  ctx.lineTo(badgeCX + 24 * scale, clipY);
  ctx.closePath();
  ctx.fill();

  // Metal clip
  const clipW = 34 * scale;
  const clipH = 34 * scale;
  ctx.fillStyle = "#cbd5e1";
  drawSquircle(ctx, badgeCX - clipW / 2, clipY - 6 * scale, clipW, clipH, 6 * scale);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(badgeCX - clipW / 2 + 4 * scale, clipY - 4 * scale, 4 * scale, clipH - 8 * scale);

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2 * scale;
  drawSquircle(ctx, badgeCX - clipW / 2, clipY - 6 * scale, clipW, clipH, 6 * scale);
  ctx.stroke();

  // Clip ring hole
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.arc(badgeCX, clipY + 20 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.arc(badgeCX, clipY + 20 * scale, 3.5 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // === 4. High-Clarity Physical VIP Builder Pass Card ===
  const cardW = 350 * scale;
  const cardH = 550 * scale;
  const cardX = badgeCX - cardW / 2;
  const cardY = clipY + 38 * scale;

  // Outer pass card with deep soft drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 32 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, cardX - 4 * scale, cardY - 4 * scale, cardW + 8 * scale, cardH + 8 * scale, 18 * scale);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.restore();

  // Outer card outline
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 2.5 * scale;
  drawSquircle(ctx, cardX - 4 * scale, cardY - 4 * scale, cardW + 8 * scale, cardH + 8 * scale, 18 * scale);
  ctx.stroke();

  // Top punch hole slot for lanyard
  ctx.fillStyle = "#e2e8f0";
  drawSquircle(ctx, badgeCX - 24 * scale, cardY - 10 * scale, 48 * scale, 12 * scale, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, badgeCX - 24 * scale, cardY - 10 * scale, 48 * scale, 12 * scale, 6 * scale);
  ctx.stroke();

  // Inner card body clip
  ctx.save();
  drawSquircle(ctx, cardX, cardY, cardW, cardH, 14 * scale);
  ctx.clip();

  // Off-white / cream physical card fill
  ctx.fillStyle = "#faf8f3";
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Subtle clean grid paper texture background inside card
  ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
  ctx.lineWidth = 1 * scale;
  for (let gx = cardX; gx <= cardX + cardW; gx += 20 * scale) {
    ctx.beginPath();
    ctx.moveTo(gx, cardY);
    ctx.lineTo(gx, cardY + cardH);
    ctx.stroke();
  }
  for (let gy = cardY; gy <= cardY + cardH; gy += 20 * scale) {
    ctx.beginPath();
    ctx.moveTo(cardX, gy);
    ctx.lineTo(cardX + cardW, gy);
    ctx.stroke();
  }

  // === Header Bar (Dark Emerald Banner) ===
  const hdrH = 34 * scale;
  ctx.fillStyle = "#063d23";
  ctx.fillRect(cardX, cardY, cardW, hdrH);

  ctx.fillStyle = "#facc15";
  ctx.font = `900 ${10 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("HACKER HOUSE GOA", cardX + 16 * scale, cardY + hdrH / 2);

  // VIP Gold Seal (Top Right)
  ctx.fillStyle = "#facc15";
  ctx.font = `bold ${8 * scale}px sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText("★ VIP BUILDER", cardX + cardW - 16 * scale, cardY + hdrH / 2);

  // === Photo Section (Center Top) ===
  const pW = cardW - 44 * scale;
  const pH = pW * 0.82;
  const pX = cardX + 22 * scale;
  const pY = cardY + hdrH + 18 * scale;

  // White Photo Card Frame with Drop Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
  ctx.shadowBlur = 10 * scale;
  ctx.shadowOffsetY = 4 * scale;
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, pX - 6 * scale, pY - 6 * scale, pW + 12 * scale, pH + 12 * scale, 12 * scale);
  ctx.fill();
  ctx.restore();

  // Photo border stroke
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(ctx, pX - 6 * scale, pY - 6 * scale, pW + 12 * scale, pH + 12 * scale, 12 * scale);
  ctx.stroke();

  // Photo clip
  ctx.save();
  drawSquircle(ctx, pX, pY, pW, pH, 8 * scale);
  ctx.clip();

  if (img) {
    drawUserPhoto(ctx, img, photo, pX + pW / 2, pY + pH / 2, pW, pH);
  } else {
    const pg = ctx.createLinearGradient(pX, pY, pX + pW, pY + pH);
    pg.addColorStop(0, "#093820");
    pg.addColorStop(1, "#031c10");
    ctx.fillStyle = pg;
    ctx.fillRect(pX, pY, pW, pH);

    ctx.fillStyle = "rgba(250, 204, 21, 0.6)";
    ctx.font = `600 ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to Upload Photo", pX + pW / 2, pY + pH / 2);
  }
  ctx.restore();

  // Washi Tape Strip Accent across top-left of photo (Scribbled aesthetic)
  ctx.save();
  ctx.translate(pX + 10 * scale, pY - 10 * scale);
  ctx.rotate(-0.08);
  ctx.fillStyle = "rgba(250, 204, 21, 0.9)";
  ctx.shadowColor = "rgba(0,0,0,0.1)";
  ctx.shadowBlur = 4 * scale;
  ctx.fillRect(0, 0, 72 * scale, 18 * scale);
  ctx.fillStyle = "#072e1a";
  ctx.font = `700 ${10 * scale}px 'Caveat', cursive, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SHIPPED ✦", 36 * scale, 9 * scale);
  ctx.restore();

  // === Builder Info Section ===
  let ty = pY + pH + 24 * scale;

  // Full Name (Massive, Bold, Crisp Dark)
  const nameText = (card.name || "ALEX RIVERA").toUpperCase();
  ctx.fillStyle = "#171717";
  ctx.font = `900 ${22 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(nameText, cardX + 22 * scale, ty);

  // Handwritten Wavy Red/Gold Underline underneath name
  const nameW = ctx.measureText(nameText).width;
  drawWavyUnderline(ctx, cardX + 22 * scale, ty + 26 * scale, cardX + 22 * scale + Math.min(nameW, cardW - 44 * scale), "#b91c1c", scale);

  // Role Pill & Handle
  ty += 34 * scale;
  const roleText = (card.role || "FULLSTACK").toUpperCase();

  // Role Pill (Dark background, vibrant gold font)
  ctx.font = `bold ${8.5 * scale}px sans-serif`;
  const rWidth = ctx.measureText(roleText).width + 16 * scale;
  ctx.fillStyle = "#171717";
  drawSquircle(ctx, cardX + 22 * scale, ty, rWidth, 18 * scale, 5 * scale);
  ctx.fill();

  ctx.fillStyle = "#facc15";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(roleText, cardX + 22 * scale + rWidth / 2, ty + 9 * scale);

  // Handle (Right aligned)
  const handleText = card.handle ? `@${card.handle.replace("@", "")}` : "@alexbuilds";
  ctx.fillStyle = "#525252";
  ctx.font = `600 ${10 * scale}px monospace`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(handleText, cardX + cardW - 22 * scale, ty + 9 * scale);

  // Handwritten Tagline / Fun Title
  ty += 28 * scale;
  const tagline = card.funTitle || "10x Caffeine-to-Code Pipeline";
  ctx.fillStyle = "#093820";
  ctx.font = `700 ${16 * scale}px 'Caveat', cursive, 'Georgia', serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`“ ${tagline} ”`, cardX + 22 * scale, ty);

  // Tech Stack Badges
  ty += 26 * scale;
  const stack = card.techStack?.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  ctx.font = `bold ${7.5 * scale}px sans-serif`;
  const stackW = stack.slice(0, 4).map((t) => ctx.measureText(t).width + 14 * scale);
  let sx = cardX + 22 * scale;

  for (let i = 0; i < Math.min(stack.length, 4); i++) {
    const pw = stackW[i];
    if (sx + pw > cardX + cardW - 22 * scale) break;

    ctx.fillStyle = "#ffffff";
    drawSquircle(ctx, sx, ty, pw, 16 * scale, 4 * scale);
    ctx.fill();

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1 * scale;
    drawSquircle(ctx, sx, ty, pw, 16 * scale, 4 * scale);
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, ty + 8 * scale);

    sx += pw + 6 * scale;
  }

  // === Bottom Barcode & QR Code Section ===
  const qrS = 48 * scale;
  const qrX = cardX + cardW - qrS - 20 * scale;
  const qrY = cardY + cardH - qrS - 16 * scale;

  // QR Code Box
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qrX - 3 * scale, qrY - 3 * scale, qrS + 6 * scale, qrS + 6 * scale);
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(qrX - 3 * scale, qrY - 3 * scale, qrS + 6 * scale, qrS + 6 * scale);

  const cs = 4 * scale;
  const gn = Math.floor(qrS / cs);
  let seed = 42;
  const seededRand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
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

  // Barcode (Bottom Left of Card)
  const barY = cardY + cardH - 34 * scale;
  const barX = cardX + 22 * scale;
  const barH = 16 * scale;

  ctx.fillStyle = "#171717";
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3];
  let bx = barX;
  for (const b of bars) {
    ctx.fillRect(bx, barY, b * scale * 0.7, barH);
    bx += (b + 1.2) * scale * 0.7;
  }
  ctx.font = `600 ${6 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`PASS ID: ${card.badgeId || "HHG-26-8420"}`, barX, barY + barH + 3 * scale);

  // Handwritten Doodle Stars on Card Margins (Scribbled aesthetic)
  drawScribbleStar(ctx, cardX + cardW - 30 * scale, cardY + hdrH + 12 * scale, 6 * scale, "#d97706", scale);
  drawScribbleStar(ctx, cardX + 16 * scale, cardY + cardH - 54 * scale, 5 * scale, "#b91c1c", scale);

  // Dynamic Stamps & Scribbles on Card
  const activeCardStickers = card.stickers || [];
  if (activeCardStickers.includes("postmark")) {
    drawRubberPostmark(ctx, cardX + cardW - 65 * scale, cardY + hdrH + 50 * scale, scale);
  }
  if (activeCardStickers.includes("approved-stamp")) {
    drawApprovedStamp(ctx, cardX + 75 * scale, cardY + cardH - 75 * scale, "BUILDER VERIFIED", scale);
  }
  if (activeCardStickers.includes("goa-sunset-stamp")) {
    drawGoaSunsetStamp(ctx, cardX + 50 * scale, cardY + hdrH + 45 * scale, scale);
  }
  if (activeCardStickers.includes("gold-starburst")) {
    drawGoldStarburst(ctx, cardX + cardW - 50 * scale, cardY + cardH - 85 * scale, 24 * scale, scale);
  }
  if (activeCardStickers.includes("scribble-doodles")) {
    drawScribblesAndDoodles(ctx, W, H, "builder-card", scale);
  }

  ctx.restore(); // End card clip


  // === 5. Bottom Ticker Tape ===
  const tickerH = 26 * scale;
  const tickerY = H - tickerH;

  ctx.fillStyle = "#facc15";
  ctx.fillRect(0, tickerY, W, tickerH);

  ctx.fillStyle = "#072e1a";
  ctx.font = `bold ${8.5 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const tickerText = "+ HACKER HOUSE GOA 2026 + EVERYTHING INTENTIONAL + SHIP HARD VIBE HARDER ";
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
