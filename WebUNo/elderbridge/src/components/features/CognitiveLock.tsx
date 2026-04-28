"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, Shield, User } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

export interface ScamFlag {
  category:    "url" | "content" | "behavior" | "cognitive";
  severity:    "low" | "medium" | "high" | "critical";
  description: string;
  evidence:    string;
}

export interface ScamAnalysisResult {
  threatLevel:        "safe" | "warning" | "danger" | "critical";
  confidence:         number;
  flags:              ScamFlag[];
  shouldBlock:        boolean;
  userMessage:        string;
  technicalDetails:   string;
  recommendedAction:  "proceed" | "verify" | "block" | "alert_guardian";
}

export type CognitiveAnswer = "phone_call" | "found_myself" | "not_sure";

interface CognitiveLockProps {
  scamAnalysis: ScamAnalysisResult;
  onAnswer:     (answer: CognitiveAnswer) => void;
}

export function CognitiveLock({ scamAnalysis, onAnswer }: CognitiveLockProps) {
  const { speak } = useTextToSpeech();

  useEffect(() => {
    speak(
      `Wait. Before you continue, I need to ask you something important.
       Did someone call you on the phone recently and tell you to visit this website or click on a link?
       This is very important. Please think carefully before answering.`,
      { rate: 0.75 }
    );
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-[#FFFDF5] rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1,   y: 0  }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Red alert header */}
        <div className="bg-gradient-to-r from-[#CC0000] to-[#991111] px-10 py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
              <Shield size={44} color="#CC0000" />
            </div>
            <div>
              <h2 className="text-[44px] font-bold text-white mb-1">⚠️ WAIT — STOP HERE</h2>
              <p className="text-[22px] text-white/90">I need to ask you something important first</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-10">
          <div className="bg-[#FFF8F0] border-4 border-[#8B4000] rounded-2xl p-8 mb-8">
            <p className="text-[32px] leading-relaxed font-bold text-[#8B4000] text-center mb-6">
              Did someone CALL YOU on the phone recently and tell you to
              visit this website or click on a link?
            </p>
            <div className="bg-white rounded-xl p-6">
              <p className="text-[22px] text-[#444444] text-center mb-4 font-semibold">
                Think carefully: Did anyone call and say things like:
              </p>
              <ul className="space-y-2 text-[20px] text-[#444444]">
                {[
                  "\"Your account will be blocked\"",
                  "\"You need to verify your information\"",
                  "\"Click this link immediately\"",
                  "\"You won a prize, claim it now\"",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="text-[#CC0000] text-[24px]">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Answer buttons */}
          <div className="space-y-5">
            {/* YES - phone call */}
            <button
              onClick={() => onAnswer("phone_call")}
              className="w-full bg-[#CC0000] hover:bg-[#aa0000] text-white rounded-2xl
                         p-7 transition-all duration-200 shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={32} color="#CC0000" />
                </div>
                <div className="text-left">
                  <p className="text-[28px] font-bold mb-1">📞 YES, Someone Called Me</p>
                  <p className="text-[18px] opacity-90">Someone called and told me to visit this website</p>
                </div>
              </div>
            </button>

            {/* NOT SURE */}
            <button
              onClick={() => onAnswer("not_sure")}
              className="w-full bg-[#8B4000] hover:bg-[#703300] text-white rounded-2xl
                         p-7 transition-all duration-200 shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={32} color="#8B4000" />
                </div>
                <div className="text-left">
                  <p className="text-[28px] font-bold mb-1">🤔 I&apos;m Not Sure / I Don&apos;t Remember</p>
                  <p className="text-[18px] opacity-90">I can&apos;t remember if someone called me about this</p>
                </div>
              </div>
            </button>

            {/* NO - found myself */}
            <button
              onClick={() => onAnswer("found_myself")}
              className="w-full bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-2xl
                         p-7 transition-all duration-200 shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={32} color="#1A56DB" />
                </div>
                <div className="text-left">
                  <p className="text-[28px] font-bold mb-1">❌ NO, I Found This Myself</p>
                  <p className="text-[18px] opacity-90">No one called me. I came here on my own.</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 bg-[#EBF2FF] rounded-xl p-6 border-2 border-[#1A56DB]">
            <p className="text-[20px] text-[#1A1A1A] leading-relaxed">
              <strong>Why am I asking this?</strong><br />
              Many scammers call elderly people and trick them into visiting fake websites.
              This question helps me protect you.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
