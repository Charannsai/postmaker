
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
const assetListeners: Set<() => void> = new Set();

export function subscribeAssetLoad(callback: () => void) {
  assetListeners.add(callback);
  return () => {
    assetListeners.delete(callback);
  };
}

function notifyAssetLoaded() {
  assetListeners.forEach((cb) => cb());
}

function getOrLoadAsset(src: string): HTMLImageElement | null {
  if (typeof window === "undefined") return null;
  if (assetImageCache[src]) {
    const cached = assetImageCache[src];
    return cached.complete && cached.naturalWidth > 0 ? cached : null;
  }
  const img = new Image();
  img.src = src;
  img.onload = () => {
    assetImageCache[src] = img;
    notifyAssetLoaded();
  };
  assetImageCache[src] = img;
  return img.complete && img.naturalWidth > 0 ? img : null;
}

// Preload common asset stamps immediately on browser initialization
if (typeof window !== "undefined") {
  ["/assets/hacker-house-logo.png", "/assets/goa-hindi-logo.png", "/assets/image.png"].forEach((src) => {
    getOrLoadAsset(src);
  });
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
  if (!img) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 12 * scale;
  ctx.shadowOffsetY = 4 * scale;
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
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
  if (!img) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 8 * scale;
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
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

// ── Curved Text Helper ────────────────────────────────────────
function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  font: string,
  color: string,
  scale: number
) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const numChars = text.length;
  if (numChars === 0) return;
  const angleStep = (endAngle - startAngle) / Math.max(1, numChars - 1);

  for (let i = 0; i < numChars; i++) {
    const char = text[i];
    const angle = startAngle + i * angleStep;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// DESIGN 2: HORIZONTAL BUILDER ID BANNER (OFFICIAL REFERENCE)
// Large circular portrait badge on left with curved ring text &
// Devanagari Goa logo sticker; clean editorial info on right.
// ─────────────────────────────────────────────────────────────
export function renderBuilderCard(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  photo: PhotoState,
  card: CardData,
  scale: number = 2
) {
  const W = 800 * scale;
  const H = 418 * scale;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // === 1. Clean Ultra-Sleek Painterly Acrylic Motion Blur Background ===
  ctx.fillStyle = "#031c10";
  drawSquircle(ctx, 0, 0, W, H, 16 * scale);
  ctx.fill();

  ctx.save();
  drawSquircle(ctx, 0, 0, W, H, 16 * scale);
  ctx.clip();

  // Multi-layered horizontal acrylic brush smudges (matching Reference Image 1)
  const acrylicColors = [
    "rgba(7, 77, 43, 0.45)",
    "rgba(22, 110, 65, 0.35)",
    "rgba(4, 38, 22, 0.60)",
    "rgba(70, 130, 85, 0.25)",
    "rgba(5, 50, 28, 0.65)",
  ];

  for (let i = 0; i < 30; i++) {
    const strokeY = (H / 30) * i + Math.sin(i * 1.5) * 12 * scale;
    const strokeH = (22 + (i % 6) * 7) * scale;
    const strokeW = (W * 0.5 + ((i * 41) % 320)) * scale;
    const strokeX = ((i * 125) % W) - strokeW * 0.25;

    const strokeGrad = ctx.createLinearGradient(strokeX, strokeY, strokeX + strokeW, strokeY);
    const col = acrylicColors[i % acrylicColors.length];
    strokeGrad.addColorStop(0, "rgba(0,0,0,0)");
    strokeGrad.addColorStop(0.25, col);
    strokeGrad.addColorStop(0.75, col);
    strokeGrad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = strokeGrad;
    ctx.fillRect(strokeX, strokeY - strokeH / 2, strokeW, strokeH);
  }

  // Fine Spray-paint Grain for organic acrylic texture
  addGrain(ctx, W, H, 0.05, scale);
  ctx.restore();




  // === 2. LEFT HALF: CIRCULAR PORTRAIT BADGE ===
  const badgeCX = 220 * scale;
  const badgeCY = H / 2;

  // Outer dark drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fillStyle = "#011a0d";
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, 162 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outer dark green ring
  ctx.fillStyle = "#032915";
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, 160 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Inner emerald ring
  ctx.fillStyle = "#064223";
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, 154 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffe600";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, 154 * scale, 0, Math.PI * 2);
  ctx.stroke();

  // Top curved text: "HACKER HOUSE GOA"
  drawCurvedText(
    ctx,
    "HACKER HOUSE GOA",
    badgeCX,
    badgeCY,
    138 * scale,
    -Math.PI * 0.76,
    -Math.PI * 0.24,
    `900 ${15 * scale}px 'Impact', sans-serif`,
    "#ffe600",
    scale
  );

  // Bottom curved text: "28–31 OCT 2026"
  drawCurvedText(
    ctx,
    "28–31 OCT 2026",
    badgeCX,
    badgeCY,
    138 * scale,
    Math.PI * 0.25,
    Math.PI * 0.75,
    `900 ${14 * scale}px 'Impact', sans-serif`,
    "#ffe600",
    scale
  );

  // Inner Photo Circle Window
  const photoR = 114 * scale;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 12 * scale;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, photoR + 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Photo Clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, photoR, 0, Math.PI * 2);
  ctx.clip();

  if (img) {
    drawUserPhoto(ctx, img, photo, badgeCX, badgeCY, photoR * 2, photoR * 2);
  } else {
    const pg = ctx.createLinearGradient(
      badgeCX - photoR,
      badgeCY - photoR,
      badgeCX + photoR,
      badgeCY + photoR
    );
    pg.addColorStop(0, "#ffe600");
    pg.addColorStop(1, "#ff007f");
    ctx.fillStyle = pg;
    ctx.fillRect(badgeCX - photoR, badgeCY - photoR, photoR * 2, photoR * 2);

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${14 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to Upload Photo", badgeCX, badgeCY);
  }
  ctx.restore();

  // Devanagari "गोवा" Hot Pink & Yellow Sticker Stamp (Overlapping bottom center of circular badge!)
  drawGoaHindiLogoStamp(
    ctx,
    badgeCX,
    badgeCY + photoR - 10 * scale,
    88 * scale,
    88 * scale,
    0,
    scale
  );

  // === 3. RIGHT HALF: EDITORIAL INFO ===
  const rx = 430 * scale;

  // Top Title: Official HACKER HOUSE Asset Logo
  drawHackerHouseLogoStamp(
    ctx,
    rx + 140 * scale,
    48 * scale,
    280 * scale,
    46 * scale,
    scale
  );

  // Subtitle Date directly BELOW the logo
  ctx.save();
  ctx.fillStyle = "#ffe600";
  ctx.font = `900 ${14 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("GOA · 28–31 OCT 2026", rx, 92 * scale);
  ctx.restore();


  // Horizontal Accent Line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(rx, 124 * scale);
  ctx.lineTo(W - 40 * scale, 124 * scale);
  ctx.stroke();

  // Name Label / Big Title - Modern, clean & crisp styling
  const isNameEmpty = !card.name?.trim();
  const nameStr = (card.name?.trim() || "YOUR NAME HERE").toUpperCase();
  ctx.save();
  ctx.fillStyle = isNameEmpty ? "rgba(255, 255, 255, 0.4)" : "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  let nameFontSize = 28 * scale;
  ctx.font = `700 ${nameFontSize}px 'Space Grotesk', 'Plus Jakarta Sans', sans-serif`;
  const maxNameWidth = W - rx - 40 * scale;

  while (ctx.measureText(nameStr).width > maxNameWidth && nameFontSize > 16 * scale) {
    nameFontSize -= 1.5 * scale;
    ctx.font = `700 ${nameFontSize}px 'Space Grotesk', 'Plus Jakarta Sans', sans-serif`;
  }

  ctx.fillText(nameStr, rx, 144 * scale);
  ctx.restore();

  // Role in Hot Pink!
  const isRoleEmpty = !card.role?.trim();
  const roleStr = "» " + (card.role?.trim() || "BUILDER").toUpperCase();
  ctx.save();
  ctx.fillStyle = isRoleEmpty ? "rgba(255, 0, 127, 0.5)" : "#ff007f";
  ctx.font = `900 ${18 * scale}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(roleStr, rx, 192 * scale);
  ctx.restore();

  // Handle
  const isHandleEmpty = !card.handle?.trim();
  const rawHandle = card.handle?.trim().replace(/^@+/, "") || "";
  const handleStr = rawHandle ? `@${rawHandle}` : "@yourhandle";
  ctx.save();
  ctx.fillStyle = isHandleEmpty ? "rgba(255, 230, 0, 0.4)" : "#ffe600";
  ctx.font = `700 ${14 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(handleStr, rx, 226 * scale);
  ctx.restore();

  // Motto / Tagline
  const taglineStr = (card.funTitle?.trim() || "SHIPPING IN GOA · HH GOA 2026").toUpperCase();
  ctx.save();
  ctx.fillStyle = !card.funTitle?.trim() ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.75)";
  ctx.font = `700 ${12 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(taglineStr, rx, 272 * scale);
  ctx.restore();

  // Link
  ctx.save();
  ctx.fillStyle = "#ffe600";
  ctx.font = `700 ${15 * scale}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("hhgoa.com", rx, 305 * scale);
  ctx.restore();

  // Dynamic Official Barcode or Verified Stamp (Cleaned up, no QR or beach art)
  const activeCardStickers = card.stickers || [];
  if (activeCardStickers.includes("approved-stamp")) {
    drawApprovedStamp(ctx, W - 100 * scale, 240 * scale, "VERIFIED", scale);
  }
  if (activeCardStickers.includes("barcode")) {
    drawBarcodeStamp(ctx, rx, 350 * scale, 120 * scale, 16 * scale, card.badgeId || "HHG-26-8420", scale);
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


