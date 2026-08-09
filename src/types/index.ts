/* ──────────────────────────────────────────────────────────────
   Types & Data Models – HH Goa 2026 Aesthetic Frame & ID Generator
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
  | "dark-minimal"
  | "yellow-gingham"
  | "red-texture"
  | "kraft-paper"
  | "clean-white"
  | "blueprint-grid";

export interface BackgroundStyle {
  id: BackgroundStyleId;
  label: string;
  preview: string;
}

// ── Format A: Aesthetic Frames ────────────────────────────────
export type FrameTemplateId =
  | "polaroid-tape"
  | "postage-stamp"
  | "music-player"
  | "magazine-editorial"
  | "minimal-gallery"
  | "goa-neon-sunset"
  | "cyber-matrix";

export interface FrameTemplate {
  id: FrameTemplateId;
  label: string;
  description: string;
  category: "aesthetic" | "retro" | "minimal" | "cyber";
  previewIcon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg?: string;
  };
}

export type StickerType =
  | "washi-tape"
  | "sunflower"
  | "palm"
  | "postmark"
  | "barcode"
  | "sparkles";

export interface FrameSettings {
  templateId: FrameTemplateId;
  caption: string;
  subcaption: string;
  badgeEnabled: boolean;
  badgeText: string;
  stickers: StickerType[];
  bgStyle: BackgroundStyleId;
  aspectRatio: CanvasAspectRatio;
}

// ── Format B: Builder ID Cards ────────────────────────────────
export type CardTemplateId =
  | "scrapbook-pass"
  | "boarding-pass"
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
