"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useLanguage } from "@/hooks/useLanguage";
import { PlaybookStep, PlaybookStepData } from "@/components/features/PlaybookStep";
import { SandboxMode, PracticeComplete, PracticeMetrics } from "@/components/features/SandboxMode";

const ELECTRICITY_PLAYBOOK: PlaybookStepData[] = [
  {
    stepNumber: 1, totalSteps: 5,
    instruction: "Open the Google Chrome browser on your phone or computer. Look for the colourful circle icon.",
  },
  {
    stepNumber: 2, totalSteps: 5,
    instruction: "In the address bar at the top, type: www.billdesk.com and press the Enter key.",
  },
  {
    stepNumber: 3, totalSteps: 5,
    instruction: "Look for the button that says 'Electricity'. Tap on it.",
  },
  {
    stepNumber: 4, totalSteps: 5,
    instruction: "You will see a box asking for your Consumer Number. This is written on your electricity bill. Type those numbers carefully.",
  },
  {
    stepNumber: 5, totalSteps: 5,
    instruction: "Now you should see the amount to pay. Tap the green 'Proceed to Pay' button. Well done!",
    autoClickOption: true,
  },
];

type Stage = "menu" | "practice" | "playbook" | "done";

export default function PlaybookPage() {
  const [stage,       setStage]       = useState<Stage>("menu");
  const { t }                         = useLanguage();
  const [stepIndex,   setStepIndex]   = useState(0);
  const [metrics,     setMetrics]     = useState<PracticeMetrics | null>(null);

  const currentStep = ELECTRICITY_PLAYBOOK[stepIndex];

  const handleNext = () => {
    if (stepIndex < ELECTRICITY_PLAYBOOK.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setStage("done");
    }
  };

  const handleBack  = () => setStepIndex((i) => Math.max(0, i - 1));
  const handleHelp  = () => alert("Help is on the way! Your family has been notified.");

  return (
    <>
      {/* ── MENU ─────────────────────────────────── */}
      {stage === "menu" && (
        <main className="min-h-screen bg-[#FFFDF5] pb-24">
          <div className="max-w-2xl mx-auto px-6 pt-8">
            <header className="mb-8">
              <h1 className="text-[42px] font-bold text-[#1A1A1A] mb-2">📋 {t("playbook_title")}</h1>
              <p className="text-[26px] font-semibold text-[#444444]">
                {t("playbook_sub")}
              </p>
            </header>

            <div className="flex flex-col gap-6">
              {[
                {
                  icon: "💡", title: t("playbook_bill"),
                  detail: t("playbook_bill_d"), accent: "#CC0000", bg: "#FFF0F0",
                },
                {
                  icon: "🏦", title: t("playbook_bank"),
                  detail: t("playbook_bank_d"), accent: "#1A56DB", bg: "#EBF2FF",
                },
                {
                  icon: "💸", title: t("playbook_upi"),
                  detail: t("playbook_upi_d"), accent: "#1A7340", bg: "#EDFBF2",
                },
              ].map((task) => (
                <button
                  key={task.title}
                  onClick={() => { setStepIndex(0); setStage("practice"); }}
                  className="flex items-center gap-5 p-7 rounded-2xl shadow-md border border-[#D0C8B8] min-h-[96px] w-full text-left hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                  style={{ backgroundColor: task.bg, borderLeft: `6px solid ${task.accent}`, paddingLeft: "24px" }}
                >
                  <span className="text-[48px]">{task.icon}</span>
                  <div className="flex-1">
                    <p className="text-[28px] font-bold text-[#1A1A1A]">{task.title}</p>
                    <p className="text-[20px] font-semibold text-[#444444]">{task.detail}</p>
                  </div>
                  <span className="text-[32px]">›</span>
                </button>
              ))}
            </div>
          </div>
          <BottomNavigation currentPage="tasks" />
        </main>
      )}

      {/* ── PRACTICE (Sandbox) ───────────────────── */}
      {stage === "practice" && (
        <SandboxMode
          targetUrl="https://www.billdesk.com"
          playbookSteps={ELECTRICITY_PLAYBOOK}
          onComplete={(m) => { setMetrics(m); setStage("done"); }}
          onExit={() => { setStepIndex(0); setStage("playbook"); }}
        />
      )}

      {/* ── GUIDED PLAYBOOK ──────────────────────── */}
      <AnimatePresence mode="wait">
        {stage === "playbook" && currentStep && (
          <PlaybookStep
            key={stepIndex}
            step={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            onHelp={handleHelp}
            onAutoComplete={() => handleNext()}
          />
        )}
      </AnimatePresence>

      {/* ── DONE / COMPLETED ─────────────────────── */}
      {stage === "done" && metrics && (
        <PracticeComplete
          metrics={metrics}
          playbookLength={ELECTRICITY_PLAYBOOK.length}
          onPracticeAgain={() => { setStepIndex(0); setStage("practice"); }}
          onProceedToReal={() => { setStepIndex(0); setStage("playbook"); }}
        />
      )}

      {stage === "done" && !metrics && (
        <main className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
          <div className="text-center p-12">
            <div className="text-[100px] mb-6">🎉</div>
            <h1 className="text-[48px] font-bold text-[#1A1A1A] mb-4">All Done!</h1>
            <p className="text-[28px] text-[#444444] mb-10">You completed all the steps. Great job!</p>
            <button
              onClick={() => { setStepIndex(0); setStage("menu"); }}
              className="px-10 py-5 bg-[#1A7340] text-white rounded-2xl text-[28px] font-bold
                         hover:bg-[#155c33] transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            >
              Go Back to Tasks
            </button>
          </div>
        </main>
      )}
    </>
  );
}
