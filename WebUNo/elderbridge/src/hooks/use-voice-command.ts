"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseVoiceCommandReturn {
  listening:       boolean;
  transcript:      string;
  startListening:  () => Promise<void>;
  stopListening:   () => void;
  error:           string | null;
  supported:       boolean;
}

export function useVoiceCommand(
  onResult?: (transcript: string) => void
): UseVoiceCommandReturn {
  const [listening,  setListening]  = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error,      setError]      = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timeoutRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supported      = typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const cleanupTimeout = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  const startListening = useCallback(async () => {
    if (!supported) { setError("Voice input not available on this device"); return; }
    setTranscript(""); setError(null); setListening(true);

    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechAPI();
    recognition.continuous      = false;
    recognition.interimResults  = true;
    recognition.lang            = "en-IN";
    recognition.maxAlternatives = 3;

    timeoutRef.current = setTimeout(() => {
      recognition.stop();
      setListening(false);
      setError("I didn't catch that. Please try again.");
    }, 8000);

    recognition.onresult = (event: any) => {
      cleanupTimeout();
      const result = event.results[event.results.length - 1];
      const best   = result[0];
      setTranscript(best.transcript.trim());
      if (result.isFinal) {
        setListening(false);
        onResult?.(best.transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      cleanupTimeout();
      setListening(false);
      const msgs: Record<string, string> = {
        "no-speech":     "I didn't hear anything. Please try again.",
        "audio-capture": "Can't access your microphone. Check settings.",
        "not-allowed":   "Microphone permission needed. Please allow it.",
        "network":       "Voice recognition needs internet.",
      };
      setError(msgs[event.error] || "Something went wrong. Please try again.");
    };

    recognition.onend = () => { cleanupTimeout(); setListening(false); };
    recognitionRef.current = recognition;
    recognition.start();
  }, [supported, onResult]);

  const stopListening = useCallback(() => {
    cleanupTimeout();
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => () => { cleanupTimeout(); recognitionRef.current?.abort(); }, []);

  return { listening, transcript, startListening, stopListening, error, supported };
}
