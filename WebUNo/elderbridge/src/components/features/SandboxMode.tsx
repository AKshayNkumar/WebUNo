"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Play, CheckCircle, Clock, Target, Trophy } from "lucide-react";

export interface PracticeMetrics {
  totalTime:      number;
  attempts:       number;
  mistakesCount:  number;
  stepsCompleted: number;
  confidenceScore: number;
}

interface PlaybookStep {
  instruction: string;
}

interface SandboxModeProps {
  targetUrl:      string;
  playbookSteps:  PlaybookStep[];
  onComplete:     (metrics: PracticeMetrics) => void;
  onExit:         () => void;
}

export function SandboxMode({ targetUrl, playbookSteps, onComplete, onExit }: SandboxModeProps) {
  const iframeRef      = useRef<HTMLIFrameElement>(null);
  const startTimeRef   = useRef<number>(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [currentStep,     setCurrentStep]     = useState(0);
  const [metrics, setMetrics] = useState<PracticeMetrics>({
    totalTime: 0, attempts: 0, mistakesCount: 0, stepsCompleted: 0, confidenceScore: 0,
  });

  // Listen for sandbox events from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data?.type?.startsWith("SANDBOX_")) return;
      setMetrics(prev => ({ ...prev, attempts: prev.attempts + 1 }));
      if (event.data.type === "SANDBOX_FORM_SUBMIT") {
        setTimeout(() => {
          const next = currentStep + 1;
          setMetrics(prev => ({ ...prev, stepsCompleted: next }));
          if (next >= playbookSteps.length) {
            const totalTime = Date.now() - startTimeRef.current;
            const score = Math.min(100, Math.round(
              (next / playbookSteps.length) * 50 +
              Math.max(0, 30 - (totalTime / 60000) * 2) +
              Math.max(0, 20 - metrics.mistakesCount * 5)
            ));
            onComplete({ ...metrics, totalTime, stepsCompleted: next, confidenceScore: score });
          } else {
            setCurrentStep(next);
          }
        }, 3000);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [currentStep, metrics, playbookSteps.length]);

  if (!practiceStarted) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-[#FFFDF5] rounded-3xl shadow-2xl max-w-3xl w-full p-12"
          initial={{ scale: 0.92 }} animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="text-center">
            <Shield size={80} color="#8B4000" className="mx-auto mb-6" />
            <h2 className="text-[44px] font-bold text-[#1A1A1A] mb-6">Practice Mode</h2>

            <div className="bg-[#FFF8F0] border-2 border-[#8B4000] rounded-2xl p-8 mb-8">
              <p className="text-[26px] text-[#8B4000] font-semibold leading-relaxed mb-5">
                This is a <strong>completely safe practice area</strong>.
              </p>
              <ul className="text-[22px] text-[#8B4000] text-left space-y-3">
                {["No real money will move", "Nothing will actually be submitted",
                  "You can make mistakes freely", "Try as many times as you like"].map(t => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-[28px] text-[#1A7340]">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[24px] text-[#444444] mb-8">
              You'll practice: <strong>{playbookSteps.length} steps</strong>
            </p>

            <div className="grid grid-cols-2 gap-6">
              <button onClick={onExit}
                className="h-[88px] bg-white border-4 border-[#444444] hover:bg-[#F5F0E8]
                           text-[#444444] rounded-2xl text-[26px] font-bold transition-all
                           focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                Skip Practice
              </button>
              <button
                onClick={() => { setPracticeStarted(true); startTimeRef.current = Date.now(); }}
                className="h-[88px] bg-[#1A56DB] hover:bg-[#1446B8] text-white
                           rounded-2xl text-[26px] font-bold transition-all shadow-lg
                           flex items-center justify-center gap-4
                           focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              >
                <Play size={32} /> Start Practice
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const step = playbookSteps[currentStep];

  const handleStepAction = () => {
    const next = currentStep + 1;
    setMetrics(prev => ({ ...prev, attempts: prev.attempts + 1, stepsCompleted: next }));
    if (next >= playbookSteps.length) {
      const totalTime = Date.now() - startTimeRef.current;
      const score = Math.min(100, Math.round(
        (next / playbookSteps.length) * 50 +
        Math.max(0, 30 - (totalTime / 60000) * 2) +
        Math.max(0, 20 - metrics.mistakesCount * 5)
      ));
      onComplete({ ...metrics, totalTime, stepsCompleted: next, confidenceScore: score });
    } else {
      setCurrentStep(next);
    }
  };

  // Simulated screens for each step
  const SimulatedScreens: Record<number, React.ReactNode> = {
    0: (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
        <div className="text-[72px]">🌐</div>
        <p className="text-[28px] font-bold text-[#1A1A1A] text-center">Open Google Chrome</p>
        <p className="text-[20px] text-[#444] text-center">Look for the colourful circle icon on your phone or computer</p>
        <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border-2 border-[#D0C8B8] flex items-center justify-center">
          <span className="text-[48px]">🔵🟢🟡🔴</span>
        </div>
        <button onClick={handleStepAction}
          className="px-10 py-5 bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-2xl text-[24px] font-bold shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          style={{ minHeight: "auto" }}>
          ✅ I Opened Chrome
        </button>
      </div>
    ),
    1: (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
        <p className="text-[24px] font-bold text-[#1A1A1A] text-center">Type the website address</p>
        <div className="w-full max-w-md bg-white rounded-xl border-2 border-[#1A56DB] shadow-md p-4">
          <div className="flex items-center gap-3">
            <span className="text-[18px]">🔒</span>
            <input type="text" defaultValue="www.billdesk.com" readOnly
              className="flex-1 text-[20px] font-semibold text-[#1A56DB] bg-transparent border-none outline-none"
              style={{ minHeight: "auto" }} />
          </div>
        </div>
        <p className="text-[18px] text-[#444] text-center">Type <strong>www.billdesk.com</strong> in the address bar at the top</p>
        <button onClick={handleStepAction}
          className="px-10 py-5 bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-2xl text-[24px] font-bold shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          style={{ minHeight: "auto" }}>
          ✅ I Typed the Address
        </button>
      </div>
    ),
    2: (
      <div className="flex flex-col items-center h-full gap-5 p-8">
        <p className="text-[24px] font-bold text-[#1A1A1A] text-center mb-2">Tap on &quot;Electricity&quot;</p>
        <div className="w-full max-w-md">
          <div className="bg-[#1A56DB] text-white text-center py-4 rounded-t-xl">
            <p className="text-[20px] font-bold">BillDesk</p>
            <p className="text-[14px] opacity-80">Pay Your Bills Online</p>
          </div>
          <div className="bg-white border-2 border-t-0 border-[#D0C8B8] rounded-b-xl p-5 grid grid-cols-3 gap-4">
            {[
              { icon: "💡", label: "Electricity", active: true },
              { icon: "📱", label: "Mobile", active: false },
              { icon: "💧", label: "Water", active: false },
              { icon: "📺", label: "DTH", active: false },
              { icon: "🏠", label: "Gas", active: false },
              { icon: "🌐", label: "Internet", active: false },
            ].map(b => (
              <button key={b.label}
                onClick={b.active ? handleStepAction : () => setMetrics(p => ({...p, mistakesCount: p.mistakesCount + 1}))}
                className={`p-4 rounded-xl text-center transition-all border-2 ${
                  b.active
                    ? "bg-[#FFF8F0] border-[#8B4000] shadow-md hover:shadow-lg animate-pulse"
                    : "bg-[#F5F5F5] border-transparent hover:bg-[#EFEFEF]"
                }`}
                style={{ minHeight: "auto", minWidth: "auto" }}>
                <div className="text-[28px] mb-1">{b.icon}</div>
                <p className={`text-[13px] font-bold ${b.active ? "text-[#8B4000]" : "text-[#666]"}`}>{b.label}</p>
              </button>
            ))}
          </div>
        </div>
        <p className="text-[16px] text-[#8B4000] font-semibold">👆 Find and tap the &quot;Electricity&quot; button</p>
      </div>
    ),
    3: (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
        <p className="text-[24px] font-bold text-[#1A1A1A] text-center">Enter Your Consumer Number</p>
        <p className="text-[18px] text-[#444] text-center">This number is written on your electricity bill</p>
        <div className="w-full max-w-md bg-white rounded-xl border-2 border-[#D0C8B8] p-6">
          <label className="text-[16px] font-semibold text-[#444] block mb-2">Consumer Number</label>
          <input type="text" placeholder="e.g. 1234 5678 9012" defaultValue=""
            className="w-full text-[22px] font-bold text-[#1A1A1A] border-2 border-[#D0C8B8] rounded-xl px-4 py-3 focus:border-[#1A56DB]"
            style={{ minHeight: "auto" }}
            onChange={() => {}} />
          <p className="text-[14px] text-[#767676] mt-2">📄 Look at the top of your electricity bill for this number</p>
        </div>
        <button onClick={handleStepAction}
          className="px-10 py-5 bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-2xl text-[24px] font-bold shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          style={{ minHeight: "auto" }}>
          ✅ I Entered My Number
        </button>
      </div>
    ),
    4: (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
        <p className="text-[24px] font-bold text-[#1A1A1A] text-center">Review & Pay</p>
        <div className="w-full max-w-md bg-white rounded-xl border-2 border-[#1A7340] p-6">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E5E5E5]">
            <span className="text-[18px] text-[#444] font-semibold">Consumer No.</span>
            <span className="text-[18px] font-bold text-[#1A1A1A]">1234 5678 9012</span>
          </div>
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E5E5E5]">
            <span className="text-[18px] text-[#444] font-semibold">Bill Amount</span>
            <span className="text-[24px] font-bold text-[#CC0000]">₹ 1,240.00</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[18px] text-[#444] font-semibold">Pay From</span>
            <span className="text-[18px] font-bold text-[#1A56DB]">SBI ****4521</span>
          </div>
          <button onClick={handleStepAction}
            className="w-full py-5 bg-[#1A7340] hover:bg-[#155c33] text-white rounded-2xl text-[26px] font-bold shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00] mt-4"
            style={{ minHeight: "auto" }}>
            ✅ Proceed to Pay — ₹1,240
          </button>
        </div>
        <p className="text-[16px] text-[#1A7340] font-semibold">🛡️ Remember: This is practice — no real money will move!</p>
      </div>
    ),
  };

  const screenIndex = Math.min(currentStep, Object.keys(SimulatedScreens).length - 1);

  return (
    <div className="fixed inset-0 bg-[#FFFDF5] z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFF8F0] to-[#FFE8CC] border-b-4 border-[#8B4000] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield size={40} color="#8B4000" />
            <div>
              <p className="text-[26px] font-bold text-[#8B4000]">🎮 Practice Mode Active</p>
              <p className="text-[18px] text-[#8B4000]">Step {currentStep + 1} of {playbookSteps.length}</p>
            </div>
          </div>
          <button onClick={onExit}
            className="px-6 py-3 bg-[#CC0000] hover:bg-[#aa0000] text-white rounded-xl
                       text-[22px] font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
            Exit Practice
          </button>
        </div>
      </div>

      {/* Instruction banner */}
      <div className="bg-[#EBF2FF] border-b-2 border-[#93C5FD] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1A56DB] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[20px]"
            style={{ minHeight: "auto", minWidth: "auto" }}>
            {currentStep + 1}
          </div>
          <p className="text-[22px] font-semibold text-[#1A56DB]">{step?.instruction}</p>
        </div>
      </div>

      {/* Simulated screen */}
      <div className="flex-1 relative overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="h-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {SimulatedScreens[screenIndex] || SimulatedScreens[4]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-t-4 border-[#D0C8B8] px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2 text-[18px] text-[#444] font-semibold">
            <span>Progress</span>
            <span>{currentStep}/{playbookSteps.length} steps</span>
          </div>
          <div className="w-full h-3 bg-[#F5F0E8] rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#1A7340] rounded-full"
              animate={{ width: `${(currentStep / playbookSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Practice Complete Screen ─────────────────────────────────────────────────

interface PracticeCompleteProps {
  metrics:          PracticeMetrics;
  playbookLength:   number;
  onProceedToReal:  () => void;
  onPracticeAgain:  () => void;
}

export function PracticeComplete({ metrics, playbookLength, onProceedToReal, onPracticeAgain }: PracticeCompleteProps) {
  const score = metrics.confidenceScore;

  const info = score >= 80
    ? { message: "You're ready! You did that perfectly!", emoji: "🌟", color: "#1A7340" }
    : score >= 60
    ? { message: "You're doing great! Want to try once more or go ahead?", emoji: "🌿", color: "#1A56DB" }
    : { message: "Good try! Want to practice again? There's no rush.", emoji: "🌱", color: "#8B4000" };

  const accuracy = metrics.attempts > 0
    ? Math.round((metrics.stepsCompleted / metrics.attempts) * 100)
    : 100;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-[#FFFDF5] rounded-3xl shadow-2xl max-w-4xl w-full p-12"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <div className="text-[100px] mb-3">{info.emoji}</div>
          <h2 className="text-[48px] font-bold text-[#1A1A1A] mb-4">Practice Complete!</h2>
          <p className="text-[28px] text-[#444444] leading-relaxed">{info.message}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-[#D0C8B8]">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={28} color="#1A56DB" />
              <span className="text-[22px] text-[#444444]">Time Taken</span>
            </div>
            <p className="text-[42px] font-bold text-[#1A1A1A]">
              {Math.floor(metrics.totalTime / 60000)}m {Math.floor((metrics.totalTime % 60000) / 1000)}s
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border-2 border-[#D0C8B8]">
            <div className="flex items-center gap-3 mb-2">
              <Target size={28} color="#1A56DB" />
              <span className="text-[22px] text-[#444444]">Accuracy</span>
            </div>
            <p className="text-[42px] font-bold text-[#1A1A1A]">{accuracy}%</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="bg-gradient-to-r from-[#EBF2FF] to-[#DBEAFE] rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[26px] font-semibold text-[#1A1A1A]">Your Readiness Score</span>
            <Trophy size={40} style={{ color: info.color }} />
          </div>
          <div className="w-full h-6 bg-white rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full"
              style={{ background: info.color }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[36px] font-bold text-center" style={{ color: info.color }}>
            {score}/100
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-6">
          <button onClick={onPracticeAgain}
            className="h-[88px] bg-white border-4 border-[#1A56DB] hover:bg-[#EBF2FF]
                       text-[#1A56DB] rounded-2xl text-[26px] font-bold transition-all
                       flex items-center justify-center gap-3
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
            🔄 Practice Again
          </button>
          <button onClick={onProceedToReal}
            className="h-[88px] bg-[#1A7340] hover:bg-[#155c33] text-white rounded-2xl
                       text-[26px] font-bold transition-all shadow-lg hover:shadow-xl
                       flex items-center justify-center gap-3
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
            ✅ I&apos;m Ready — Do It For Real
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
