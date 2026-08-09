/* ──────────────────────────────────────────────────────────────
   Template Definitions & Presets – HH Goa 2026 Paper Studio
   Clean typographic presets with zero emojis.
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
  { id: "hh-goa-emerald", label: "HH Goa Emerald", preview: "#0d4a2b" },
  { id: "dark-minimal", label: "Dark Studio", preview: "#0a0a0a" },
  { id: "yellow-gingham", label: "Yellow Gingham", preview: "repeating-linear-gradient(45deg, #fef08a 0, #fef08a 10px, #fef9c3 10px, #fef9c3 20px)" },
  { id: "red-texture", label: "Red Dot Canvas", preview: "#b91c1c" },
  { id: "kraft-paper", label: "Kraft Cardstock", preview: "#d7c4a3" },
  { id: "clean-white", label: "Studio White", preview: "#f5f5f5" },
  { id: "blueprint-grid", label: "Blueprint Grid", preview: "#0f172a" },
];

// ── Caption Styles ───────────────────────────────────────────
export const CAPTION_STYLES: CaptionStyleDef[] = [
  { id: "bold-street", label: "Bold Block Ribbon" },
  { id: "handwritten", label: "Aesthetic Script" },
  { id: "typewriter-tape", label: "Typewriter Tape" },
  { id: "golden-serif", label: "Luxury Serif" },
  { id: "hacker-mono", label: "Monospace Terminal" },
];

// ── Format A: Frame Templates ────────────────────────────────
export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: "hh-goa-official",
    label: "HH Goa Official Poster",
    description: "Emerald green cardstock, radiant sunburst rays & hot pink ribbon",
    category: "official",
    colors: { primary: "#0d4a2b", secondary: "#facc15", accent: "#ec4899" },
  },
  {
    id: "hh-goa-signpost",
    label: "Beach Directional Signpost",
    description: "Wooden signpost arrows, palm silhouettes & ocean setting sun",
    category: "official",
    colors: { primary: "#08331e", secondary: "#fde047", accent: "#f43f5e" },
  },
  {
    id: "festival-wristband",
    label: "Festival VIP Wristband",
    description: "Heavy woven event ribbon with metallic gold header",
    category: "festival",
    colors: { primary: "#171717", secondary: "#facc15", accent: "#f59e0b" },
  },
  {
    id: "polaroid-tape",
    label: "Matte Paper Polaroid",
    description: "Textured photo paper with washi tape & handwritten ink",
    category: "aesthetic",
    colors: { primary: "#faf9f5", secondary: "#e5e5dc", accent: "#d97706" },
  },
  {
    id: "streetwear-poster",
    label: "Streetwear Typographic Poster",
    description: "Heavy black-box street typography wrapping the frame",
    category: "street",
    colors: { primary: "#000000", secondary: "#ffffff", accent: "#ef4444" },
  },
  {
    id: "cinema-ticket",
    label: "Admit One Cinema Ticket",
    description: "Golden retro perforated ticket with notch punch-outs",
    category: "retro",
    colors: { primary: "#f59e0b", secondary: "#78350f", accent: "#fef3c7" },
  },
  {
    id: "postage-stamp",
    label: "Perforated Air Mail Stamp",
    description: "Fine scalloped stamp teeth with circular postal mark",
    category: "aesthetic",
    colors: { primary: "#faf8f5", secondary: "#b91c1c", accent: "#1e3a8a" },
  },
  {
    id: "music-player",
    label: "Retro Cassette Deck",
    description: "Vintage audio player card with waveform and scrub bar",
    category: "retro",
    colors: { primary: "#141414", secondary: "#facc15", accent: "#facc15" },
  },
  {
    id: "magazine-editorial",
    label: "Editorial Magazine Cover",
    description: "Luxury fashion editorial masthead and yellow quote box",
    category: "aesthetic",
    colors: { primary: "#0d0d0d", secondary: "#fafafa", accent: "#f43f5e" },
  },
  {
    id: "cyber-hud-scanner",
    label: "Cyber Biometric Scan",
    description: "Developer biometric scan HUD with target reticle",
    category: "cyber",
    colors: { primary: "#050811", secondary: "#06b6d4", accent: "#10b981" },
  },
  {
    id: "minimal-gallery",
    label: "Gallery Passe-Partout",
    description: "Museum exhibition matte with coordinate stamps",
    category: "minimal",
    colors: { primary: "#1c1c1c", secondary: "#f5f5f5", accent: "#a3a3a3" },
  },
  {
    id: "goa-neon-sunset",
    label: "Goa Sunset Profile Ring",
    description: "Circular social avatar ring with gradient border",
    category: "cyber",
    colors: { primary: "#ff6b35", secondary: "#f857a6", accent: "#00f2fe" },
  },
];

// ── Format B: Card Templates ─────────────────────────────────
export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "hh-goa-emerald-badge",
    label: "HH Goa Official Pass",
    description: "Emerald green cardstock with sunburst gold & hot pink badges",
    colors: { bg: "#063d23", card: "#0d4a2b", accent: "#facc15", text: "#fefce8" },
  },
  {
    id: "boarding-pass",
    label: "Goa Air Boarding Ticket",
    description: "Luxury aviation ticket stub with barcode and flight route",
    colors: { bg: "#0a0a0a", card: "#161616", accent: "#f59e0b", text: "#f5f5f5" },
  },
  {
    id: "scrapbook-pass",
    label: "Scrapbook Polaroid Pass",
    description: "Textured matte paper pass with yellow washi tape",
    colors: { bg: "#0f0f0f", card: "#faf9f5", accent: "#d97706", text: "#171717" },
  },
  {
    id: "festival-access",
    label: "All-Access Festival Pass",
    description: "Heavy woven lanyard pass with gold metallic header",
    colors: { bg: "#080808", card: "#161616", accent: "#facc15", text: "#fafafa" },
  },
  {
    id: "holographic-vip",
    label: "Holographic Lanyard VIP",
    description: "Conference badge with iridescent foil accents",
    colors: { bg: "#0a0a0a", card: "#12131a", accent: "#c084fc", text: "#e0e7ff" },
  },
  {
    id: "cyber-terminal",
    label: "Hacker Passport",
    description: "Terminal identity document with GPS coordinates",
    colors: { bg: "#050811", card: "#0d1322", accent: "#06b6d4", text: "#e0f2fe" },
  },
  {
    id: "swiss-minimal",
    label: "Swiss Modernist",
    description: "Ultra-clean museum typography pass",
    colors: { bg: "#080808", card: "#141414", accent: "#e5e5e5", text: "#fafafa" },
  },
];

// ── Clean Typographic Preset Captions (Zero Emojis) ──────────
export const PRESET_CAPTIONS = [
  "I AM COMING TO HH GOA '26 · ARE YOU?",
  "EVERYTHING INTENTIONAL · SHIPPING IN GOA",
  "PACKED & READY FOR HH GOA 2026",
  "CONFIRMED ATTENDEE · HH GOA '26",
  "SEE YOU ON THE SHORE, BUILDERS",
  "10X CAFFEINE · 100X SUNSHINE",
  "SHIP HARD, VIBE HARDER · #FrameInGoa",
  "FROM COMMITS TO COCONUTS · GOA 2026",
  "LESS TALK, MORE SHIP · HH GOA",
  "SUDO SHIP --DESTINATION=GOA_2026",
] as const;

// ── Stickers (Clean Typographic Labels) ───────────────────────
export interface StickerDef {
  id: StickerType;
  label: string;
  iconName: string;
}

export const STICKERS: StickerDef[] = [
  { id: "signpost", label: "Signpost Stamp", iconName: "signpost" },
  { id: "sun-rising", label: "Sunburst Stamp", iconName: "sun" },
  { id: "verified", label: "Verified Pass", iconName: "verified" },
  { id: "ticket-stamp", label: "Admit One Stamp", iconName: "ticket" },
  { id: "washi-tape", label: "Washi Tape", iconName: "tape" },
  { id: "hazard-tape", label: "Hazard Strip", iconName: "hazard" },
  { id: "postmark", label: "Air Mail Mark", iconName: "postmark" },
  { id: "barcode", label: "Event Barcode", iconName: "barcode" },
  { id: "sparkles", label: "Star Cluster", iconName: "sparkles" },
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
  "SEE YOU IN GOA",
  "VIP BUILDER",
  "SPEAKER",
  "FELLOW",
  "HACKER",
] as const;
