/* ──────────────────────────────────────────────────────────────
   Definitions & Presets – HH Goa 2026 Studio
   ────────────────────────────────────────────────────────────── */

import type {
  FilterDef,
  FilterType,
  BackgroundStyle,
  StickerType,
  CaptionStyleDef,
} from "@/types";

// ── Photo Filters ────────────────────────────────────────────
export const FILTERS: FilterDef[] = [
  { id: "original", label: "Original", css: "none" },
  {
    id: "vintage-warm",
    label: "Warm Matte",
    css: "sepia(0.3) saturate(1.2) contrast(1.05) brightness(1.02)",
  },
  {
    id: "goa-sunset",
    label: "Sunset Glow",
    css: "saturate(1.35) sepia(0.2) hue-rotate(-10deg) brightness(1.05)",
  },
  {
    id: "golden-hour",
    label: "Golden Hour",
    css: "sepia(0.4) saturate(1.3) brightness(1.08) contrast(1.08)",
  },
  {
    id: "monochrome",
    label: "Film Noir",
    css: "grayscale(1) contrast(1.2) brightness(1.05)",
  },
  {
    id: "high-contrast",
    label: "High Contrast",
    css: "contrast(1.4) saturate(1.2) brightness(1.05)",
  },
];

export function getFilterCss(id: FilterType): string {
  return FILTERS.find((f) => f.id === id)?.css ?? "none";
}

// ── Canvas Background Styles ─────────────────────────────────
export const BACKGROUND_STYLES: BackgroundStyle[] = [
  { id: "notebook-lined", label: "Lined Notebook", preview: "#fcfbfa" },
  { id: "paper-wrinkled", label: "Wrinkled Paper", preview: "#f5f2eb" },
  { id: "hh-goa-emerald", label: "HH Goa Emerald", preview: "#0d4a2b" },
  { id: "kraft-paper", label: "Kraft Paper", preview: "#d7c4a3" },
  { id: "clean-white", label: "Studio White", preview: "#ffffff" },
];

// ── Caption Styles ───────────────────────────────────────────
export const CAPTION_STYLES: CaptionStyleDef[] = [
  { id: "bold-street", label: "Bold Block Ribbon" },
  { id: "handwritten", label: "Aesthetic Script" },
  { id: "typewriter-tape", label: "Typewriter Tape" },
  { id: "golden-serif", label: "Luxury Serif" },
  { id: "hacker-mono", label: "Monospace Terminal" },
];

// ── Clean Typographic Preset Captions (Zero Emojis) ──────────
export const PRESET_CAPTIONS = [
  "I AM COMING TO HH GOA '26 · ARE YOU?",
  "EVERYTHING INTENTIONAL · SHIPPING IN GOA",
  "FULLSTACK BUILDER · HH GOA 2026",
  "CONFIRMED ATTENDEE · HH GOA '26",
  "PACKED & READY FOR HH GOA 2026",
  "10X CAFFEINE · 100X SUNSHINE",
  "SHIP HARD, VIBE HARDER · #FrameInGoa",
  "FROM COMMITS TO COCONUTS · GOA 2026",
  "BEYOND CREATIVITY · SHIP FIRST",
  "SUDO SHIP --DESTINATION=GOA_2026",
] as const;

// ── Stickers ─────────────────────────────────────────────────
export interface StickerDef {
  id: StickerType;
  label: string;
}

export const STICKERS: StickerDef[] = [
  { id: "wizard-hat", label: "Hacker Hat" },
  { id: "washi-tape", label: "Washi Tape" },
  { id: "verified", label: "Verified Pass" },
  { id: "signpost", label: "Signpost Stamp" },
  { id: "postmark", label: "Air Mail Stamp" },
  { id: "barcode", label: "Event Barcode" },
  { id: "sparkles", label: "Star Cluster" },
];

// ── Tech Stack Options ───────────────────────────────────────
export const TECH_STACK_OPTIONS: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "Rust",
  "Go",
  "Solidity",
  "PyTorch",
  "Solana",
  "Node.js",
  "Tailwind",
  "Vercel",
  "Supabase",
  "PostgreSQL",
  "Docker",
  "Figma",
];

// ── Builder Roles ────────────────────────────────────────────
export const ROLES = [
  "Frontend",
  "Backend",
  "Fullstack",
  "AI/ML",
  "Solana/Web3",
  "Indie Hacker",
  "Designer",
  "Founder",
  "DevOps",
  "Mobile",
] as const;
