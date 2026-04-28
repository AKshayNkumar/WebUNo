"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Zap, Phone, Landmark, Bell, Shield, ClipboardList, Video, Mail, Globe } from "lucide-react";
import { MicrophoneButton }  from "@/components/features/MicrophoneButton";
import { TaskCard }           from "@/components/features/TaskCard";
import { ReminderCard }       from "@/components/features/ReminderCard";
import { BottomNavigation }   from "@/components/layout/BottomNavigation";
import { VoiceConfirmDialog } from "@/components/features/VoiceConfirmDialog";
import { CognitiveLock }      from "@/components/features/CognitiveLock";
import { ScamResponse }       from "@/components/features/ScamResponse";
import { useTextToSpeech }    from "@/hooks/useTextToSpeech";
import { useVoiceCommand }    from "@/hooks/useVoiceCommand";

const DEMO_USER = { name: "Kamala", speechRate: 0.8 };

const DEMO_REMINDERS = [
  { id: "r1", type: "medicine" as const, title: "Metformin 500mg",           detail: "1 tablet after breakfast", time: "8:30 AM",   isOverdue: false },
  { id: "r2", type: "bill"     as const, title: "Electricity Bill Due Today", detail: "₹1,240 due by midnight",   time: "Due Today", isOverdue: true  },
];

const DEMO_QUICK_TASKS = [
  { id: "t1", icon: Phone,    label: "Call Daughter",        accent: "family"  as const, href: "/help",     speakAs: "Call your daughter" },
  { id: "t2", icon: Landmark, label: "Check Bank Balance",   accent: "finance" as const, href: "/playbook", speakAs: "Check your bank balance" },
  { id: "t3", icon: Pill,     label: "My Medicine Schedule", accent: "health"  as const, href: "/health",   speakAs: "View your medicine schedule" },
];

const DEMO_SCAM_ANALYSIS = {
  threatLevel: "critical" as const, confidence: 0.95,
  flags: [{ category: "url" as const, severity: "critical" as const, description: "Fake bank site", evidence: "www.sbi-alert-login.com" }],
  shouldBlock: true, userMessage: "This website is pretending to be your bank. It is NOT safe.",
  technicalDetails: "Phishing domain detected", recommendedAction: "block" as const,
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}
function getFormattedDate() {
  return new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
}

const fadeUp = { hidden: { opacity:0, y:24 }, show: { opacity:1, y:0, transition: { ease:"easeOut", duration:0.45 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

type ScamState = "none" | "cognitive_lock" | "scam_response";

// ── Feature sections array (Sections 6–14) shown on home ──────────────────────
const FEATURE_SECTIONS = [
  {
    id: "sec7",
    emoji: "📋", heading: "Learn & Practice",
    headingIcon: <ClipboardList size={28} color="#1A56DB" />,
    bg: "#EBF2FF", borderColor: "#1A56DB", arrowColor: "#1A56DB",
    title: "Step-by-Step Guide",
    detail: "Practice paying bills, checking balance & more — safely",
    href: "/playbook",
    ariaLabel: "Step-by-step guide — practice tasks safely",
  },
  {
    id: "sec12",
    emoji: "🌉", heading: "Browser Extension",
    headingIcon: <Globe size={28} color="#7C3AED" />,
    bg: "#F5F0FF", borderColor: "#7C3AED", arrowColor: "#7C3AED",
    title: "ElderBridge Extension",
    detail: "Makes any website simple & safe — one-tap scam check & family alert",
    href: "/extension",
    ariaLabel: "ElderBridge Chrome extension info and demo",
  },
  {
    id: "sec13",
    emoji: "📧", heading: "Weekly Family Report",
    headingIcon: <Mail size={28} color="#8B4000" />,
    bg: "#FFF8F0", borderColor: "#8B4000", arrowColor: "#8B4000",
    title: "Weekly Digest Email",
    detail: "Your family gets a friendly weekly email with your progress & highlights",
    href: "/digest",
    ariaLabel: "Preview the weekly digest email sent to your family",
  },
];

export default function HomePage() {
  const { speak } = useTextToSpeech();
  const [voiceResult,      setVoiceResult]      = useState<string | null>(null);
  const [showVoiceConfirm, setShowVoiceConfirm] = useState(false);
  const [scamState,        setScamState]        = useState<ScamState>("none");
  const [cogAnswer,        setCogAnswer]        = useState<"phone_call" | "found_myself" | "not_sure" | null>(null);

  const { status, transcript, startListening, stopListening } = useVoiceCommand((result) => {
    setVoiceResult(result); setShowVoiceConfirm(true);
  });

  useEffect(() => {
    const t = setTimeout(() => {
      speak(`${getGreeting()}, ${DEMO_USER.name}. You have ${DEMO_REMINDERS.length} reminders today. Tap the blue microphone button and tell me what you want to do.`,
        { rate: DEMO_USER.speechRate });
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  const handleVoiceConfirm = (confirmed: boolean) => {
    setShowVoiceConfirm(false);
    if (confirmed && voiceResult) processVoiceCommand(voiceResult);
    else { setVoiceResult(null); speak("No problem. Tap the microphone and try again."); }
  };

  const processVoiceCommand = (command: string) => {
    const l = command.toLowerCase();
    if      (l.includes("electricity") || l.includes("bill"))             window.location.href = "/tasks";
    else if (l.includes("call") || l.includes("daughter") || l.includes("son")) window.location.href = "/help";
    else if (l.includes("balance") || l.includes("bank"))                 window.location.href = "/playbook";
    else if (l.includes("medicine") || l.includes("tablet"))              window.location.href = "/health";
    else if (l.includes("help") || l.includes("guardian"))                window.location.href = "/help";
    else if (l.includes("practice") || l.includes("guide"))               window.location.href = "/playbook";
    else if (l.includes("extension") || l.includes("browser"))            window.location.href = "/extension";
    else if (l.includes("email") || l.includes("digest") || l.includes("report")) window.location.href = "/digest";
    else speak("I didn't understand that. Can you try again, or tap one of the buttons on the screen?");
  };

  if (scamState === "cognitive_lock") {
    return <CognitiveLock scamAnalysis={DEMO_SCAM_ANALYSIS}
      onAnswer={(ans) => { setCogAnswer(ans); setScamState("scam_response"); }} />;
  }
  if (scamState === "scam_response" && cogAnswer) {
    return <ScamResponse cognitiveAnswer={cogAnswer} scamAnalysis={DEMO_SCAM_ANALYSIS}
      onGoHome={() => { setScamState("none"); setCogAnswer(null); }}
      onContactGuardian={() => window.location.href = "/help"} />;
  }

  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24" id="main-content">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          {/* ═══ GREETING ═══ */}
          <motion.header className="mb-8"
            initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, ease:"easeOut" }}>
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
              {getGreeting()}, {DEMO_USER.name} 🌅
            </h1>
            <p className="text-[28px] font-semibold text-[#444444]">{getFormattedDate()}</p>
          </motion.header>

          {/* ═══ MICROPHONE (Section 6) ═══ */}
          <motion.section className="mb-8" aria-label="Voice control"
            initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.45, delay:0.15, ease:"easeOut" }}>
            <MicrophoneButton status={status} onStart={startListening} onStop={stopListening} transcript={transcript} />
            <p className="text-center text-[24px] font-semibold text-[#444444] mt-4 leading-snug">
              Tap and tell me what you want to do today
            </p>
          </motion.section>

          {/* ═══ REMINDERS ═══ */}
          {DEMO_REMINDERS.length > 0 && (
            <section className="mb-8" aria-labelledby="reminders-heading">
              <motion.h2 id="reminders-heading"
                className="text-[32px] font-bold text-[#1A1A1A] mb-4 flex items-center gap-3"
                initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4, delay:0.25 }}>
                <Bell size={32} aria-hidden="true" color="#8B4000" />
                Today&apos;s Reminders
              </motion.h2>
              <motion.div className="flex flex-col gap-6" role="list" aria-label="Today's reminders"
                variants={stagger} initial="hidden" animate="show">
                {DEMO_REMINDERS.map(r => (
                  <motion.div role="listitem" key={r.id} variants={fadeUp}>
                    <ReminderCard {...r} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* ═══ QUICK TASKS ═══ */}
          <section className="mb-8" aria-labelledby="quick-tasks-heading">
            <motion.h2 id="quick-tasks-heading"
              className="text-[32px] font-bold text-[#1A1A1A] mb-4"
              initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4, delay:0.35 }}>
              Quick Tasks
            </motion.h2>
            <motion.div className="flex flex-col gap-6" role="list" aria-label="Quick tasks"
              variants={stagger} initial="hidden" animate="show">
              {DEMO_QUICK_TASKS.map(t => (
                <motion.div role="listitem" key={t.id} variants={fadeUp}>
                  <TaskCard {...t} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══ SECTION 7+8+12+13: FEATURE CARDS ═══ */}
          {FEATURE_SECTIONS.map((f, idx) => (
            <motion.section key={f.id} className="mb-6"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.45, delay: 0.5 + idx * 0.08 }}>
              <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                {f.headingIcon} {f.heading}
              </h2>
              <a href={f.href}
                className="flex items-center gap-5 p-6 rounded-2xl shadow-md border border-[#D0C8B8] w-full text-left hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                style={{ backgroundColor: f.bg, borderLeft: `6px solid ${f.borderColor}` }}
                aria-label={f.ariaLabel}>
                <span className="text-[44px]">{f.emoji}</span>
                <div className="flex-1">
                  <p className="text-[24px] font-bold text-[#1A1A1A]">{f.title}</p>
                  <p className="text-[18px] font-semibold text-[#444444]">{f.detail}</p>
                </div>
                <span className="text-[28px]" style={{ color: f.arrowColor }}>›</span>
              </a>
            </motion.section>
          ))}

          {/* ═══ SECTION 9: SCAM PROTECTION ═══ */}
          <motion.section className="mb-6"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, delay:0.75 }}>
            <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <Shield size={28} color="#CC0000" aria-hidden="true" /> Scam Protection
            </h2>
            <div className="flex items-center gap-5 p-6 rounded-2xl shadow-md w-full"
              style={{ backgroundColor: "#FFF0F0", borderLeft: "6px solid #CC0000" }}>
              <span className="text-[44px]">🛡️</span>
              <div className="flex-1">
                <p className="text-[22px] font-bold text-[#1A1A1A]">Scam Detection is Active</p>
                <p className="text-[17px] font-semibold text-[#444444]">I will warn you before any dangerous website</p>
              </div>
              <button onClick={() => setScamState("cognitive_lock")}
                className="px-4 py-3 bg-[#CC0000] text-white rounded-xl font-bold text-[16px] hover:bg-[#aa0000] transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00] flex-shrink-0"
                aria-label="Demo: see what happens when a scam is detected">
                See Demo
              </button>
            </div>
          </motion.section>

          {/* ═══ SECTION 10: GUARDIAN & LIVE HELP ═══ */}
          <motion.section className="mb-8"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, delay:0.82 }}>
            <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <Video size={28} color="#555577" aria-hidden="true" /> Guardian &amp; Live Help
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { emoji:"👨‍👩‍👧", title:"Guardian Dashboard", detail:"Family can monitor & send alerts from here",
                  href:"/guardian", bg:"#EEF2FF", border:"#555577" },
                { emoji:"🖊️", title:"Live Help Session", detail:"Family draws circles on your screen to guide you",
                  href:"/guardian/live-help", bg:"#F5F0FF", border:"#7C3AED" },
              ].map(card => (
                <a key={card.href} href={card.href}
                  className="flex items-center gap-5 p-6 rounded-2xl shadow-md border border-[#D0C8B8] w-full text-left hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                  style={{ backgroundColor: card.bg, borderLeft: `6px solid ${card.border}` }}>
                  <span className="text-[44px]">{card.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[22px] font-bold text-[#1A1A1A]">{card.title}</p>
                    <p className="text-[17px] font-semibold text-[#444444]">{card.detail}</p>
                  </div>
                  <span className="text-[26px]" style={{ color: card.border }}>›</span>
                </a>
              ))}
            </div>
          </motion.section>

        </div>
      </main>

      <BottomNavigation currentPage="home" />

      <AnimatePresence>
        {showVoiceConfirm && voiceResult && (
          <motion.div
            initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.95, y:20 }} transition={{ duration:0.3, ease:"easeOut" }}>
            <VoiceConfirmDialog heardText={voiceResult}
              onConfirm={() => handleVoiceConfirm(true)}
              onRetry={() => handleVoiceConfirm(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
