/* ──────────────────────────────────────────────────────────────
   Fun Builder Titles – HH Goa 2026
   ────────────────────────────────────────────────────────────── */

export const BUILDER_TITLES: string[] = [
  "10x Caffeine-to-Code Pipeline",
  "Prompt Whisperer & CSS Sorcerer",
  "Solana Degenerate & Beach Coder",
  "Sleep-Deprived AI Architect",
  "Giga-chad Full-Stack Shipper",
  "Bug Whisperer (They Fear Me)",
  "GPT-Powered Vibe Coder",
  "Ctrl+Z Abuser & Feature Deployer",
  "sudo rm -rf doubts && build",
  "Recursive Thinker, Iterative Builder",
  "Open Source Evangelist & Chai Addict",
  "Hackathon Survivor (3x Champion)",
  "Type-Safe Maximalist",
  "Midnight Deploy Specialist",
  "Zero-to-One Speed Runner",
  "Meme-Driven Developer",
  "Stack Overflow Hall of Famer",
  "git push --force Advocate",
  "Production Debugger at 3 AM",
  "Ship First, Refactor Never",
  "AI Agent Whisperer",
  "Pixel-Perfect Purist",
  "Blockchain Enthusiast & Beach Bum",
  "Async/Await Artisan",
  "Docker Compose Maestro",
  "Figma-to-Code Speedrunner",
  "API Whisperer & Rate-Limit Dodger",
  "Neural Net Tamer",
  "README.md Perfectionist",
  "Monorepo Monk & Deploy Ninja",
  "Vercel Deploy Button Addict",
  "console.log Debugger Extraordinaire",
  "TypeScript Zealot (no any allowed)",
  "Rust Evangelist (btw, I use Rust)",
  "Beach Hackathon Energy ☀️",
];

/**
 * Returns a random builder title from the list.
 * Optionally exclude the current title so we always get something fresh.
 */
export function getRandomTitle(exclude?: string): string {
  const pool = exclude
    ? BUILDER_TITLES.filter((t) => t !== exclude)
    : BUILDER_TITLES;
  return pool[Math.floor(Math.random() * pool.length)];
}
