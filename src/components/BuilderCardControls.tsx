"use client";

import { useState } from "react";
import { Shuffle, X, Plus, CreditCard, User, Sliders } from "lucide-react";
import type {
  CardData,
  CardTemplateId,
  BuilderRole,
  BackgroundStyleId,
} from "@/types";
import {
  CARD_TEMPLATES,
  TECH_STACK_OPTIONS,
  ROLES,
  BACKGROUND_STYLES,
} from "@/lib/templates";
import { getRandomTitle } from "@/lib/titles";

interface BuilderCardControlsProps {
  card: CardData;
  templateId: CardTemplateId;
  onCardChange: (updates: Partial<CardData>) => void;
  onTemplateChange: (id: CardTemplateId) => void;
}

type CardTabType = "layout" | "profile" | "details";

export default function BuilderCardControls({
  card,
  templateId,
  onCardChange,
  onTemplateChange,
}: BuilderCardControlsProps) {
  const [activeTab, setActiveTab] = useState<CardTabType>("layout");
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
    <div className="space-y-4 animate-fade-in">
      {/* Clean Segmented Sub-Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === "layout"
              ? "bg-neutral-800 text-neutral-100 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <CreditCard className="w-3 h-3" />
          Layout
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === "profile"
              ? "bg-neutral-800 text-neutral-100 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <User className="w-3 h-3" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === "details"
              ? "bg-neutral-800 text-neutral-100 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Sliders className="w-3 h-3" />
          Stack
        </button>
      </div>

      {/* Tab 1: Layout Selection */}
      {activeTab === "layout" && (
        <div className="space-y-2 animate-fade-in">
          <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Choose Badge Layout
          </label>
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {CARD_TEMPLATES.map((t) => {
              const selected = templateId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onTemplateChange(t.id as CardTemplateId)}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selected
                      ? "bg-neutral-800/90 border-neutral-400 text-neutral-100 shadow-sm"
                      : "bg-neutral-900/40 border-neutral-800/60 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900/80"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[12px] font-semibold truncate">
                      {t.label}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Profile Info */}
      {activeTab === "profile" && (
        <div className="space-y-3.5 animate-fade-in">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Full Name
            </label>
            <input
              type="text"
              value={card.name}
              maxLength={40}
              onChange={(e) => onCardChange({ name: e.target.value })}
              placeholder="John Doe"
              className="input !text-[13px]"
            />
          </div>

          {/* Handle */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
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
                className="input !pl-7 !text-[13px]"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Role
            </label>
            <div className="flex flex-wrap gap-1">
              {ROLES.slice(0, 8).map((r) => (
                <button
                  key={r}
                  onClick={() => onCardChange({ role: r as BuilderRole })}
                  className={`pill !text-[10px] !py-1 ${
                    card.role === r ? "active !bg-neutral-800 !text-neutral-100 !border-neutral-400" : ""
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Fun Title */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Fun Title
              </label>
              <button
                onClick={() =>
                  onCardChange({ funTitle: getRandomTitle(card.funTitle) })
                }
                className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Shuffle className="w-2.5 h-2.5" />
                Randomize
              </button>
            </div>
            <input
              type="text"
              value={card.funTitle}
              maxLength={50}
              onChange={(e) => onCardChange({ funTitle: e.target.value })}
              placeholder="10x Caffeine-to-Code Pipeline"
              className="input !text-[12px]"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Tech Stack & Backdrop */}
      {activeTab === "details" && (
        <div className="space-y-4 animate-fade-in">
          {/* Tech Stack */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Tech Stack
              </label>
              <span className="text-[10px] text-neutral-500 font-mono">
                {card.techStack.length}/8
              </span>
            </div>

            {card.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.techStack.map((t) => (
                  <span
                    key={t}
                    className="pill active flex items-center gap-1 !pr-1 !text-[10px]"
                  >
                    {t}
                    <button
                      onClick={() => removeTech(t)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {TECH_STACK_OPTIONS.filter((t) => !card.techStack.includes(t))
                .slice(0, 8)
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

            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={customTech}
                maxLength={20}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomTechAdd()}
                placeholder="Add custom..."
                className="input flex-1 !text-[12px] !py-1.5"
              />
              <button
                onClick={handleCustomTechAdd}
                className="btn-ghost !p-1.5 !rounded-md"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Backdrop Selection */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Card Backdrop
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {BACKGROUND_STYLES.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() =>
                    onCardChange({ bgStyle: bg.id as BackgroundStyleId })
                  }
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
      )}
    </div>
  );
}
