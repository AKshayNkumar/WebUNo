"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Home, ClipboardList, Heart, BookOpen, Users } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useLanguage } from "@/hooks/useLanguage";

type Page = "home" | "tasks" | "health" | "diary" | "help";

const navItems = [
  { id: "home"   as Page, labelKey: "nav_home",   icon: Home,          href: "/",        speakAs: "Home screen" },
  { id: "tasks"  as Page, labelKey: "nav_tasks",   icon: ClipboardList, href: "/tasks",   speakAs: "My saved tasks" },
  { id: "health" as Page, labelKey: "nav_health",  icon: Heart,         href: "/health",  speakAs: "Health and medicines" },
  { id: "diary"  as Page, labelKey: "nav_diary",   icon: BookOpen,      href: "/diary",   speakAs: "My digital diary" },
  { id: "help"   as Page, labelKey: "nav_help",    icon: Users,         href: "/help",    speakAs: "Get help from family" },
];

export function BottomNavigation({ currentPage }: { currentPage: Page }) {
  const { speak } = useTextToSpeech();
  const { t, lang, toggleLang } = useLanguage();

  return (
    <>
      <div className="h-20" aria-hidden="true" />

      {/* Language toggle FAB */}
      <button
        onClick={toggleLang}
        className={clsx(
          "fixed bottom-24 left-4 z-50 px-4 py-2 rounded-full",
          "font-bold text-[14px] border-2 shadow-lg transition-all",
          "focus:outline-none focus:ring-4 focus:ring-[#FF6B00]",
          lang === "en"
            ? "bg-[#1A56DB] text-white border-[#1A56DB]"
            : "bg-[#FF6B00] text-white border-[#FF6B00]"
        )}
        aria-label="Switch language"
        style={{ fontFamily: lang === "kn" ? "'Noto Sans Kannada', sans-serif" : "inherit" }}
      >
        {t("lang_switch")}
      </button>

      <nav
        className={clsx(
          "fixed bottom-0 left-0 right-0 z-50 h-20",
          "bg-[#FFFDF5] border-t-2 border-[#D0C8B8]",
          "shadow-[0_-4px_12px_-2px_rgba(42,36,26,0.12)]",
          "flex items-stretch pb-safe",
        )}
        aria-label="Main navigation"
        role="navigation"
      >
        {navItems.map((item) => {
          const Icon      = item.icon;
          const isCurrent = item.id === currentPage;
          const isHelp    = item.id === "help";
          return (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                "flex-1 flex flex-col items-center justify-center gap-1 min-h-[80px]",
                "focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-inset",
                "transition-colors duration-100",
                isCurrent && "border-t-4 border-t-[#1A56DB] -mt-[2px]",
                isHelp && !isCurrent && "bg-[#FFF0F0]",
              )}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={item.speakAs}
              onFocus={() => speak(item.speakAs)}
              onClick={() => speak(`Going to ${item.speakAs}`)}
            >
              <Icon
                size={32}
                strokeWidth={isCurrent ? 2.5 : 2}
                color={isCurrent ? "#1A56DB" : isHelp ? "#CC0000" : "#444444"}
                aria-hidden="true"
              />
              <span className={clsx(
                "text-[16px] font-bold leading-none text-center",
                isCurrent ? "text-[#1A56DB]" : isHelp ? "text-[#CC0000]" : "text-[#444444]",
              )}>
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
