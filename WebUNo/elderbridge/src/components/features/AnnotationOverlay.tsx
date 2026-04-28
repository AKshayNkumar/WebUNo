"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Annotation {
  id:               string;
  type:             "circle" | "text";
  x:                number;
  y:                number;
  text?:            string;
  fontSize?:        number;
  timestamp:        number;
}

export function AnnotationOverlay() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    // Poll for annotations via API (WebSocket would be better in production)
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/guardian/annotations");
        if (!res.ok) return;
        const data = await res.json();
        if (data.annotations) setAnnotations(data.annotations);
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (annotations.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {/* Helper banner */}
      <motion.div
        className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#1A56DB] text-white
                   px-8 py-4 rounded-2xl shadow-2xl z-[9999]"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
      >
        <p className="text-[22px] font-bold text-center">
          👆 Your family is helping you — follow the orange circles
        </p>
      </motion.div>

      <AnimatePresence>
        {annotations.map((ann) => (
          <AnnotationElement key={ann.id} annotation={ann} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function AnnotationElement({ annotation }: { annotation: Annotation }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{    scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "backOut" }}
      style={{ position: "fixed", left: annotation.x, top: annotation.y, pointerEvents: "none" }}
    >
      {annotation.type === "circle" && (
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 border-8 border-[#FF6B00] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ boxShadow: "0 0 30px rgba(255,107,0,0.6)" }}
        />
      )}

      {annotation.type === "text" && annotation.text && (
        <div
          className="px-6 py-3 bg-[#FF6B00] text-white rounded-2xl shadow-2xl
                     -translate-x-1/2 -translate-y-full relative"
          style={{ fontSize: annotation.fontSize ?? 28 }}
        >
          <p className="font-bold whitespace-nowrap">{annotation.text}</p>
          {/* Arrow pointer */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full
                          w-0 h-0 border-l-8 border-r-8 border-t-8
                          border-transparent border-t-[#FF6B00]" />
        </div>
      )}
    </motion.div>
  );
}
