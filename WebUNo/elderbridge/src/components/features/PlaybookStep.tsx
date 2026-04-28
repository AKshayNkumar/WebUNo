"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, HelpCircle, Volume2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

export interface PlaybookStepData {
  stepNumber:       number;
  totalSteps:       number;
  instruction:      string;
  screenshotUrl?:   string;
  targetElement?:   string;
  autoClickOption?: boolean;
}

interface PlaybookStepProps {
  step:              PlaybookStepData;
  onNext:            () => void;
  onBack:            () => void;
  onHelp:            () => void;
  onAutoComplete?:   () => void;
}

export function PlaybookStep({ step, onNext, onBack, onHelp, onAutoComplete }: PlaybookStepProps) {
  const { speak } = useTextToSpeech();

  useEffect(() => {
    speak(step.instruction, { rate: 0.8 });

    // Highlight element if specified
    if (step.targetElement) {
      highlightElement(step.targetElement);
    }

    return () => {
      removeHighlights();
    };
  }, [step]);

  const highlightElement = (selector: string) => {
    try {
      const element = document.querySelector(selector);
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      const rect = element.getBoundingClientRect();
      const hl = document.createElement("div");
      hl.id = "eb-highlight";
      hl.style.cssText = `
        position:fixed;top:${rect.top - 12}px;left:${rect.left - 12}px;
        width:${rect.width + 24}px;height:${rect.height + 24}px;
        border:6px solid #FF6B00;border-radius:12px;pointer-events:none;
        z-index:99998;animation:eb-pulse 2s infinite;
      `;
      document.body.appendChild(hl);

      const arrow = document.createElement("div");
      arrow.id = "eb-arrow";
      arrow.textContent = "👇";
      arrow.style.cssText = `
        position:fixed;font-size:52px;z-index:99999;
        top:${rect.top - 72}px;left:${rect.left + rect.width / 2 - 26}px;
        animation:eb-bounce 1s infinite;pointer-events:none;
      `;
      document.body.appendChild(arrow);
    } catch {}
  };

  const removeHighlights = () => {
    document.getElementById("eb-highlight")?.remove();
    document.getElementById("eb-arrow")?.remove();
  };

  const progress = (step.stepNumber / step.totalSteps) * 100;

  return (
    <motion.div
      key={step.stepNumber}
      className="fixed inset-0 bg-[#FFFDF5] z-40 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{    opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
    >
      {/* Progress bar header */}
      <div className="bg-white border-b-4 border-[#D0C8B8] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[28px] font-bold text-[#1A56DB]">
              Step {step.stepNumber} of {step.totalSteps}
            </span>
            <button
              onClick={onHelp}
              className="flex items-center gap-3 px-5 py-3 bg-[#FFF8F0] hover:bg-[#FFE8CC]
                         rounded-xl border-2 border-[#8B4000] transition-all duration-200
                         focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              aria-label="Get help"
            >
              <HelpCircle size={28} color="#8B4000" />
              <span className="text-[22px] font-semibold text-[#8B4000]">Get Help</span>
            </button>
          </div>
          <div className="w-full h-4 bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#1A56DB] to-[#3B82F6]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Instruction area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Main instruction card */}
          <div className="bg-white rounded-3xl shadow-xl p-10 mb-6 border-4 border-[#1A56DB]">
            <div className="flex items-start gap-5 mb-4">
              <button
                onClick={() => speak(step.instruction, { rate: 0.8 })}
                className="flex-shrink-0 w-14 h-14 bg-[#1A56DB] hover:bg-[#1446B8]
                           rounded-full flex items-center justify-center shadow-lg
                           transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                aria-label="Read instruction aloud"
              >
                <Volume2 size={28} color="white" />
              </button>
              <p className="text-[32px] leading-relaxed font-semibold text-[#1A1A1A]">
                {step.instruction}
              </p>
            </div>

            {step.screenshotUrl && (
              <div className="mt-6 border-4 border-[#D0C8B8] rounded-2xl overflow-hidden">
                <img src={step.screenshotUrl} alt="Visual reference" className="w-full" />
                <p className="bg-[#F5F0E8] px-6 py-4 text-[20px] text-[#444444] text-center font-semibold">
                  👆 Look for something like this on your screen
                </p>
              </div>
            )}
          </div>

          {/* Auto-complete option */}
          <AnimatePresence>
            {step.autoClickOption && onAutoComplete && (
              <motion.div
                className="bg-[#EBF2FF] border-2 border-[#1A56DB] rounded-2xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="text-[24px] text-[#1A1A1A] mb-5 text-center font-semibold">
                  Would you like me to do this step for you?
                </p>
                <button
                  onClick={onAutoComplete}
                  className="w-full h-[88px] bg-[#1A56DB] hover:bg-[#1446B8] text-white
                             rounded-2xl text-[26px] font-bold transition-all duration-200
                             shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                >
                  ✨ Yes, Do It For Me
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t-4 border-[#D0C8B8] px-6 py-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-5">
          <button
            onClick={onBack}
            disabled={step.stepNumber === 1}
            className="h-[88px] bg-white border-4 border-[#444444] hover:bg-[#F5F0E8]
                       disabled:opacity-40 disabled:cursor-not-allowed text-[#444444]
                       rounded-2xl text-[28px] font-bold transition-all duration-200
                       flex items-center justify-center gap-3
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            aria-label="Go back"
          >
            ← Go Back
          </button>
          <button
            onClick={onNext}
            className="h-[88px] bg-[#1A7340] hover:bg-[#155c33] text-white
                       rounded-2xl text-[28px] font-bold transition-all duration-200
                       shadow-lg hover:shadow-xl flex items-center justify-center gap-3
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            aria-label={step.stepNumber === step.totalSteps ? "Done" : "Next step"}
          >
            {step.stepNumber === step.totalSteps ? (
              <><CheckCircle size={36} /> Done!</>
            ) : (
              <>Next Step <ArrowRight size={36} /></>
            )}
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes eb-pulse {
          0%,100%{opacity:1;transform:scale(1);}
          50%{opacity:.6;transform:scale(1.05);}
        }
        @keyframes eb-bounce {
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-14px);}
        }
      `}</style>
    </motion.div>
  );
}
