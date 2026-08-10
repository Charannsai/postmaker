/* ──────────────────────────────────────────────────────────────
   Types & Data Models – HH Goa 2026 Studio
   Two Focused Flagship Designs:
   1. PFP Frame: Editorial Scrapbook Poster
   2. Builder ID: Disney-Style Lanyard Conference Badge
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

export type CanvasAspectRatio = "1:1" | "4:5" | "9:16";

export type BackgroundStyleId =
  | "paper-wrinkled"
  | "notebook-lined"
  | "hh-goa-emerald"
  | "kraft-paper"
  | "clean-white";

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

export type StickerType =
  | "goa-hindi-logo"
  | "hacker-house-logo"
  | "goa-sunset-art"
  | "goa-signpost-art"
  | "hacker-shack-art"
  | "approved-stamp"
  | "barcode";


// ── Format A: PFP Poster Frame ────────────────────────────────
export interface FrameSettings {
  caption: string;
  subcaption: string;
  captionStyle: CaptionStyleId;
  stickers: StickerType[];
  bgStyle: BackgroundStyleId;
  aspectRatio: CanvasAspectRatio;
}

// ── Format B: Builder ID Lanyard Badge ────────────────────────
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
  nickname: string;
  handle: string;
  role: BuilderRole;
  techStack: string[];
  funTitle: string;
  noteText: string;
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
}
