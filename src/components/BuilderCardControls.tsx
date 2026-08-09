"use client";

import type { CardData, BuilderRole, BackgroundStyleId } from "@/types";
import { ROLES, TECH_STACK_OPTIONS, BACKGROUND_STYLES } from "@/lib/templates";

interface BuilderCardControlsProps {
  card: CardData;
  onCardChange: (updates: Partial<CardData>) => void;
}

export default function BuilderCardControls({
  card,
  onCardChange,
}: BuilderCardControlsProps) {
  const toggleTech = (tech: string) => {
    const current = card.techStack || [];
    if (current.includes(tech)) {
      onCardChange({ techStack: current.filter((t) => t !== tech) });
    } else if (current.length < 4) {
      onCardChange({ techStack: [...current, tech] });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Attendee Full Name */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Attendee Full Name
        </label>
        <input
          type="text"
          value={card.name}
          onChange={(e) => onCardChange({ name: e.target.value })}
          placeholder="e.g. ALEX RIVERA"
          maxLength={26}
          className="input !text-[13px]"
        />
      </div>

      {/* 2. Oval Nametag Nickname */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Oval Badge Nickname
        </label>
        <input
          type="text"
          value={card.nickname}
          onChange={(e) => onCardChange({ nickname: e.target.value })}
          placeholder="e.g. ALEX"
          maxLength={14}
          className="input !text-[13px]"
        />
      </div>

      {/* 3. Handle */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          X / GitHub Handle
        </label>
        <input
          type="text"
          value={card.handle}
          onChange={(e) => onCardChange({ handle: e.target.value })}
          placeholder="@alexbuilds"
          maxLength={22}
          className="input !text-[13px]"
        />
      </div>

      {/* 4. Builder Role */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Builder Role
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

      {/* 5. Tech Stack (Max 4) */}
      <div className="space-y-1.5 pt-1 border-t border-[#e6dfd2]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
            Tech Stack (Max 4)
          </label>
          <span className="text-[10px] font-mono text-[#b45309] font-semibold">
            {card.techStack?.length || 0}/4 selected
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
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

      {/* 6. Backdrop Pattern */}
      <div className="space-y-1.5 pt-2 border-t border-[#e6dfd2]">
        <label className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
          Notebook Backdrop
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {BACKGROUND_STYLES.map((bg) => (
            <button
              key={bg.id}
              onClick={() =>
                onCardChange({ bgStyle: bg.id as BackgroundStyleId })
              }
              className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                (card.bgStyle || "notebook-lined") === bg.id
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
  );
}
