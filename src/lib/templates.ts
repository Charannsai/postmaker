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
  CaptionStyleDef,
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

// ── Caption Styles ───────────────────────────────────────────
export const CAPTION_STYLES: CaptionStyleDef[] = [
  { id: "handwritten", label: "Aesthetic Script" },
  { id: "bold-street", label: "Bold Street Banner" },
  { id: "typewriter-tape", label: "Typewriter Tape" },
  { id: "golden-serif", label: "Luxury Serif" },
  { id: "hacker-mono", label: "Hacker Terminal" },
];

// ── Format A: Frame Templates ────────────────────────────────
export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: "polaroid-tape",
    label: "Vintage Polaroid",
    description: "Classic photo paper with washi tape & aesthetic script",
    category: "aesthetic",
    colors: { primary: "#faf9f5", secondary: "#e5e5dc", accent: "#d97706" },
  },
  {
    id: "festival-wristband",
    label: "Festival VIP Wristband",
    description: "Official event wristband banner: I am coming to HH GOA 26",
    category: "festival",
    colors: { primary: "#171717", secondary: "#facc15", accent: "#f59e0b" },
  },
  {
    id: "streetwear-poster",
    label: "Streetwear Poster",
    description: "Heavy typographic street poster wrapping the image",
    category: "street",
    colors: { primary: "#000000", secondary: "#ffffff", accent: "#ef4444" },
  },
  {
    id: "cinema-ticket",
    label: "Admit One Cinema Ticket",
    description: "Golden retro admit-one ticket with perforated notches",
    category: "retro",
    colors: { primary: "#f59e0b", secondary: "#78350f", accent: "#fef3c7" },
  },
  {
    id: "postage-stamp",
    label: "Air Mail Postage Stamp",
    description: "Perforated serrated stamp with circular postmark cancellation",
    category: "aesthetic",
    colors: { primary: "#faf8f5", secondary: "#b91c1c", accent: "#1e3a8a" },
  },
  {
    id: "music-player",
    label: "Retro Cassette / Player",
    description: "Vintage music player card with waveform & scrub bar",
    category: "retro",
    colors: { primary: "#141414", secondary: "#facc15", accent: "#facc15" },
  },
  {
    id: "magazine-editorial",
    label: "Editorial Magazine Cover",
    description: "High-fashion aesthetic magazine cover with bold typography",
    category: "aesthetic",
    colors: { primary: "#0d0d0d", secondary: "#fafafa", accent: "#f43f5e" },
  },
  {
    id: "cyber-hud-scanner",
    label: "Cyber Biometric Scan",
    description: "Sci-fi HUD developer scanner with crosshairs & stats",
    category: "cyber",
    colors: { primary: "#050811", secondary: "#06b6d4", accent: "#10b981" },
  },
  {
    id: "minimal-gallery",
    label: "Gallery Passe-Partout",
    description: "Museum exhibition frame with fine matting & coordinates",
    category: "minimal",
    colors: { primary: "#1c1c1c", secondary: "#f5f5f5", accent: "#a3a3a3" },
  },
  {
    id: "goa-neon-sunset",
    label: "Goa Sunset PFP Ring",
    description: "Branded circular profile ring with tropical sunset glow",
    category: "cyber",
    colors: { primary: "#ff6b35", secondary: "#f857a6", accent: "#00f2fe" },
  },
  {
    id: "cyber-matrix",
    label: "Hacker Terminal Ring",
    description: "Circuit traces, HUD accents, and monospace coordinates",
    category: "cyber",
    colors: { primary: "#00f2fe", secondary: "#10b981", accent: "#a78bfa" },
  },
];

// ── Format B: Card Templates ─────────────────────────────────
export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "scrapbook-pass",
    label: "Scrapbook Polaroid Pass",
    description: "Aesthetic taped polaroid with badges & sticker tags",
    colors: { bg: "#0f0f0f", card: "#faf9f5", accent: "#d97706", text: "#171717" },
  },
  {
    id: "festival-access",
    label: "All-Access Festival Pass",
    description: "Official fabric festival pass with RFID chip & lanyard clasp",
    colors: { bg: "#080808", card: "#161616", accent: "#facc15", text: "#fafafa" },
  },
  {
    id: "boarding-pass",
    label: "Goa Air Boarding Pass",
    description: "Flight / event ticket with perforated tear-off barcode stub",
    colors: { bg: "#0a0a0a", card: "#161616", accent: "#f59e0b", text: "#f5f5f5" },
  },
  {
    id: "holographic-vip",
    label: "Holographic Lanyard VIP",
    description: "Official conference lanyard badge with holographic shine",
    colors: { bg: "#0a0a0a", card: "#12131a", accent: "#c084fc", text: "#e0e7ff" },
  },
  {
    id: "cyber-terminal",
    label: "Hacker Passport",
    description: "Cyberpunk developer passport with live stats & GPS coords",
    colors: { bg: "#050811", card: "#0d1322", accent: "#06b6d4", text: "#e0f2fe" },
  },
  {
    id: "swiss-minimal",
    label: "Swiss Modernist",
    description: "Ultra-clean museum typography pass with precise layout",
    colors: { bg: "#080808", card: "#141414", accent: "#e5e5e5", text: "#fafafa" },
  },
];

// ── Preset Captions ──────────────────────────────────────────
export const PRESET_CAPTIONS = [
  "I am coming to HH GOA 26, Are you? 🌴",
  "PACKED & READY FOR HH GOA 2026 🚀",
  "See you on the beach, hackers! 🏖️",
  "CONFIRMED ATTENDEE · HH GOA '26 ✨",
  "10x Caffeine, 100x Sunshine ☀️",
  "Ship hard, vibe harder 🌊 #FrameInGoa",
  "see the good 🌴",
  "She sparkles like sunshine.",
  "From commits to coconuts 🥥",
  "sudo pack-bags --destination=goa",
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
  { id: "verified", label: "VIP Verified", emoji: "⚡" },
  { id: "ticket-stamp", label: "Admit One", emoji: "🎟️" },
  { id: "hazard-tape", label: "Caution Strip", emoji: "🚧" },
  { id: "postmark", label: "Air Mail Stamp", emoji: "✉️" },
  { id: "barcode", label: "Barcode", emoji: "🏷️" },
  { id: "sparkles", label: "Sparkles", emoji: "✨" },
  { id: "palm", label: "Goa Palm", emoji: "🌴" },
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
