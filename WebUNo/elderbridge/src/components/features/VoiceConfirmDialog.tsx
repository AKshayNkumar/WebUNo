"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, CheckCircle2, RotateCcw } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface VoiceConfirmDialogProps {
  heardText:     string;
  onConfirm:     (alt?: string) => void;
  onRetry:       () => void;
  alternatives?: string[];
}

export function VoiceConfirmDialog({
  heardText,
  onConfirm,
  onRetry,
  alternatives,
}: VoiceConfirmDialogProps) {
  const { speak } = useTextToSpeech();

  useEffect(() => {
    speak(`I heard: ${heardText}. Is that correct?`, { rate: 0.8 });
  }, [heardText]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vc-title"
    >
      <motion.div
        className="bg-[#FFFDF5] rounded-3xl shadow-2xl max-w-2xl w-full p-10"
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1,    y: 0  }}
        exit={{    scale: 0.92, y: 24 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#EBF2FF] rounded-full flex items-center justify-center flex-shrink-0">
            <Volume2 size={36} color="#1A56DB" aria-hidden="true" />
          </div>
          <p id="vc-title" className="text-[28px] text-[#444444] font-semibold">
            I heard you say:
          </p>
        </div>

        {/* Heard text */}
        <div className="bg-white border-4 border-[#1A56DB] rounded-2xl p-8 mb-8">
          <p className="text-[42px] font-bold text-[#1A1A1A] leading-tight">
            &ldquo;{heardText}&rdquo;
          </p>
        </div>

        <p className="text-[32px] text-[#1A1A1A] font-semibold mb-8 text-center">
          Is that correct?
        </p>

        {/* Primary buttons */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <button
            onClick={() => onConfirm()}
            className="h-[96px] bg-[#1A7340] hover:bg-[#155c33] text-white rounded-2xl
                       text-[28px] font-bold flex items-center justify-center gap-4
                       transition-all duration-200 shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            aria-label="Yes, that is correct"
          >
            <CheckCircle2 size={36} />
            Yes, Correct
          </button>

          <button
            onClick={onRetry}
            className="h-[96px] bg-[#CC0000] hover:bg-[#aa0000] text-white rounded-2xl
                       text-[28px] font-bold flex items-center justify-center gap-4
                       transition-all duration-200 shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
            aria-label="Try again"
          >
            <RotateCcw size={36} />
            Try Again
          </button>
        </div>

        {/* Alternatives */}
        <AnimatePresence>
          {alternatives && alternatives.length > 0 && (
            <motion.div
              className="border-t-2 border-[#D0C8B8] pt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[22px] text-[#444444] mb-4 font-semibold">
                Or did you mean:
              </p>
              <div className="flex flex-col gap-3">
                {alternatives.map((alt, i) => (
                  <button
                    key={i}
                    onClick={() => onConfirm(alt)}
                    className="w-full h-[72px] bg-white border-2 border-[#1A56DB]
                               hover:bg-[#EBF2FF] rounded-xl text-[24px] font-semibold
                               text-[#1A56DB] transition-all duration-200
                               focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
