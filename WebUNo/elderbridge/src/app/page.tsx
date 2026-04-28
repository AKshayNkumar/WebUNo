"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Zap, Phone, Landmark, Bell } from "lucide-react";
import { MicrophoneButton }  from "@/components/features/MicrophoneButton";
import { TaskCard }           from "@/components/features/TaskCard";
import { ReminderCard }       from "@/components/features/ReminderCard";
import { BottomNavigation }   from "@/components/layout/BottomNavigation";
import { VoiceConfirmDialog } from "@/components/features/VoiceConfirmDialog";
import { useTextToSpeech }    from "@/hooks/useTextToSpeech";
import { useVoiceCommand }    from "@/hooks/useVoiceCommand";

const DEMO_USER = { name: "Kamala", speechRate: 0.8 };

const DEMO_REMINDERS = [
  { id: "r1", type: "medicine" as const, title: "Metformin 500mg",            detail: "1 tablet after breakfast",  time: "8:30 AM",   isOverdue: false },
  { id: "r2", type: "bill"     as const, title: "Electricity Bill Due Today",  detail: "₹1,240 due by midnight",    time: "Due Today", isOverdue: true  },
];

const DEMO_QUICK_TASKS = [
  { id: "t1", icon: Phone,    label: "Call Daughter",        accent: "family"  as const, href: "/help",   speakAs: "Call your daughter" },
  { id: "t2", icon: Landmark, label: "Check Bank Balance",   accent: "finance" as const, href: "/tasks",  speakAs: "Check your bank balance" },
  { id: "t3", icon: Pill,     label: "My Medicine Schedule", accent: "health"  as const, href: "/health", speakAs: "View your medicine schedule" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

// Shared animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { ease: "easeOut", duration: 0.45 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const { speak } = useTextToSpeech();
  const [voiceResult,      setVoiceResult]      = useState<string | null>(null);
  const [showVoiceConfirm, setShowVoiceConfirm] = useState(false);

  const { status, transcript, startListening, stopListening } = useVoiceCommand((result) => {
    setVoiceResult(result);
    setShowVoiceConfirm(true);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(
        `${getGreeting()}, ${DEMO_USER.name}. You have ${DEMO_REMINDERS.length} reminders today. Tap the blue microphone button and tell me what you want to do.`,
        { rate: DEMO_USER.speechRate }
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleVoiceConfirm = (confirmed: boolean) => {
    setShowVoiceConfirm(false);
    if (confirmed && voiceResult) {
      processVoiceCommand(voiceResult);
    } else {
      setVoiceResult(null);
      speak("No problem. Tap the microphone and try again.");
    }
  };

  const processVoiceCommand = (command: string) => {
    const lower = command.toLowerCase();
    if (lower.includes("electricity") || lower.includes("bill"))          window.location.href = "/tasks";
    else if (lower.includes("call") || lower.includes("daughter") || lower.includes("son")) window.location.href = "/help";
    else if (lower.includes("balance") || lower.includes("bank"))         window.location.href = "/tasks";
    else if (lower.includes("medicine") || lower.includes("tablet"))      window.location.href = "/health";
    else if (lower.includes("help"))                                       window.location.href = "/help";
    else speak("I didn't understand that. Can you try again, or tap one of the buttons on the screen?");
  };

  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24" id="main-content">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          {/* ═══ GREETING ═══ */}
          <motion.header
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
              {getGreeting()}, {DEMO_USER.name} 🌅
            </h1>
            <p className="text-[28px] font-semibold text-[#444444]">{getFormattedDate()}</p>
          </motion.header>

          {/* ═══ MICROPHONE ═══ */}
          <motion.section
            className="mb-8"
            aria-label="Voice control"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          >
            <MicrophoneButton status={status} onStart={startListening} onStop={stopListening} transcript={transcript} />
            <p className="text-center text-[24px] font-semibold text-[#444444] mt-4 leading-snug">
              Tap and tell me what you want to do today
            </p>
          </motion.section>

          {/* ═══ REMINDERS ═══ */}
          {DEMO_REMINDERS.length > 0 && (
            <section className="mb-8" aria-labelledby="reminders-heading">
              <motion.h2
                id="reminders-heading"
                className="text-[32px] font-bold text-[#1A1A1A] mb-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <Bell size={32} aria-hidden="true" color="#8B4000" />
                Today&apos;s Reminders
              </motion.h2>

              <motion.div
                className="flex flex-col gap-6"
                role="list"
                aria-label="Today's reminders"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                {DEMO_REMINDERS.map((r) => (
                  <motion.div role="listitem" key={r.id} variants={fadeUp}>
                    <ReminderCard {...r} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* ═══ QUICK TASKS ═══ */}
          <section className="mb-8" aria-labelledby="quick-tasks-heading">
            <motion.h2
              id="quick-tasks-heading"
              className="text-[32px] font-bold text-[#1A1A1A] mb-4"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              Quick Tasks
            </motion.h2>

            <motion.div
              className="flex flex-col gap-6"
              role="list"
              aria-label="Quick tasks"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {DEMO_QUICK_TASKS.map((t) => (
                <motion.div role="listitem" key={t.id} variants={fadeUp}>
                  <TaskCard {...t} />
                </motion.div>
              ))}
            </motion.div>
          </section>

        </div>
      </main>

      <BottomNavigation currentPage="home" />

      <AnimatePresence>
        {showVoiceConfirm && voiceResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <VoiceConfirmDialog
              heardText={voiceResult}
              onConfirm={() => handleVoiceConfirm(true)}
              onRetry={() => handleVoiceConfirm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
