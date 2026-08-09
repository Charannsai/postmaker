/* ──────────────────────────────────────────────────────────────
   Types & Data Models – HH Goa 2026 Frame & ID Card Generator
   ────────────────────────────────────────────────────────────── */

// ── Photo filters ────────────────────────────────────────────
export type FilterType =
  | "original"
  | "goa-sunset"
  | "cyber-neon"
  | "golden-hour"
  | "monochrome"
  | "high-contrast";

export interface FilterDef {
  id: FilterType;
  label: string;
  css: string; // CSS filter string applied to the canvas image
}

// ── PFP Frame (Format A) ────────────────────────────────────
export type FrameShape = "circle" | "squircle";

export type FrameTemplateId =
  | "goa-neon-sunset"
  | "cyber-matrix"
  | "holographic-foil"
  | "minimal-luxury"
  | "beach-vibes-retro";

export interface FrameTemplate {
  id: FrameTemplateId;
  label: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

export type BadgeText =
  | "SEE YOU IN GOA 🌴"
  | "VIP BUILDER"
  | "SPEAKER"
  | "custom";

export interface FrameSettings {
  templateId: FrameTemplateId;
  shape: FrameShape;
  badgeEnabled: boolean;
  badgeText: string;
}

// ── Builder ID Card (Format B) ──────────────────────────────
export type CardTemplateId =
  | "holographic-vip"
  | "cyber-terminal"
  | "goa-sunset-pass"
  | "indie-minimalist";

export interface CardTemplate {
  id: CardTemplateId;
  label: string;
  description: string;
  colors: {
    bg: string;
    card: string;
    accent: string;
    text: string;
    glow: string;
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
  handle: string; // @twitter / @github
  role: BuilderRole;
  techStack: string[];
  funTitle: string;
  tagline: string;
  badgeId: string; // auto-generated e.g. HHG-26-4819
}

// ── Photo state ─────────────────────────────────────────────
export interface PhotoState {
  src: string | null; // object URL or data URL
  offsetX: number;
  offsetY: number;
  zoom: number; // 1 = 100%
  rotation: number; // degrees
  flipH: boolean;
  flipV: boolean;
  filter: FilterType;
}

// ── App-level mode ──────────────────────────────────────────
export type AppMode = "pfp-frame" | "builder-card";

// ── Aggregate app state (used by page.tsx) ──────────────────
export interface AppState {
  mode: AppMode;
  photo: PhotoState;
  frame: FrameSettings;
  card: CardData;
  cardTemplateId: CardTemplateId;
}
