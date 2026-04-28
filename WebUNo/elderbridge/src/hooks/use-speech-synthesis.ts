"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseSpeechSynthesisReturn {
  speak: (text: string, rate?: number) => void;
  stop:  () => void;
  speaking: boolean;
  supported: boolean;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [speaking,  setSpeaking]  = useState(false);
  const voiceRef    = useRef<SpeechSynthesisVoice | null>(null);
  const supported   = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const voices  = window.speechSynthesis.getVoices();
      const prefer  = voices.find(v =>
        v.lang.startsWith("en") &&
        (v.name.includes("Female") || v.name.includes("Samantha") ||
         v.name.includes("Karen")  || v.name.includes("Google UK English Female") ||
         v.name.includes("Microsoft Zira"))
      );
      voiceRef.current = prefer || voices.find(v => v.lang.startsWith("en")) || null;
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [supported]);

  const speak = useCallback((text: string, rate = 0.85) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_~`#]/g, "").replace(/\b(Dr\.)/g, "Doctor").replace(/\b(Rs\.)/g, "Rupees");
    const u = new SpeechSynthesisUtterance(clean);
    u.rate   = rate;
    u.pitch  = 1.0;
    u.volume = 1.0;
    u.voice  = voiceRef.current;
    u.onstart = () => setSpeaking(true);
    u.onend   = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported };
}
