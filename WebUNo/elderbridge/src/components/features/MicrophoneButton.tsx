"use client";

import React from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import type { VoiceCommandStatus } from "@/hooks/useVoiceCommand";

interface MicrophoneButtonProps {
  status:      VoiceCommandStatus;
  onStart:     () => void;
  onStop:      () => void;
  transcript?: string;
}

const statusConfig = {
  idle:       { bg: "#1A56DB", icon: Mic,     label: "Tap to speak",           ariaLabel: "Start voice command",      ring: "#1A56DB" },
  listening:  { bg: "#CC0000", icon: Mic,     label: "Listening... speak now",  ariaLabel: "Listening — tap to stop",  ring: "#CC0000" },
  processing: { bg: "#8B4000", icon: Loader2, label: "Understanding you...",    ariaLabel: "Processing your command",  ring: "#8B4000" },
  confirming: { bg: "#1A7340", icon: Mic,     label: "Got it!",                 ariaLabel: "Command received",         ring: "#1A7340" },
  error:      { bg: "#CC0000", icon: MicOff,  label: "Tap to try again",        ariaLabel: "Error — tap to try again", ring: "#CC0000" },
};

export function MicrophoneButton({ status, onStart, onStop, transcript }: MicrophoneButtonProps) {
  const config       = statusConfig[status] || statusConfig.idle;
  const Icon         = config.icon;
  const isListening  = status === "listening";
  const isProcessing = status === "processing";

  const handleClick = () => { isListening ? onStop() : onStart(); };

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Live transcript */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            className="w-full px-6 py-4 bg-[#EBF2FF] rounded-2xl border-2 border-[#1A56DB] text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-live="polite"
            aria-atomic="false"
          >
            <p className="text-[26px] font-semibold text-[#1A56DB] italic">&ldquo;{transcript}&rdquo;</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic circle */}
      <div className="relative flex items-center justify-center">
        <motion.button
          onClick={handleClick}
          className={clsx(
            "h-24 w-24 rounded-full flex items-center justify-center",
            "transition-colors duration-300 select-none",
            "focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-4",
          )}
          style={{
            backgroundColor: config.bg,
            boxShadow: isListening
              ? `0 0 0 8px ${config.ring}33, 0 8px 24px -4px ${config.ring}66`
              : `0 8px 24px -4px ${config.ring}44`,
          }}
          whileTap={{ scale: 0.93 }}
          aria-label={config.ariaLabel}
          aria-pressed={isListening}
        >
          {/* Icon — pulses while listening */}
          <motion.div
            animate={isListening ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={{ repeat: isListening ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
          >
            {isListening ? (
              <div className="flex items-end gap-1.5 h-10" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-[#FFFDF5] rounded-full"
                    animate={{ height: ["12px", "40px", "12px"] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }}
                    style={{ minHeight: "12px" }}
                  />
                ))}
              </div>
            ) : (
              <Icon
                size={44}
                color="#FFFDF5"
                strokeWidth={2}
                className={isProcessing ? "animate-spin" : ""}
                aria-hidden="true"
              />
            )}
          </motion.div>
        </motion.button>

        {/* Pulsing ring while listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="absolute h-24 w-24 rounded-full border-4 border-[#CC0000] pointer-events-none"
              initial={{ opacity: 0.4, scale: 1 }}
              animate={{ opacity: 0, scale: 1.7 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Status label */}
      <motion.p
        key={status}
        className={clsx(
          "text-[24px] font-bold text-center",
          isListening  && "text-[#CC0000]",
          isProcessing && "text-[#8B4000]",
          !isListening && !isProcessing && "text-[#444444]",
        )}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        aria-live="polite"
      >
        {config.label}
      </motion.p>
    </div>
  );
}
