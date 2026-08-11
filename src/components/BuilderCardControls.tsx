"use client";

import { useState } from "react";
import type { CardData, BuilderRole } from "@/types";
import { ROLES, TECH_STACK_OPTIONS } from "@/lib/templates";
import { Shuffle, AlertCircle, CheckCircle2, Plus, X } from "lucide-react";

interface BuilderCardControlsProps {
  card: CardData;
  onCardChange: (updates: Partial<CardData>) => void;
  validationError?: string | null;
}

const FUN_TITLES = [
  "Everything intentional. Shipping in Goa.",
  "10x Caffeine-to-Code Pipeline",
  "Zero-to-Ship Speedrunner",
  "Ship First, Sleep Later",
  "Building the Future on the Beach",
  "Solana Transaction Wizard",
  "Full-Stack Caffeine Engine",
];

export default function BuilderCardControls({
  card,
  onCardChange,
  validationError,
}: BuilderCardControlsProps) {
  const [customTech, setCustomTech] = useState("");

  const randomizeTitle = () => {
    const filtered = FUN_TITLES.filter((t) => t !== card.funTitle);
    onCardChange({
      funTitle: filtered[Math.floor(Math.random() * filtered.length)],
    });
  };

  const handleNameChange = (val: string) => {
    // Allow letters, spaces, hyphens, apostrophes, and dots
    const cleaned = val.replace(/[^a-zA-Z\s.'-]/g, "");
    onCardChange({ name: cleaned });
  };

  const handleHandleChange = (val: string) => {
    // Remove invalid handle characters (keep alphanumeric, underscores, @)
    let cleaned = val.replace(/[^a-zA-Z0-9_@]/g, "");
    if (cleaned.startsWith("@")) {
      cleaned = "@" + cleaned.slice(1).replace(/@/g, "");
    }
    onCardChange({ handle: cleaned });
  };

  const toggleTech = (tech: string) => {
    const current = card.techStack || [];
    const isSelected = current.includes(tech);
    const updated = isSelected
      ? current.filter((t) => t !== tech)
      : [...current, tech];
    onCardChange({ techStack: updated });
  };

  const handleAddCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTech.trim();
    if (trimmed && !(card.techStack || []).includes(trimmed)) {
      onCardChange({ techStack: [...(card.techStack || []), trimmed] });
      setCustomTech("");
    }
  };

  const isNameValid = card.name.trim().length >= 2;

  return (
    <div className="space-y-4 text-emerald-100">
      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-pink-950/70 border border-pink-500/60 text-pink-200 text-xs font-mono shadow-md animate-fade-in">
          <AlertCircle className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
            Full Name <span className="text-pink-400">*</span>
          </label>
          <span className="text-[10px] font-mono text-emerald-300/60">
            {card.name.length}/26
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={card.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Alex Rivera"
            maxLength={26}
            className={`input !text-[14px] !font-bold transition-all ${
              validationError && !isNameValid
                ? "!border-pink-500 !bg-pink-950/20 focus:!border-pink-400 shadow-sm shadow-pink-950"
                : ""
            }`}
          />
          {isNameValid && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>
        {!card.name.trim() && (
          <p className="text-[10px] text-emerald-300/70 font-mono">
            Required. Enter your name as it will appear on your Builder Card.
          </p>
        )}
      </div>

      {/* Handle */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
            𝕏 Handle
          </label>
          <span className="text-[10px] font-mono text-emerald-300/60">
            {card.handle.length}/22
          </span>
        </div>
        <input
          type="text"
          value={card.handle}
          onChange={(e) => handleHandleChange(e.target.value)}
          placeholder="e.g. @alexbuilds"
          maxLength={22}
          className="input !text-[13px]"
        />
      </div>

      {/* Role / Builder Class */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
            Role / Builder Class
          </label>
          <span className="text-[10px] font-mono text-emerald-300/60">
            {card.role.length}/24
          </span>
        </div>
        <input
          type="text"
          value={card.role}
          onChange={(e) => onCardChange({ role: e.target.value as BuilderRole })}
          placeholder="e.g. Fullstack, Solana Dev..."
          maxLength={24}
          className="input !text-[13px]"
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onCardChange({ role: r as BuilderRole })}
              className={`pill !text-[10px] !py-1 ${
                card.role === r ? "active" : ""
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="space-y-2 pt-2 border-t border-[#166940]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider block">
            Tech Stack ({card.techStack?.length || 0})
          </label>
          <span className="text-[10px] font-mono text-emerald-300/60">
            Select technologies
          </span>
        </div>

        {/* Active Tech Badges */}
        {card.techStack && card.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {card.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ffe600] text-[#031c10] text-[11px] font-mono font-bold"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className="hover:text-pink-600 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Preset Pill Toggles */}
        <div className="flex flex-wrap gap-1.5">
          {TECH_STACK_OPTIONS.map((tech) => {
            const isSelected = card.techStack?.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`pill !text-[10px] !py-0.5 ${
                  isSelected ? "active !bg-[#ffe600] !text-[#031c10] font-bold" : ""
                }`}
              >
                {isSelected ? `✓ ${tech}` : tech}
              </button>
            );
          })}
        </div>

        {/* Custom Tech Add Input */}
        <form onSubmit={handleAddCustomTech} className="flex gap-1.5 pt-1">
          <input
            type="text"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            placeholder="Add custom tech (e.g. Elixir, Svelte)..."
            className="input !text-[11px] !py-1 flex-1"
          />
          <button
            type="submit"
            disabled={!customTech.trim()}
            className="px-2.5 py-1 bg-[#166940] hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-mono text-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </form>
      </div>

      {/* Fun Title / Tagline */}
      <div className="space-y-1 pt-2 border-t border-[#166940]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono font-bold text-[#ffe600] uppercase tracking-wider">
            Tagline
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-300/60">
              {card.funTitle.length}/45
            </span>
            <button
              type="button"
              onClick={randomizeTitle}
              className="flex items-center gap-1 text-[10px] text-[#ffe600] hover:text-[#fff066] font-mono font-semibold"
            >
              <Shuffle className="w-3 h-3" /> Random
            </button>
          </div>
        </div>
        <input
          type="text"
          value={card.funTitle}
          onChange={(e) => onCardChange({ funTitle: e.target.value })}
          placeholder="e.g. Building the future in Goa"
          maxLength={45}
          className="input !text-[12px]"
        />
      </div>
    </div>
  );
}




