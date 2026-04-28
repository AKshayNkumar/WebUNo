"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle, Phone, MessageCircle, Home } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import type { ScamAnalysisResult, CognitiveAnswer } from "./CognitiveLock";

interface ScamResponseProps {
  cognitiveAnswer:    CognitiveAnswer;
  scamAnalysis:       ScamAnalysisResult;
  onGoHome:           () => void;
  onContactGuardian:  () => void;
}

export function ScamResponse({
  cognitiveAnswer,
  scamAnalysis,
  onGoHome,
  onContactGuardian,
}: ScamResponseProps) {
  const { speak } = useTextToSpeech();

  useEffect(() => {
    // Log attempt (fire-and-forget)
    fetch("/api/scam/log-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cognitiveAnswer, analysis: scamAnalysis, timestamp: new Date() }),
    }).catch(() => {});

    // Alert guardians if needed
    if (cognitiveAnswer === "phone_call" || cognitiveAnswer === "not_sure") {
      fetch("/api/guardian/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertType: "scam_attempt",
          severity: "critical",
          message: "Scam attempt blocked! Someone may have called them.",
          analysis: scamAnalysis,
        }),
      }).catch(() => {});
    }

    // Read response aloud
    const msg =
      cognitiveAnswer === "phone_call"
        ? "This is very likely a scam. I have blocked this website and alerted your family. Please close this page."
        : cognitiveAnswer === "not_sure"
        ? "I am not sure if this is safe, so I am being extra careful. I have alerted your family. Let us go back home."
        : "I still have concerns about this website. I recommend going back to the home screen.";
    speak(msg, { rate: 0.8 });
  }, []);

  // ── CRITICAL: phone call confirmed ───────────────────────────────────────
  if (cognitiveAnswer === "phone_call") {
    return (
      <motion.div
        className="fixed inset-0 bg-[#CC0000] z-[9999] flex items-center justify-center p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-12 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <XCircle size={120} color="#CC0000" className="mx-auto mb-6" />
          </motion.div>

          <h2 className="text-[52px] font-bold text-[#CC0000] mb-8">🛑 SCAM BLOCKED</h2>

          <div className="bg-[#FEE2E2] border-4 border-[#CC0000] rounded-2xl p-8 mb-8">
            <p className="text-[28px] leading-relaxed text-[#7f0000] font-semibold">
              This is a SCAM. Someone was trying to trick you into giving them your
              money or personal information.
            </p>
          </div>

          <div className="bg-[#F5F0E8] rounded-2xl p-8 mb-8 text-left">
            <p className="text-[26px] text-[#1A1A1A] font-bold mb-5">What I&apos;ve done to protect you:</p>
            <ul className="space-y-4 text-[22px] text-[#444444]">
              {[
                "Blocked this dangerous website",
                "Sent an alert to your family members",
                "Saved a record of this attempt",
                "Made sure no information was shared",
              ].map((t) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="text-[#1A7340] text-[28px]">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#EBF2FF] border-2 border-[#1A56DB] rounded-2xl p-6 mb-8">
            <p className="text-[22px] text-[#1A1A1A] leading-relaxed">
              <strong>Remember:</strong> Real banks and government offices will NEVER call you and
              ask you to click on links or share passwords, OTP, CVV, or Aadhaar numbers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button onClick={onContactGuardian}
              className="h-[88px] bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-2xl
                         text-[26px] font-bold transition-all shadow-lg flex items-center
                         justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
              <Phone size={36} /> Call Family Now
            </button>
            <button onClick={onGoHome}
              className="h-[88px] bg-[#1A7340] hover:bg-[#155c33] text-white rounded-2xl
                         text-[26px] font-bold transition-all shadow-lg flex items-center
                         justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
              <Home size={36} /> Go to Safe Home Screen
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── WARNING: not_sure or found_myself but still suspicious ───────────────
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-[#FFFDF5] rounded-3xl shadow-2xl max-w-4xl w-full p-12"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle size={60} color="#8B4000" />
          </div>
          <h2 className="text-[44px] font-bold text-[#1A1A1A] mb-4">
            I Have Concerns About This Website
          </h2>
          <p className="text-[26px] text-[#444444] leading-relaxed">{scamAnalysis.userMessage}</p>
        </div>

        {/* Top 3 flags */}
        {scamAnalysis.flags.length > 0 && (
          <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-[#8B4000]">
            <p className="text-[24px] font-bold text-[#1A1A1A] mb-5">Warning signs I found:</p>
            <div className="space-y-4">
              {scamAnalysis.flags.slice(0, 3).map((flag, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-[28px]">⚠️</span>
                  <p className="text-[22px] text-[#444444]">{flag.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#EBF2FF] rounded-2xl p-6 mb-8 border-2 border-[#1A56DB]">
          <p className="text-[22px] text-[#1A1A1A] leading-relaxed">
            <strong>My recommendation:</strong> It&apos;s safer to go back to the home screen.
            If you really need to do something on this website, please ask a family member to help you first.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button onClick={onContactGuardian}
            className="h-[88px] bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-2xl
                       text-[26px] font-bold transition-all shadow-lg flex items-center
                       justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
            <MessageCircle size={36} /> Ask Family First
          </button>
          <button onClick={onGoHome}
            className="h-[88px] bg-[#1A7340] hover:bg-[#155c33] text-white rounded-2xl
                       text-[26px] font-bold transition-all shadow-lg flex items-center
                       justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
            <Home size={36} /> Go Back Home (Safer)
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
