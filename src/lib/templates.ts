/* ──────────────────────────────────────────────────────────────
   Template Definitions – Frames (Format A) & Cards (Format B)
   ────────────────────────────────────────────────────────────── */

import type {
  FrameTemplate,
  CardTemplate,
  FilterDef,
  FilterType,
} from "@/types";

// ── Photo Filters ────────────────────────────────────────────
export const FILTERS: FilterDef[] = [
  { id: "original", label: "Original", css: "none" },
  {
    id: "goa-sunset",
    label: "Goa Sunset",
    css: "saturate(1.4) sepia(0.25) hue-rotate(-10deg) brightness(1.05)",
  },
  {
    id: "cyber-neon",
    label: "Cyber Neon",
    css: "saturate(1.8) contrast(1.2) brightness(1.1) hue-rotate(180deg)",
  },
  {
    id: "golden-hour",
    label: "Golden Hour",
    css: "sepia(0.35) saturate(1.3) brightness(1.1) contrast(1.05)",
  },
  {
    id: "monochrome",
    label: "Monochrome",
    css: "grayscale(1) contrast(1.15) brightness(1.05)",
  },
  {
    id: "high-contrast",
    label: "High Contrast",
    css: "contrast(1.5) saturate(1.2) brightness(1.05)",
  },
];

export function getFilterCss(id: FilterType): string {
  return FILTERS.find((f) => f.id === id)?.css ?? "none";
}

// ── PFP Frame Templates (Format A) ──────────────────────────
export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: "goa-neon-sunset",
    label: "Goa Neon Sunset",
    description: "Radiant neon ring with tropical vibes",
    colors: {
      primary: "#ff6b35",
      secondary: "#f7931e",
      accent: "#00f2fe",
      glow: "#ff6b3566",
    },
  },
  {
    id: "cyber-matrix",
    label: "Cyber Matrix",
    description: "Futuristic circuit traces & HUD accents",
    colors: {
      primary: "#00f2fe",
      secondary: "#4facfe",
      accent: "#0cff0c",
      glow: "#00f2fe44",
    },
  },
  {
    id: "holographic-foil",
    label: "Holographic Foil",
    description: "Iridescent shifting color border",
    colors: {
      primary: "#f857a6",
      secondary: "#4facfe",
      accent: "#43e97b",
      glow: "#f857a644",
    },
  },
  {
    id: "minimal-luxury",
    label: "Minimal Luxury",
    description: "Frosted glass with gold accents",
    colors: {
      primary: "#d4af37",
      secondary: "#f5e6a3",
      accent: "#ffffff",
      glow: "#d4af3733",
    },
  },
  {
    id: "beach-vibes-retro",
    label: "Beach Vibes Retro",
    description: "Sunburst gradient with palm badge",
    colors: {
      primary: "#fc5c7d",
      secondary: "#6a82fb",
      accent: "#ffeaa7",
      glow: "#fc5c7d44",
    },
  },
];

// ── Builder ID Card Templates (Format B) ────────────────────
export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "holographic-vip",
    label: "Holographic VIP Pass",
    description: "Conference lanyard with reflective foil",
    colors: {
      bg: "#0a0d14",
      card: "#12162a",
      accent: "#f857a6",
      text: "#e8eaf6",
      glow: "#f857a633",
    },
  },
  {
    id: "cyber-terminal",
    label: "Cyber Terminal",
    description: "Dark neon cyberpunk terminal badge",
    colors: {
      bg: "#050a0e",
      card: "#0d1520",
      accent: "#00f2fe",
      text: "#c8ffc8",
      glow: "#00f2fe33",
    },
  },
  {
    id: "goa-sunset-pass",
    label: "Goa Sunset Pass",
    description: "Warm tropical sunset with gold accents",
    colors: {
      bg: "#1a0a0a",
      card: "#2a1215",
      accent: "#ff6b35",
      text: "#ffecd2",
      glow: "#ff6b3533",
    },
  },
  {
    id: "indie-minimalist",
    label: "Indie Minimalist",
    description: "Ultra-clean frosted glass badge",
    colors: {
      bg: "#0f0f13",
      card: "#1a1a24",
      accent: "#a78bfa",
      text: "#e2e8f0",
      glow: "#a78bfa33",
    },
  },
];

// ── Tech Stack Tags ─────────────────────────────────────────
export const TECH_STACK_OPTIONS: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "Solidity",
  "Node.js",
  "Tailwind",
  "Vue",
  "Svelte",
  "PyTorch",
  "TensorFlow",
  "Docker",
  "AWS",
  "Vercel",
  "Supabase",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "Flutter",
  "Swift",
  "Kotlin",
  "Solana",
  "Ethereum",
  "Figma",
];

// ── Badge Preset Texts ──────────────────────────────────────
export const BADGE_PRESETS = [
  "SEE YOU IN GOA 🌴",
  "VIP BUILDER",
  "SPEAKER",
  "HACKATHON WINNER",
  "INDIE HACKER",
  "OPEN SOURCE",
] as const;

// ── Role options ────────────────────────────────────────────
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
