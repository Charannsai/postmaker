
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

  // === 8. Active Official Asset Stamps ===
  const activeStickers = frame.stickers || [];
  if (activeStickers.includes("goa-hindi-logo")) {
    drawGoaHindiLogoStamp(ctx, mx + stampW - 55 * scale, my + 55 * scale, 75 * scale, 75 * scale, 0.12, scale);
  }
  if (activeStickers.includes("hacker-house-logo")) {
    drawHackerHouseLogoStamp(ctx, mx + stampW / 2, my + 24 * scale, 220 * scale, 34 * scale, scale);
  }
  if (activeStickers.includes("goa-sunset-art")) {
    drawOfficialArtStamp(ctx, "/assets/goa-sunset-bg.jpg", mx + stampW - 65 * scale, my + stampH * 0.76, 85 * scale, 70 * scale, 0.1, scale);
  }
  if (activeStickers.includes("goa-signpost-art")) {
    drawOfficialArtStamp(ctx, "/assets/goa-signpost-bg.jpg", mx + 65 * scale, my + stampH * 0.76, 85 * scale, 70 * scale, -0.1, scale);
  }
  if (activeStickers.includes("hacker-shack-art")) {
    drawOfficialArtStamp(ctx, "/assets/hacker-shack-bg.jpg", mx + stampW / 2, my + stampH * 0.78, 110 * scale, 80 * scale, 0, scale);
  }
  if (activeStickers.includes("approved-stamp")) {
    drawApprovedStamp(ctx, mx + 65 * scale, my + 65 * scale, "APPROVED FOR GOA", scale);
  }


  // Grain over stamp
  addGrain(ctx, W, H, 0.025, scale);

  ctx.restore(); // End stamp clip
}


// ── Asset Image Loader Cache ──────────────────────────────────
const assetImageCache: Record<string, HTMLImageElement> = {};

function getOrLoadAsset(src: string): HTMLImageElement | null {
  if (typeof window === "undefined") return null;
  if (assetImageCache[src]) {
    return assetImageCache[src].complete && assetImageCache[src].naturalWidth > 0
      ? assetImageCache[src]
      : null;
  }
  const img = new Image();
  img.src = src;
  img.onload = () => {
    assetImageCache[src] = img;
  };
  assetImageCache[src] = img;
  return null;
}

// ── Official Asset Stamp Renderers ────────────────────────────
function drawGoaHindiLogoStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  angle: number = 0.12,
  scale: number = 2
) {
  const img = getOrLoadAsset("/assets/goa-hindi-logo.png");
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 12 * scale;
  ctx.shadowOffsetY = 4 * scale;

  if (img) {
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    // Fallback vector Devanagari badge if loading
    ctx.fillStyle = "#ff007f";
    drawSquircle(ctx, -w / 2, -h / 2, w, h, 8 * scale);
    ctx.fill();
    ctx.fillStyle = "#ffe600";
    ctx.font = `900 ${18 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("गोवा", 0, 0);
  }
  ctx.restore();
}

function drawHackerHouseLogoStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  scale: number = 2
) {
  const img = getOrLoadAsset("/assets/hacker-house-logo.png");
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 8 * scale;

  if (img) {
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    ctx.fillStyle = "#facc15";
    ctx.font = `900 ${28 * scale}px 'Impact', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HACKER HOUSE", 0, 0);
  }
  ctx.restore();
}

function drawOfficialArtStamp(
  ctx: CanvasRenderingContext2D,
  srcPath: string,
  cx: number,
  cy: number,
  w: number,
  h: number,
  angle: number = -0.06,
  scale: number = 2
) {
  const img = getOrLoadAsset(srcPath);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // White polaroid / sticker border
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 12 * scale;
  ctx.shadowOffsetY = 5 * scale;
  ctx.fillStyle = "#ffffff";
  drawSquircle(ctx, -w / 2 - 4 * scale, -h / 2 - 4 * scale, w + 8 * scale, h + 8 * scale, 8 * scale);
  ctx.fill();

  ctx.save();
  drawSquircle(ctx, -w / 2, -h / 2, w, h, 6 * scale);
  ctx.clip();

  if (img) {
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    ctx.fillStyle = "#004e28";
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = "#facc15";
    ctx.font = `bold ${10 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GOA ART", 0, 0);
  }
  ctx.restore();
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

  ctx.strokeStyle = "rgba(236, 72, 153, 0.9)";
  ctx.lineWidth = 3 * scale;
  ctx.strokeRect(-stampW / 2, -stampH / 2, stampW, stampH);

  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(-stampW / 2 + 3 * scale, -stampH / 2 + 3 * scale, stampW - 6 * scale, stampH - 6 * scale);

  ctx.fillStyle = "#ec4899";
  ctx.font = `900 ${13 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), 0, 0);

  ctx.restore();
}

function drawBarcodeStamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  code: string,
  scale: number
) {
  ctx.save();
  ctx.fillStyle = "#171717";
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3];
  let bx = x;
  for (const b of bars) {
    ctx.fillRect(bx, y, b * scale * 0.7, h);
    bx += (b + 1.2) * scale * 0.7;
  }
  ctx.font = `600 ${6 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`PASS ID: ${code}`, x, y + h + 3 * scale);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// DESIGN 2: SINGLE CLEAN EVENT PASS (BUILDER ID)
// One clean frame, official Hacker House Goa logo assets,
// hot pink & yellow Goa Devanagari stickers, crisp layout.
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

  // === 1. Deep Goa Emerald Gradient Background (Single Clean Pass Frame) ===
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#004e28");
  bg.addColorStop(0.4, "#02381c");
  bg.addColorStop(1, "#012113");
  ctx.fillStyle = bg;
  drawSquircle(ctx, 0, 0, W, H, 20 * scale);
  ctx.fill();

  // Subtle clean grid paper texture background inside single pass frame
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1 * scale;
  for (let gx = 0; gx <= W; gx += 30 * scale) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }
  for (let gy = 0; gy <= H; gy += 30 * scale) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }

  addGrain(ctx, W, H, 0.03, scale);

  // === 2. Official Header Logo (HACKER HOUSE Yellow Asset) ===
  drawHackerHouseLogoStamp(ctx, W / 2 - 15 * scale, 48 * scale, 310 * scale, 52 * scale, scale);

  // Official Devanagari "गोवा" Hot Pink & Yellow Sticker Stamp (Top Right)
  drawGoaHindiLogoStamp(ctx, W - 62 * scale, 46 * scale, 76 * scale, 76 * scale, 0.12, scale);

  // Official Subtitle Tag
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = `bold ${10 * scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("✦ OFFICIAL BUILDER PASS · AUG 13-16, GOA ✦", W / 2, 86 * scale);
  ctx.restore();

  // === 3. Centered Photo Window (Clean Frame Cutout) ===
  const photoW = W * 0.65;
  const photoH = photoW * 0.88;
  const photoCX = W / 2;
  const photoCY = 275 * scale;

  // White Photo Cutout Frame with Clean Drop Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 10 * scale;
  ctx.fillStyle = "#ffffff";
  drawSquircle(
    ctx,
    photoCX - photoW / 2 - 6 * scale,
    photoCY - photoH / 2 - 6 * scale,
    photoW + 12 * scale,
    photoH + 12 * scale,
    14 * scale
  );
  ctx.fill();
  ctx.restore();

  // Outer border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1.5 * scale;
  drawSquircle(
    ctx,
    photoCX - photoW / 2 - 6 * scale,
    photoCY - photoH / 2 - 6 * scale,
    photoW + 12 * scale,
    photoH + 12 * scale,
    14 * scale
  );
  ctx.stroke();

  // Photo clip
  ctx.save();
  drawSquircle(ctx, photoCX - photoW / 2, photoCY - photoH / 2, photoW, photoH, 10 * scale);
  ctx.clip();

  if (img) {
    drawUserPhoto(ctx, img, photo, photoCX, photoCY, photoW, photoH);
  } else {
    const pg = ctx.createLinearGradient(
      photoCX - photoW / 2,
      photoCY - photoH / 2,
      photoCX + photoW / 2,
      photoCY + photoH / 2
    );
    pg.addColorStop(0, "#004e28");
    pg.addColorStop(1, "#012113");
    ctx.fillStyle = pg;
    ctx.fillRect(photoCX - photoW / 2, photoCY - photoH / 2, photoW, photoH);

    ctx.fillStyle = "#facc15";
    ctx.font = `600 ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to Upload Photo", photoCX, photoCY);
  }
  ctx.restore();

  // === 4. Builder Info Section (Clean, Bold, High Contrast) ===
  let ty = photoCY + photoH / 2 + 32 * scale;

  // Full Name (Massive Bold Title)
  const nameText = (card.name || "ALEX RIVERA").toUpperCase();
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${26 * scale}px 'Impact', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(nameText, W / 2, ty);

  // Hot Pink Accent Underline
  const nameW = ctx.measureText(nameText).width;
  ctx.fillStyle = "#ff007f";
  ctx.fillRect(W / 2 - Math.min(nameW, W - 60 * scale) / 2, ty + 30 * scale, Math.min(nameW, W - 60 * scale), 4 * scale);
  ctx.restore();

  // Role Badge & Handle
  ty += 44 * scale;
  const roleText = (card.role || "FULLSTACK").toUpperCase() + " BUILDER";

  ctx.save();
  ctx.font = `900 ${9.5 * scale}px sans-serif`;
  const rWidth = ctx.measureText(roleText).width + 20 * scale;

  // Hot Pink Role Pill with Gold Font
  ctx.fillStyle = "#ff007f";
  drawSquircle(ctx, W / 2 - rWidth / 2, ty, rWidth, 22 * scale, 6 * scale);
  ctx.fill();

  ctx.fillStyle = "#ffe600";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(roleText, W / 2, ty + 11 * scale);
  ctx.restore();

  // Handle Tag
  ty += 28 * scale;
  const handleText = card.handle ? `@${card.handle.replace("@", "")}` : "@alexbuilds";
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = `600 ${11 * scale}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(handleText, W / 2, ty);
  ctx.restore();

  // Tagline
  ty += 22 * scale;
  const tagline = card.funTitle || "10x Caffeine-to-Code Pipeline";
  ctx.save();
  ctx.fillStyle = "#facc15";
  ctx.font = `italic 700 ${14 * scale}px 'Georgia', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(`“ ${tagline} ”`, W / 2, ty);
  ctx.restore();

  // Tech Stack Badges
  ty += 28 * scale;
  const stack = card.techStack?.length > 0 ? card.techStack : ["React", "Next.js", "Solana", "TypeScript"];
  ctx.save();
  ctx.font = `bold ${8 * scale}px sans-serif`;
  const stackW = stack.slice(0, 4).map((t) => ctx.measureText(t).width + 16 * scale);
  const totalStackW = stackW.reduce((a, b) => a + b, 0) + (stackW.length - 1) * 6 * scale;
  let sx = W / 2 - totalStackW / 2;

  for (let i = 0; i < Math.min(stack.length, 4); i++) {
    const pw = stackW[i];
    ctx.fillStyle = "#ffffff";
    drawSquircle(ctx, sx, ty, pw, 18 * scale, 5 * scale);
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stack[i], sx + pw / 2, ty + 9 * scale);

    sx += pw + 6 * scale;
  }
  ctx.restore();

  // === 5. Bottom Barcode & QR Code Section ===
  const qrS = 48 * scale;
  const qrX = W - qrS - 28 * scale;
  const qrY = H - qrS - 42 * scale;

  // QR Code Box
  ctx.save();
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
  ctx.restore();

  // Barcode (Bottom Left)
  const barY = H - 56 * scale;
  const barX = 28 * scale;
  const barH = 18 * scale;
  drawBarcodeStamp(ctx, barX, barY, 120 * scale, barH, card.badgeId || "HHG-26-8420", scale);

  // === 6. Dynamic Official Asset Stamps ===
  const activeCardStickers = card.stickers || [];
  if (activeCardStickers.includes("goa-hindi-logo")) {
    drawGoaHindiLogoStamp(ctx, 60 * scale, photoCY - photoH / 2 - 10 * scale, 70 * scale, 70 * scale, -0.15, scale);
  }
  if (activeCardStickers.includes("hacker-house-logo")) {
    drawHackerHouseLogoStamp(ctx, W / 2, photoCY + photoH / 2 + 15 * scale, 220 * scale, 36 * scale, scale);
  }
  if (activeCardStickers.includes("goa-sunset-art")) {
    drawOfficialArtStamp(ctx, "/assets/goa-sunset-bg.jpg", W - 70 * scale, photoCY + photoH / 2 + 10 * scale, 90 * scale, 75 * scale, 0.1, scale);
  }
  if (activeCardStickers.includes("goa-signpost-art")) {
    drawOfficialArtStamp(ctx, "/assets/goa-signpost-bg.jpg", 70 * scale, photoCY + photoH / 2 + 10 * scale, 90 * scale, 75 * scale, -0.1, scale);
  }
  if (activeCardStickers.includes("hacker-shack-art")) {
    drawOfficialArtStamp(ctx, "/assets/hacker-shack-bg.jpg", W / 2, H - 120 * scale, 120 * scale, 85 * scale, 0, scale);
  }
  if (activeCardStickers.includes("approved-stamp")) {
    drawApprovedStamp(ctx, W / 2, photoCY, "BUILDER VERIFIED", scale);
  }

  // === 7. Bottom Gold Ticker Tape ===
  const tickerH = 26 * scale;
  const tickerY = H - tickerH;

  ctx.fillStyle = "#facc15";
  ctx.fillRect(0, tickerY, W, tickerH);

  ctx.fillStyle = "#072e1a";
  ctx.font = `bold ${8.5 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const tickerText = "+ HACKER HOUSE GOA 2026 + EVERYTHING INTENTIONAL + #FrameInGoa ";
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
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png",
      1
    );
  });
}

