"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useRouter } from "next/navigation";

interface MicrophoneProps {
  listening:   boolean;
  onActivate:  () => void;
  transcript?: string;
}

export function Microphone({ listening, onActivate, transcript }: MicrophoneProps) {
  const { speak } = useSpeechSynthesis();
  const router    = useRouter();

  const handleClick = () => {
    if (!listening) speak("I am listening");
    onActivate();
  };

  const handleConfirm = () => {
    if (!transcript) return;
    const lower = transcript.toLowerCase();
    if (lower.includes("electricity") || lower.includes("bill"))       router.push("/tasks");
    else if (lower.includes("call") || lower.includes("daughter"))     router.push("/help");
    else if (lower.includes("balance") || lower.includes("bank"))      router.push("/tasks");
    else if (lower.includes("medicine") || lower.includes("tablet"))   router.push("/health");
    else if (lower.includes("help"))                                   router.push("/help");
    else speak("I didn't understand that. Please tap a button on screen.");
  };

  const handleRetry = () => {
    speak("No problem. Tap the microphone and try again.");
    onActivate();
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Microphone Button */}
      <motion.button
        onClick={handleClick}
        className={`
          w-full h-[120px] rounded-3xl
          flex flex-col items-center justify-center
          text-[#FFFDF5] font-bold text-[24px]
          shadow-lg transition-all duration-300 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2
          ${listening ? "bg-[#CC0000]" : "bg-[#1A56DB] hover:bg-[#1446B8]"}
        `}
        whileTap={{ scale: 0.97 }}
        aria-label={listening ? "Listening to your voice — tap to stop" : "Tap to speak"}
        aria-pressed={listening}
      >
        <motion.div
          animate={listening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ repeat: listening ? Infinity : 0, duration: 1.5 }}
          className="mb-2"
        >
          {listening
            ? <Mic className="w-14 h-14" aria-hidden="true" />
            : <MicOff className="w-14 h-14" aria-hidden="true" />
          }
        </motion.div>
        <span className="px-6 text-center leading-tight">
          {listening ? "I am listening..." : "Tap here and tell me what you want to do today"}
        </span>
      </motion.button>

      {/* Waveform while listening */}
      <AnimatePresence>
        {listening && (
          <motion.div
            className="flex items-center justify-center gap-2 h-14"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-3 bg-[#CC0000] rounded-full"
                animate={{ height: [20, 48, 20] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                style={{ minHeight: 8 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript + confirmation */}
      <AnimatePresence>
        {transcript && !listening && (
          <motion.div
            className="bg-[#FFFDF5] border-4 border-[#1A56DB] rounded-2xl p-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-[20px] text-[#444444] mb-2 font-semibold">I heard:</p>
            <p className="text-[28px] text-[#1A56DB] font-bold leading-tight mb-6">
              &ldquo;{transcript}&rdquo;
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-[#1A7340] text-[#FFFDF5] min-h-[80px] rounded-2xl text-[22px] font-bold hover:bg-[#155C33] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              >
                ✅ Yes, that&apos;s right
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 bg-[#8B4000] text-[#FFFDF5] min-h-[80px] rounded-2xl text-[22px] font-bold hover:bg-[#703300] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              >
                🔄 Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
