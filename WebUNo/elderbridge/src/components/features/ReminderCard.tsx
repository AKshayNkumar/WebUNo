"use client";

import React from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Zap, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

type ReminderType = "medicine" | "bill" | "appointment" | "general";

interface ReminderCardProps {
  id:        string;
  type:      ReminderType;
  title:     string;
  detail:    string;
  time:      string;
  isOverdue: boolean;
}

const typeConfig: Record<ReminderType, { icon: React.ElementType; accent: string; bg: string; iconColor: string }> = {
  medicine:    { icon: Pill,  accent: "#1A7340", bg: "#EDFBF2", iconColor: "#1A7340" },
  bill:        { icon: Zap,   accent: "#1A56DB", bg: "#EBF2FF", iconColor: "#1A56DB" },
  appointment: { icon: Clock, accent: "#8B4000", bg: "#FFF8F0", iconColor: "#8B4000" },
  general:     { icon: Clock, accent: "#555577", bg: "#F0F0F8", iconColor: "#555577" },
};

export function ReminderCard({ id, type, title, detail, time, isOverdue }: ReminderCardProps) {
  const config = typeConfig[type];
  const Icon   = config.icon;
  const { speak } = useTextToSpeech();
  const [isDone, setIsDone] = React.useState(false);

  const handleDone   = () => { setIsDone(true); speak(`Great! ${title} marked as done.`); };
  const handleRemind = () => { speak(`Okay, I'll remind you about ${title} in 30 minutes.`); };

  return (
    <AnimatePresence mode="wait">
      {isDone ? (
        <motion.div
          key="done"
          className="flex items-center gap-4 p-6 rounded-2xl bg-[#EDFBF2] border border-[#1A7340] min-h-[88px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="status"
          aria-label={`${title} — completed`}
        >
          <CheckCircle2 size={36} color="#1A7340" aria-hidden="true" />
          <p className="text-[26px] font-bold text-[#1A7340]">✓ {title} — Done!</p>
        </motion.div>
      ) : (
        <motion.div
          key="card"
          className="flex flex-col gap-4 p-6 rounded-2xl min-h-[88px] shadow-md border"
          style={{
            backgroundColor: isOverdue ? "#FFF0F0" : config.bg,
            borderColor:     isOverdue ? "#CC0000"  : config.accent,
            borderLeft:      `4px solid ${isOverdue ? "#CC0000" : config.accent}`,
          }}
          initial={{ opacity: 0, x: -24 }}
          animate={
            isOverdue
              ? {
                  opacity: 1,
                  x: 0,
                  boxShadow: [
                    "0 4px 6px rgba(0,0,0,0.08)",
                    "0 8px 16px rgba(204,0,0,0.22)",
                    "0 4px 6px rgba(0,0,0,0.08)",
                  ],
                }
              : { opacity: 1, x: 0 }
          }
          exit={{ opacity: 0, x: 24 }}
          transition={
            isOverdue
              ? { opacity: { duration: 0.4 }, x: { duration: 0.4 }, boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
              : { duration: 0.4, ease: "easeOut" }
          }
          aria-label={`${isOverdue ? "Overdue: " : ""}${title}. ${detail}. Time: ${time}`}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isOverdue ? "#FFF0F0" : `${config.accent}18` }}
              aria-hidden="true"
            >
              <Icon size={32} color={isOverdue ? "#CC0000" : config.iconColor} strokeWidth={2} />
            </div>

            <div className="flex-1">
              <p className={clsx("text-[28px] font-bold leading-tight", isOverdue ? "text-[#CC0000]" : "text-[#1A1A1A]")}>
                {isOverdue && "⚠️ "}{title}
              </p>
              <p className="text-[22px] font-semibold text-[#444444] mt-1">{detail}</p>
            </div>

            <div
              className={clsx(
                "flex-shrink-0 px-3 py-2 rounded-lg text-[20px] font-bold",
                isOverdue ? "bg-[#CC0000] text-[#FFFDF5]" : "bg-white/60 text-[#444444]",
              )}
            >
              {time}
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="success" size="sm" fullWidth={true} onClick={handleDone}
              icon={<CheckCircle2 size={24} />} aria-label={`Mark ${title} as done`}>
              Done
            </Button>
            <Button variant="ghost" size="sm" fullWidth={true} onClick={handleRemind}
              icon={<Clock size={24} />} aria-label={`Remind me about ${title} in 30 minutes`}>
              Remind in 30 min
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
