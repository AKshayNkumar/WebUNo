"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type VoiceCommandStatus = "idle" | "listening" | "processing" | "confirming" | "error";

interface UseVoiceCommandReturn {
  status:          VoiceCommandStatus;
  transcript:      string;
  confidence:      number;
  startListening:  () => void;
  stopListening:   () => void;
  resetTranscript: () => void;
  isSupported:     boolean;
  error:           string | null;
}

export function useVoiceCommand(
  onResult?: (transcript: string, confidence: number) => void
): UseVoiceCommandReturn {
  const [status,     setStatus]     = useState<VoiceCommandStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [error,      setError]      = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timeoutRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSupported    = typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const cleanupTimeout = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  const startListening = useCallback(() => {
    if (!isSupported) { setError("Voice input is not available on this device"); return; }
    setTranscript(""); setConfidence(0); setError(null); setStatus("listening");

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous      = false;
    recognition.interimResults  = true;
    recognition.lang            = "en-IN";
    recognition.maxAlternatives = 3;

    timeoutRef.current = setTimeout(() => {
      recognition.stop();
      setStatus("idle");
      setError("I didn't catch that. Please tap the microphone and try again.");
    }, 8000);

    recognition.onresult = (event: any) => {
      cleanupTimeout();
      const result = event.results[event.results.length - 1];
      const best   = result[0];
      setTranscript(best.transcript.trim());
      setConfidence(best.confidence);
      if (result.isFinal) {
        setStatus("confirming");
        onResult?.(best.transcript.trim(), best.confidence);
      }
    };

    recognition.onerror = (event: any) => {
      cleanupTimeout();
      setStatus("idle");
      const msgs: Record<string, string> = {
        "no-speech":   "I didn't hear anything. Please try again.",
        "audio-capture": "I can't access your microphone. Please check your settings.",
        "not-allowed": "Microphone permission is needed. Please allow it in your browser settings.",
        "network":     "Voice recognition needs internet. Please check your connection.",
        "aborted":     "Listening stopped. Tap the microphone when you're ready.",
      };
      setError(msgs[event.error] || "Something went wrong with voice. Please try again.");
    };

    recognition.onend = () => { cleanupTimeout(); };
    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, onResult]);

  const stopListening = useCallback(() => {
    cleanupTimeout();
    recognitionRef.current?.stop();
    setStatus("idle");
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript(""); setConfidence(0); setError(null); setStatus("idle");
  }, []);

  useEffect(() => () => { cleanupTimeout(); recognitionRef.current?.abort(); }, []);

  return { status, transcript, confidence, startListening, stopListening, resetTranscript, isSupported, error };
}
