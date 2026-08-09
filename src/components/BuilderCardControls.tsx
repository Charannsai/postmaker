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
      {/* Card style */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Card Style</label>
        <div className="grid grid-cols-2 gap-1.5">
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id as CardTemplateId)}
              className={`tmpl-card p-3 text-left ${templateId === t.id ? "selected" : ""}`}
            >
              <p className="text-[11px] font-medium text-neutral-300">{t.label}</p>
              <p className="text-[9px] text-neutral-600 mt-0.5">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Name</label>
        <input
          type="text" value={card.name} maxLength={40}
          onChange={(e) => onCardChange({ name: e.target.value })}
          placeholder="Your name" className="input"
        />
      </div>

      {/* Handle */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Handle</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-neutral-600">@</span>
          <input
            type="text" value={card.handle} maxLength={30}
            onChange={(e) => onCardChange({ handle: e.target.value })}
            placeholder="username" className="input !pl-7"
          />
        </div>
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Role</label>
        <div className="flex flex-wrap gap-1">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => onCardChange({ role: r as BuilderRole })}
              className={`pill !text-[10px] ${card.role === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Fun title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Title</label>
          <button
            onClick={() => onCardChange({ funTitle: getRandomTitle(card.funTitle) })}
            className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <Shuffle className="w-3 h-3" />
            Random
          </button>
        </div>
        <input
          type="text" value={card.funTitle} maxLength={50}
          onChange={(e) => onCardChange({ funTitle: e.target.value })}
          placeholder="Your fun title" className="input"
        />
      </div>

      {/* Tech stack */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
          Stack <span className="text-neutral-700">{card.techStack.length}/8</span>
        </label>

        {card.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.techStack.map((t) => (
              <span key={t} className="pill active flex items-center gap-1 !pr-1">
                {t}
                <button onClick={() => removeTech(t)} className="hover:text-red-400 transition-colors">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {TECH_STACK_OPTIONS.filter((t) => !card.techStack.includes(t)).slice(0, 12).map((t) => (
            <button key={t} onClick={() => addTech(t)} className="pill !text-[10px] !py-0.5 !text-neutral-700 hover:!text-neutral-400">
              + {t}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <input
            type="text" value={customTech} maxLength={20}
            onChange={(e) => setCustomTech(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomTechAdd()}
            placeholder="Custom..." className="input flex-1 !text-[12px]"
          />
          <button onClick={handleCustomTechAdd} className="btn-ghost !p-2 !rounded-md">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tagline */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
          Tagline <span className="text-neutral-700">optional</span>
        </label>
        <input
          type="text" value={card.tagline} maxLength={60}
          onChange={(e) => onCardChange({ tagline: e.target.value })}
          placeholder="Shipping agents by the beach" className="input"
        />
      </div>
    </div>
  );
}
