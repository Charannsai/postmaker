"use client";

import { useState } from "react";
import type {
  CardData,
  CardTemplateId,
  BuilderRole,
  BackgroundStyleId,
} from "@/types";
import {
  CARD_TEMPLATES,
  ROLES,
  TECH_STACK_OPTIONS,
  BACKGROUND_STYLES,
} from "@/lib/templates";
import { LayoutGrid, User, Cpu, Shuffle } from "lucide-react";

interface BuilderCardControlsProps {
  card: CardData;
  templateId: CardTemplateId;
  onCardChange: (updates: Partial<CardData>) => void;
  onTemplateChange: (templateId: CardTemplateId) => void;
}

const FUN_TITLES = [
  "10x Caffeine-to-Code Pipeline",
  "Zero-to-Ship Speedrunner",
  "Chief Git Conflict Resolver",
  "Full-Stack Caffeine Engine",
  "Solana Transaction Wizard",
  "Building the Future on the Beach",
  "Ship First, Sleep Later",
];

type TabType = "layout" | "profile" | "stack";

export default function BuilderCardControls({
  card,
  templateId,
  onCardChange,
  onTemplateChange,
}: BuilderCardControlsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("layout");

  const toggleTech = (tech: string) => {
    const current = card.techStack || [];
    if (current.includes(tech)) {
      onCardChange({ techStack: current.filter((t) => t !== tech) });
    } else if (current.length < 5) {
      onCardChange({ techStack: [...current, tech] });
    }
  };

  const randomizeTitle = () => {
    const filtered = FUN_TITLES.filter((t) => t !== card.funTitle);
    const next = filtered[Math.floor(Math.random() * filtered.length)];
    onCardChange({ funTitle: next });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Clean Segmented Sub-Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-xl bg-[#ffffff] border border-[#e6dfd2] shadow-sm">
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === "layout"
              ? "bg-[#171717] text-[#ffffff] shadow-sm"
              : "text-[#737373] hover:text-[#171717]"
          }`}
        >
          <LayoutGrid className="w-3 h-3" />
          Layout
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === "profile"
              ? "bg-[#171717] text-[#ffffff] shadow-sm"
              : "text-[#737373] hover:text-[#171717]"
          }`}
        >
          <User className="w-3 h-3" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("stack")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
            activeTab === "stack"
              ? "bg-[#171717] text-[#ffffff] shadow-sm"
              : "text-[#737373] hover:text-[#171717]"
          }`}
        >
          <Cpu className="w-3 h-3" />
          Stack
        </button>
      </div>

      {/* Tab 1: Layout Selection */}
      {activeTab === "layout" && (
        <div className="space-y-2 animate-fade-in">
          <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
            Choose Pass Template ({CARD_TEMPLATES.length})
          </label>
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {CARD_TEMPLATES.map((tmpl) => {
              const selected = templateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => onTemplateChange(tmpl.id)}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all ${
                    selected
                      ? "bg-[#ffffff] border-[#171717] text-[#171717] ring-1 ring-[#171717] shadow-sm"
                      : "bg-[#ffffff]/60 border-[#e6dfd2] text-[#525252] hover:border-[#171717] hover:bg-[#ffffff]"
                  }`}
                >
                  <p className="text-[12px] font-bold truncate text-[#171717]">
                    {tmpl.label}
                  </p>
                  <p className="text-[10px] text-[#737373] truncate mt-0.5">
                    {tmpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Builder Profile Information */}
      {activeTab === "profile" && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
              Full Name
            </label>
            <input
              type="text"
              value={card.name}
              onChange={(e) => onCardChange({ name: e.target.value })}
              placeholder="e.g. Alex Rivera"
              maxLength={30}
              className="input !text-[13px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
              X / GitHub Handle
            </label>
            <input
              type="text"
              value={card.handle}
              onChange={(e) => onCardChange({ handle: e.target.value })}
              placeholder="@alexbuilds"
              maxLength={25}
              className="input !text-[13px]"
            />
          </div>

          {/* Builder Role */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
              Role
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r}
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

          {/* Fun Title */}
          <div className="space-y-1 pt-1 border-t border-[#e6dfd2]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                Fun Title
              </label>
              <button
                onClick={randomizeTitle}
                className="flex items-center gap-1 text-[10.5px] text-[#b45309] hover:text-[#78350f] font-semibold"
              >
                <Shuffle className="w-3 h-3" />
                Randomize
              </button>
            </div>
            <input
              type="text"
              value={card.funTitle}
              onChange={(e) => onCardChange({ funTitle: e.target.value })}
              placeholder="e.g. 10x Caffeine Engine"
              maxLength={40}
              className="input !text-[13px]"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Tech Stack & Backdrop */}
      {activeTab === "stack" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                Tech Stack (Max 5)
              </label>
              <span className="text-[10px] font-mono text-[#b45309] font-semibold">
                {card.techStack?.length || 0}/5 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {TECH_STACK_OPTIONS.map((t) => {
                const selected = card.techStack?.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTech(t)}
                    className={`pill !text-[10.5px] !py-1 ${
                      selected ? "active" : ""
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Backdrop Selection */}
          <div className="space-y-1.5 pt-2 border-t border-[#e6dfd2]">
            <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
              Backdrop Pattern
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {BACKGROUND_STYLES.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() =>
                    onCardChange({ bgStyle: bg.id as BackgroundStyleId })
                  }
                  className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                    (card.bgStyle || "paper-wrinkled") === bg.id
                      ? "bg-[#ffffff] text-[#171717] border-[#171717] ring-1 ring-[#171717] shadow-sm font-bold"
                      : "bg-[#ffffff] text-[#737373] border-[#e6dfd2] hover:border-[#171717]"
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
