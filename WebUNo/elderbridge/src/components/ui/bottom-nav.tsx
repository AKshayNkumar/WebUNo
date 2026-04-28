"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ClipboardList, Heart, BookOpen, Users } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { clsx } from "clsx";

type Tab = "home" | "tasks" | "health" | "diary" | "help";

const navItems = [
  { id: "home"   as Tab, label: "Home",     icon: Home,          href: "/",        speak: "Home screen" },
  { id: "tasks"  as Tab, label: "Tasks",    icon: ClipboardList, href: "/tasks",   speak: "My saved tasks" },
  { id: "health" as Tab, label: "Health",   icon: Heart,         href: "/health",  speak: "Health and medicines" },
  { id: "diary"  as Tab, label: "Diary",    icon: BookOpen,      href: "/diary",   speak: "My digital diary" },
  { id: "help"   as Tab, label: "Get Help", icon: Users,         href: "/help",    speak: "Get help from family" },
];

export function BottomNav({ activeTab }: { activeTab: Tab }) {
  const { speak } = useSpeechSynthesis();

  return (
    <>
      <div className="h-20" aria-hidden="true" />
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-[#FFFDF5] border-t-2 border-[#D0C8B8] shadow-[0_-4px_12px_-2px_rgba(42,36,26,0.12)] flex items-stretch"
        aria-label="Main navigation"
        role="navigation"
      >
        {navItems.map((item) => {
          const Icon      = item.icon;
          const isCurrent = item.id === activeTab;
          const isHelp    = item.id === "help";

          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                "flex-1 flex flex-col items-center justify-center gap-1 min-h-[80px] relative",
                "focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-inset",
                "transition-colors duration-150",
                isHelp && !isCurrent && "bg-[#FFF0F0]",
              )}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={item.speak}
              onFocus={() => speak(item.speak)}
              onClick={() => speak(`Going to ${item.speak}`)}
            >
              {isCurrent && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-0 right-0 h-[3px] bg-[#1A56DB] rounded-b-full"
                />
              )}

              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.1 }}
              >
                <Icon
                  size={32}
                  strokeWidth={isCurrent ? 2.5 : 2}
                  color={isCurrent ? "#1A56DB" : isHelp ? "#CC0000" : "#444444"}
                  aria-hidden="true"
                />
              </motion.div>

              <span className={clsx(
                "text-[15px] font-bold leading-none text-center",
                isCurrent ? "text-[#1A56DB]" : isHelp ? "text-[#CC0000]" : "text-[#444444]",
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
