/* ──────────────────────────────────────────────────────────────
   Template Definitions & Presets – HH Goa 2026
   ────────────────────────────────────────────────────────────── */

import type {
  FrameTemplate,
  CardTemplate,
  FilterDef,
  FilterType,
  BackgroundStyle,
  StickerType,
} from "@/types";

// ── Photo Filters ────────────────────────────────────────────
export const FILTERS: FilterDef[] = [
  { id: "original", label: "Original", css: "none" },
  {
    id: "vintage-warm",
    label: "Vintage Warm",
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
  {
    id: "cyber-neon",
    label: "Cyber Neon",
    css: "saturate(1.8) contrast(1.2) hue-rotate(170deg)",
  },
];

export function getFilterCss(id: FilterType): string {
  return FILTERS.find((f) => f.id === id)?.css ?? "none";
}

// ── Canvas Background Styles ─────────────────────────────────
export const BACKGROUND_STYLES: BackgroundStyle[] = [
  { id: "dark-minimal", label: "Dark Studio", preview: "#0a0a0a" },
  { id: "yellow-gingham", label: "Yellow Gingham", preview: "repeating-linear-gradient(45deg, #fef08a 0, #fef08a 10px, #fef9c3 10px, #fef9c3 20px)" },
  { id: "red-texture", label: "Red Dot Canvas", preview: "#b91c1c" },
  { id: "kraft-paper", label: "Kraft Paper", preview: "#d7c4a3" },
  { id: "clean-white", label: "Studio White", preview: "#f5f5f5" },
  { id: "blueprint-grid", label: "Blueprint Grid", preview: "#0f172a" },
];

// ── Format A: Frame Templates ────────────────────────────────
export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: "polaroid-tape",
    label: "Vintage Polaroid",
    description: "Classic paper frame with washi tape & handwritten caption",
    category: "aesthetic",
    colors: {
      primary: "#f5f5f0",
      secondary: "#e5e5dc",
      accent: "#e2b714",
      bg: "#111",
    },
  },
  {
    id: "postage-stamp",
    label: "Postage Stamp",
    description: "Serrated perforated stamp with postal cancellation mark",
    category: "aesthetic",
    colors: {
      primary: "#faf8f5",
      secondary: "#c84338",
      accent: "#1e3a8a",
      bg: "#991b1b",
    },
  },
  {
    id: "music-player",
    label: "Retro Cassette / Player",
    description: "Vintage music player card with waveform & scrub bar",
    category: "retro",
    colors: {
      primary: "#141414",
      secondary: "#facc15",
      accent: "#facc15",
      bg: "#0a0a0a",
    },
  },
  {
    id: "magazine-editorial",
    label: "Editorial Magazine",
    description: "High-fashion aesthetic magazine cover with bold typography",
    category: "aesthetic",
    colors: {
      primary: "#0d0d0d",
      secondary: "#fafafa",
      accent: "#f43f5e",
      bg: "#000",
    },
  },
  {
    id: "minimal-gallery",
    label: "Gallery Passe-Partout",
    description: "Museum exhibition frame with fine matting & coordinates",
    category: "minimal",
    colors: {
      primary: "#1c1c1c",
      secondary: "#f5f5f5",
      accent: "#a3a3a3",
      bg: "#0a0a0a",
    },
  },
  {
    id: "goa-neon-sunset",
    label: "Goa Sunset PFP Ring",
    description: "Branded circular profile ring with tropical sunset glow",
    category: "cyber",
    colors: {
      primary: "#ff6b35",
      secondary: "#f857a6",
      accent: "#00f2fe",
      bg: "#0a0d14",
    },
  },
  {
    id: "cyber-matrix",
    label: "Hacker Terminal Ring",
    description: "Circuit traces, HUD accents, and monospace coordinates",
    category: "cyber",
    colors: {
      primary: "#00f2fe",
      secondary: "#10b981",
      accent: "#a78bfa",
      bg: "#050a0e",
    },
  },
];

// ── Format B: Card Templates ─────────────────────────────────
export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "scrapbook-pass",
    label: "Scrapbook Polaroid Pass",
    description: "Aesthetic taped polaroid with badges & sticker tags",
    colors: {
      bg: "#0f0f0f",
      card: "#f4f1ea",
      accent: "#e2b714",
      text: "#171717",
    },
  },
  {
    id: "boarding-pass",
    label: "Goa Air Boarding Pass",
    description: "Flight / event ticket with perforated tear-off barcode stub",
    colors: {
      bg: "#0a0a0a",
      card: "#161616",
      accent: "#f59e0b",
      text: "#f5f5f5",
    },
  },
  {
    id: "holographic-vip",
    label: "Holographic Lanyard VIP",
    description: "Official conference lanyard badge with holographic shine",
    colors: {
      bg: "#0a0a0a",
      card: "#12131a",
      accent: "#c084fc",
      text: "#e0e7ff",
    },
  },
  {
    id: "cyber-terminal",
    label: "Hacker Passport",
    description: "Cyberpunk developer passport with live stats & GPS coords",
    colors: {
      bg: "#050811",
      card: "#0d1322",
      accent: "#06b6d4",
      text: "#e0f2fe",
    },
  },
  {
    id: "swiss-minimal",
    label: "Swiss Modernist",
    description: "Ultra-clean museum typography pass with precise layout",
    colors: {
      bg: "#080808",
      card: "#141414",
      accent: "#e5e5e5",
      text: "#fafafa",
    },
  },
];

// ── Preset Captions ──────────────────────────────────────────
export const PRESET_CAPTIONS = [
  "see the good 🌴",
  "She sparkles like sunshine.",
  "See you in Goa 2026 ☀️",
  "building by the beach 🌊",
  "10x builder energy ⚡",
  "beach hackathon vibes ✨",
  "hacker house goa · 2026",
  "ship first, sunbathe later 🏖️",
] as const;

// ── Stickers ─────────────────────────────────────────────────
export interface StickerDef {
  id: StickerType;
  label: string;
  emoji: string;
}

export const STICKERS: StickerDef[] = [
  { id: "washi-tape", label: "Washi Tape", emoji: "📼" },
  { id: "sunflower", label: "Sunflower", emoji: "🌻" },
  { id: "palm", label: "Goa Palm", emoji: "🌴" },
  { id: "postmark", label: "Air Mail Stamp", emoji: "✉️" },
  { id: "barcode", label: "Barcode", emoji: "🏷️" },
  { id: "sparkles", label: "Sparkles", emoji: "✨" },
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

export const BADGE_PRESETS = [
  "SEE YOU IN GOA 🌴",
  "VIP BUILDER",
  "SPEAKER",
  "FELLOW",
  "HACKER",
] as const;
