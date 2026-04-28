"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

interface TaskCardProps {
  icon:         string;
  label:        string;
  onClick:      () => void;
  borderColor?: string;
}

export function TaskCard({ icon, label, onClick, borderColor }: TaskCardProps) {
  const { speak } = useSpeechSynthesis();

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(label);
  };

  return (
    <motion.div
      onClick={onClick}
      className="relative w-full min-h-[88px] bg-[#F5F0E8] rounded-2xl border border-[#D0C8B8] shadow-md p-6 flex items-center gap-6 cursor-pointer select-none focus:outline-none"
      style={{ borderLeft: `6px solid ${borderColor || "#1A56DB"}`, paddingLeft: "20px" }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px -4px rgba(42,36,26,0.18)" }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
    >
      {/* Emoji icon */}
      <div className="text-[48px] flex-shrink-0" role="img" aria-label={label}>
        {icon}
      </div>

      {/* Label */}
      <div className="flex-1">
        <p className="text-[26px] font-bold text-[#1A1A1A] leading-tight">{label}</p>
      </div>

      {/* Read aloud */}
      <button
        onClick={handleReadAloud}
        className="flex-shrink-0 w-12 h-12 rounded-full bg-[#EBF2FF] flex items-center justify-center hover:bg-[#1A56DB] hover:text-[#FFFDF5] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
        aria-label={`Read "${label}" aloud`}
      >
        <Volume2 className="w-6 h-6 text-[#1A56DB]" />
      </button>

      <ChevronRight className="w-8 h-8 text-[#9E9580] flex-shrink-0" aria-hidden="true" />
    </motion.div>
  );
}
