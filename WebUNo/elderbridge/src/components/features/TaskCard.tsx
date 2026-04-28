"use client";

import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { colors } from "@/lib/design-tokens";
import type { AccentColor } from "@/lib/design-tokens";
import type { LucideIcon } from "lucide-react";

interface TaskCardProps {
  id:      string;
  icon:    LucideIcon;
  label:   string;
  accent:  AccentColor;
  href:    string;
  speakAs: string;
  detail?: string;
}

export function TaskCard({ id, icon: Icon, label, accent, href, speakAs, detail }: TaskCardProps) {
  const router = useRouter();
  const { speak } = useTextToSpeech();
  const accentColor = colors.accent[accent];

  const handleClick = () => {
    speak(`Opening: ${speakAs}`);
    setTimeout(() => router.push(href), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        "flex items-center gap-6 min-h-[88px] p-6",
        "bg-[#F5F0E8] border border-[#D0C8B8] rounded-2xl shadow-md",
        "cursor-pointer",
        "focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2",
        "select-none",
      )}
      style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: "20px" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px -4px rgba(42,36,26,0.18)" }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${label}${detail ? `. ${detail}` : ""}`}
    >
      <div
        className="flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${accentColor}18` }}
        aria-hidden="true"
      >
        <Icon size={36} color={accentColor} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[28px] font-bold text-[#1A1A1A] leading-tight">{label}</p>
        {detail && <p className="text-[22px] font-semibold text-[#444444] mt-1">{detail}</p>}
      </div>

      <ChevronRight size={32} color="#9E9580" className="flex-shrink-0" aria-hidden="true" />
    </motion.div>
  );
}
