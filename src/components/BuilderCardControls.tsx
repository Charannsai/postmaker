"use client";

import { Shuffle, X, Plus } from "lucide-react";
import type {
  CardData,
  CardTemplateId,
  BuilderRole,
  BackgroundStyleId,
  StickerType,
} from "@/types";
import {
  CARD_TEMPLATES,
  TECH_STACK_OPTIONS,
  ROLES,
  BACKGROUND_STYLES,
  STICKERS,
} from "@/lib/templates";
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

  const toggleSticker = (id: StickerType) => {
    const current = card.stickers || [];
    if (current.includes(id)) {
      onCardChange({ stickers: current.filter((s) => s !== id) });
    } else {
      onCardChange({ stickers: [...current, id] });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Card Template Style */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Badge Layout Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id as CardTemplateId)}
              className={`tmpl-card p-3 flex flex-col text-left transition-all ${
                templateId === t.id
                  ? "selected !border-neutral-400 !bg-neutral-900"
                  : ""
              }`}
            >
              <p className="text-[12px] font-semibold text-neutral-200">
                {t.label}
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {t.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Builder Name & Handle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            value={card.name}
            maxLength={40}
            onChange={(e) => onCardChange({ name: e.target.value })}
            placeholder="John Doe"
            className="input"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            X / GitHub Handle
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-neutral-500">
              @
            </span>
            <input
              type="text"
              value={card.handle}
              maxLength={30}
              onChange={(e) => onCardChange({ handle: e.target.value })}
              placeholder="username"
              className="input !pl-7"
            />
          </div>
        </div>
      </div>

      {/* 3. Role */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
          Role / Domain
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => onCardChange({ role: r as BuilderRole })}
              className={`pill !text-[11px] ${
                card.role === r ? "active !bg-neutral-800 !text-neutral-100 !border-neutral-400" : ""
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Fun Title with Randomizer */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Fun Title
          </label>
          <button
            onClick={() =>
              onCardChange({ funTitle: getRandomTitle(card.funTitle) })
            }
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <Shuffle className="w-3 h-3" />
            Randomize Title
          </button>
        </div>
        <input
          type="text"
          value={card.funTitle}
          maxLength={50}
          onChange={(e) => onCardChange({ funTitle: e.target.value })}
          placeholder="10x Caffeine-to-Code Pipeline"
          className="input"
        />
      </div>

      {/* 5. Tech Stack Pills */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
          Tech Stack{" "}
          <span className="text-neutral-600">({card.techStack.length}/8)</span>
        </label>

        {card.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {card.techStack.map((t) => (
              <span
                key={t}
                className="pill active flex items-center gap-1 !pr-1 !text-[11px]"
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

        <div className="flex flex-wrap gap-1">
          {TECH_STACK_OPTIONS.filter((t) => !card.techStack.includes(t))
            .slice(0, 10)
            .map((t) => (
              <button
                key={t}
                onClick={() => addTech(t)}
                className="pill !text-[10px] !py-0.5 !text-neutral-600 hover:!text-neutral-300"
              >
                + {t}
              </button>
            ))}
        </div>

        <div className="flex gap-1.5">
          <input
            type="text"
            value={customTech}
            maxLength={20}
            onChange={(e) => setCustomTech(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomTechAdd()}
            placeholder="Add custom stack..."
            className="input flex-1 !text-[12px]"
          />
          <button
            onClick={handleCustomTechAdd}
            className="btn-ghost !p-2 !rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6. Card Backdrop */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Card Backdrop
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {BACKGROUND_STYLES.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onCardChange({ bgStyle: bg.id as BackgroundStyleId })}
              className={`p-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                card.bgStyle === bg.id
                  ? "bg-neutral-800 text-neutral-100 border-neutral-400"
                  : "bg-neutral-950 text-neutral-500 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
