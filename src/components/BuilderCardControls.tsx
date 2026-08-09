"use client";

import { Shuffle, X, Plus } from "lucide-react";
import type { CardData, CardTemplateId, BuilderRole } from "@/types";
import { CARD_TEMPLATES, TECH_STACK_OPTIONS, ROLES } from "@/lib/templates";
import { getRandomTitle } from "@/lib/titles";
import { useState } from "react";

interface BuilderCardControlsProps {
  card: CardData;
  templateId: CardTemplateId;
  onCardChange: (updates: Partial<CardData>) => void;
  onTemplateChange: (id: CardTemplateId) => void;
}

export default function BuilderCardControls({
  card,
  templateId,
  onCardChange,
  onTemplateChange,
}: BuilderCardControlsProps) {
  const [customTech, setCustomTech] = useState("");

  const addTech = (tech: string) => {
    if (!card.techStack.includes(tech) && card.techStack.length < 8) {
      onCardChange({ techStack: [...card.techStack, tech] });
    }
  };

  const removeTech = (tech: string) => {
    onCardChange({ techStack: card.techStack.filter((t) => t !== tech) });
  };

  const handleCustomTechAdd = () => {
    const t = customTech.trim();
    if (t && !card.techStack.includes(t) && card.techStack.length < 8) {
      onCardChange({ techStack: [...card.techStack, t] });
      setCustomTech("");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      {/* Card templates */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Card Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id as CardTemplateId)}
              className={`template-card glass-card p-3 text-left ${
                templateId === t.id ? "selected" : ""
              }`}
            >
              <div
                className="w-full h-2 rounded-full mb-2"
                style={{
                  background: `linear-gradient(90deg, ${t.colors.accent}, ${t.colors.glow.replace("33", "aa")})`,
                }}
              />
              <p className="text-[11px] font-semibold text-white/70 leading-tight">
                {t.label}
              </p>
              <p className="text-[9px] text-white/25 mt-0.5">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Full Name
        </label>
        <input
          type="text"
          value={card.name}
          onChange={(e) => onCardChange({ name: e.target.value })}
          placeholder="John Doe"
          maxLength={40}
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
        />
      </div>

      {/* Handle */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          X / GitHub Handle
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/25">
            @
          </span>
          <input
            type="text"
            value={card.handle}
            onChange={(e) => onCardChange({ handle: e.target.value })}
            placeholder="username"
            maxLength={30}
            className="w-full bg-white/[0.04] border border-white/8 rounded-lg pl-7 pr-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
          />
        </div>
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Role / Domain
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => onCardChange({ role: r as BuilderRole })}
              className={`tech-pill !text-[10px] ${
                card.role === r
                  ? "active !bg-neon-pink/15 !border-neon-pink/30 !text-neon-pink"
                  : ""
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Fun title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Fun Title
          </label>
          <button
            onClick={() =>
              onCardChange({ funTitle: getRandomTitle(card.funTitle) })
            }
            className="flex items-center gap-1 text-[10px] text-neon-cyan/70 hover:text-neon-cyan transition-colors font-medium"
          >
            <Shuffle className="w-3 h-3" />
            Randomize
          </button>
        </div>
        <input
          type="text"
          value={card.funTitle}
          onChange={(e) => onCardChange({ funTitle: e.target.value })}
          placeholder="10x Caffeine-to-Code Pipeline"
          maxLength={50}
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
        />
      </div>

      {/* Tech stack */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Tech Stack{" "}
          <span className="text-white/20">({card.techStack.length}/8)</span>
        </label>

        {/* Selected pills */}
        {card.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {card.techStack.map((t) => (
              <span
                key={t}
                className="tech-pill active flex items-center gap-1 !pr-1.5"
              >
                {t}
                <button
                  onClick={() => removeTech(t)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Available options */}
        <div className="flex flex-wrap gap-1">
          {TECH_STACK_OPTIONS.filter((t) => !card.techStack.includes(t))
            .slice(0, 14)
            .map((t) => (
              <button
                key={t}
                onClick={() => addTech(t)}
                className="tech-pill !text-[10px] !py-0.5 !px-2 !text-white/25 !border-white/8 hover:!text-neon-cyan/60 hover:!border-neon-cyan/20"
              >
                + {t}
              </button>
            ))}
        </div>

        {/* Custom tech input */}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomTechAdd()}
            placeholder="Add custom..."
            maxLength={20}
            className="flex-1 bg-white/[0.04] border border-white/8 rounded-lg px-3 py-1.5 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
          />
          <button
            onClick={handleCustomTechAdd}
            className="btn-secondary !p-1.5 !rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tagline */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Status Tagline{" "}
          <span className="text-white/20">(optional)</span>
        </label>
        <input
          type="text"
          value={card.tagline}
          onChange={(e) => onCardChange({ tagline: e.target.value })}
          placeholder="Shipping agents by the beach"
          maxLength={60}
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
        />
      </div>
    </div>
  );
}
