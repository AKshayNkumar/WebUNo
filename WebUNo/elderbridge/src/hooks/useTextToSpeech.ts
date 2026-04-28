"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface TTSOptions {
  rate?:   number;
  pitch?:  number;
  volume?: number;
  voice?:  SpeechSynthesisVoice | null;
}

interface UseTTSReturn {
  speak:      (text: string, options?: TTSOptions) => void;
  stop:       () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices:     SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

export function useTextToSpeech(): UseTTSReturn {
  const [isSpeaking,    setIsSpeaking]    = useState(false);
  const [voices,        setVoices]        = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate,    setSpeechRate]    = useState(0.8);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!isSupported) return;
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      const preferred = available.find(v =>
        v.lang.startsWith("en") &&
        (v.name.includes("Female") || v.name.includes("Samantha") ||
         v.name.includes("Karen")  || v.name.includes("Moira") ||
         v.name.includes("Google UK English Female") ||
         v.name.includes("Microsoft Zira"))
      );
      const fallback = available.find(v => v.lang.startsWith("en"));
      setSelectedVoice(preferred || fallback || null);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [isSupported]);

  const speak = useCallback((text: string, options?: TTSOptions) => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    const cleanedText = text
      .replace(/[*_~`#]/g, "")
      .replace(/\b(Dr\.)/g, "Doctor")
      .replace(/\b(Rs\.)/g, "Rupees")
      .replace(/\b(No\.)/g, "Number");
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate   = options?.rate   ?? speechRate;
    utterance.pitch  = options?.pitch  ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;
    utterance.voice  = options?.voice  ?? selectedVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, speechRate]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, voices, selectedVoice, setSelectedVoice, speechRate, setSpeechRate };
}
