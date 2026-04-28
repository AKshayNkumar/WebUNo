"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Check, Clock } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

interface Reminder {
  id:        string;
  type:      "medicine" | "bill" | "appointment" | "call";
  title:     string;
  subtitle?: string;
  time?:     string;
  urgent:    boolean;
}

interface ReminderCardProps {
  reminder: Reminder;
}

const typeConfig = {
  medicine:    { emoji: "💊", borderColor: "#1A7340", bg: "#EDFBF2" },
  bill:        { emoji: "💡", borderColor: "#8B4000", bg: "#FFF8F0" },
  appointment: { emoji: "🏥", borderColor: "#1A56DB", bg: "#EBF2FF" },
  call:        { emoji: "📞", borderColor: "#1A56DB", bg: "#EBF2FF" },
};

export function ReminderCard({ reminder }: ReminderCardProps) {
  const { speak }       = useSpeechSynthesis();
  const config          = typeConfig[reminder.type];
  const [done, setDone] = useState(false);

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(`${reminder.title}${reminder.subtitle ? ". " + reminder.subtitle : ""}${reminder.time ? ". At " + reminder.time : ""}`);
  };

  const handleComplete = () => {
    setDone(true);
    speak("Reminder marked as complete");
  };

  const handleSnooze = () => {
    speak("I will remind you again in 30 minutes");
  };

  if (done) {
    return (
      <motion.div
        className="flex items-center gap-4 p-6 rounded-2xl bg-[#EDFBF2] border border-[#1A7340] min-h-[80px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        role="status"
      >
        <Check className="w-9 h-9 text-[#1A7340]" aria-hidden="true" />
        <p className="text-[24px] font-bold text-[#1A7340]">✓ {reminder.title} — Done!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative w-full rounded-2xl shadow-md p-6"
      style={{
        backgroundColor: reminder.urgent ? "#FFF0F0" : config.bg,
        borderLeft:      `6px solid ${reminder.urgent ? "#CC0000" : config.borderColor}`,
        paddingLeft:     "20px",
        border:          `1px solid ${reminder.urgent ? "#CC0000" : config.borderColor}`,
      }}
      animate={reminder.urgent ? {
        boxShadow: [
          "0 4px 6px rgba(0,0,0,0.08)",
          "0 8px 16px rgba(204,0,0,0.20)",
          "0 4px 6px rgba(0,0,0,0.08)",
        ],
      } : {}}
      transition={{ repeat: reminder.urgent ? Infinity : 0, duration: 2 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="text-[48px] flex-shrink-0" aria-hidden="true">{config.emoji}</div>

        <div className="flex-1">
          <h3 className={`text-[26px] font-bold leading-tight mb-1 ${reminder.urgent ? "text-[#CC0000]" : "text-[#1A1A1A]"}`}>
            {reminder.urgent && "⚠️ "}{reminder.title}
          </h3>
          {reminder.subtitle && <p className="text-[22px] font-semibold text-[#444444]">{reminder.subtitle}</p>}
          {reminder.time && (
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-5 h-5 text-[#444444]" aria-hidden="true" />
              <p className="text-[20px] font-semibold text-[#444444]">{reminder.time}</p>
            </div>
          )}
        </div>

        {/* Read aloud */}
        <button
          onClick={handleReadAloud}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          aria-label={`Read "${reminder.title}" aloud`}
        >
          <Volume2 className="w-6 h-6 text-[#444444]" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleComplete}
          className="flex-1 min-h-[68px] bg-[#1A7340] text-[#FFFDF5] rounded-xl text-[20px] font-bold hover:bg-[#155C33] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          aria-label={`Mark "${reminder.title}" as done`}
        >
          <Check className="w-5 h-5" /> Done
        </button>
        <button
          onClick={handleSnooze}
          className="flex-1 min-h-[68px] bg-[#EDEDDD] text-[#1A1A1A] rounded-xl text-[20px] font-bold hover:bg-[#D0C8B8] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          aria-label={`Snooze "${reminder.title}" for 30 minutes`}
        >
          <Clock className="w-5 h-5" /> Remind in 30 min
        </button>
      </div>
    </motion.div>
  );
}
