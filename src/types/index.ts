/* ──────────────────────────────────────────────────────────────
   Types & Data Models – HH Goa 2026 Paper Studio
   ────────────────────────────────────────────────────────────── */

export type FilterType =
  | "original"
  | "goa-sunset"
  | "golden-hour"
  | "vintage-warm"
  | "cyber-neon"
  | "monochrome"
  | "high-contrast";

export interface FilterDef {
  id: FilterType;
  label: string;
  css: string;
}

export type CanvasAspectRatio = "1:1" | "9:16" | "4:5";

export type BackgroundStyleId =
  | "paper-wrinkled"
  | "hh-goa-emerald"
  | "kraft-paper"
  | "dark-minimal"
  | "yellow-gingham"
  | "clean-white"
  | "blueprint-grid";

export interface BackgroundStyle {
  id: BackgroundStyleId;
  label: string;
  preview: string;
}

export type CaptionStyleId =
  | "bold-street"
  | "handwritten"
  | "typewriter-tape"
  | "hacker-mono"
  | "golden-serif";

export interface CaptionStyleDef {
  id: CaptionStyleId;
  label: string;
}

// ── Format A: Aesthetic Frames ────────────────────────────────
export type FrameTemplateId =
  | "hh-goa-paper-collage"
  | "hh-goa-official"
  | "hh-goa-signpost"
  | "polaroid-tape"
  | "festival-wristband"
  | "streetwear-poster"
  | "cinema-ticket"
  | "postage-stamp"
  | "music-player"
  | "magazine-editorial"
  | "cyber-hud-scanner"
  | "minimal-gallery"
  | "goa-neon-sunset"
  | "cyber-matrix";

export interface FrameTemplate {
  id: FrameTemplateId;
  label: string;
  description: string;
  category: "collage" | "official" | "aesthetic" | "festival" | "street" | "retro" | "cyber" | "minimal";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg?: string;
  };
}

export type StickerType =
  | "signpost"
  | "sun-rising"
  | "washi-tape"
  | "postmark"
  | "barcode"
  | "sparkles"
  | "verified"
  | "hazard-tape"
  | "ticket-stamp";

export interface FrameSettings {
  templateId: FrameTemplateId;
  caption: string;
  subcaption: string;
  captionStyle: CaptionStyleId;
  badgeEnabled: boolean;
  badgeText: string;
  stickers: StickerType[];
  bgStyle: BackgroundStyleId;
  aspectRatio: CanvasAspectRatio;
}

// ── Format B: Builder ID Cards ────────────────────────────────
export type CardTemplateId =
  | "hh-goa-paper-scrapbook"
  | "hh-goa-emerald-badge"
  | "boarding-pass"
  | "scrapbook-pass"
  | "festival-access"
  | "holographic-vip"
  | "cyber-terminal"
  | "swiss-minimal";

export interface CardTemplate {
  id: CardTemplateId;
  label: string;
  description: string;
  colors: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
}

export type BuilderRole =
  | "Frontend"
  | "Backend"
  | "Fullstack"
  | "AI/ML"
  | "Solana/Web3"
  | "Indie Hacker"
  | "Designer"
  | "Founder"
  | "DevOps"
  | "Mobile";

export interface CardData {
  name: string;
  handle: string;
  role: BuilderRole;
  techStack: string[];
  funTitle: string;
  tagline: string;
  badgeId: string;
  stickers: StickerType[];
  bgStyle: BackgroundStyleId;
}

// ── Photo State ───────────────────────────────────────────────
export interface PhotoState {
  src: string | null;
  offsetX: number;
  offsetY: number;
  zoom: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  filter: FilterType;
}

export type AppMode = "pfp-frame" | "builder-card";

export interface AppState {
  mode: AppMode;
  photo: PhotoState;
  frame: FrameSettings;
  card: CardData;
  cardTemplateId: CardTemplateId;
}
