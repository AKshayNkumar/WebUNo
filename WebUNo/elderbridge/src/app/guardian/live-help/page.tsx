"use client";

import React, { useRef, useState } from "react";
import { Circle, Type, Trash2, Mic, MicOff, ArrowLeft } from "lucide-react";

type DrawMode = "circle" | "text";

interface Annotation {
  id:    string;
  type:  "circle" | "text";
  x:     number;
  y:     number;
  text?: string;
}

export default function LiveHelpSession() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [drawMode,  setDrawMode]  = useState<DrawMode>("circle");
  const [isMuted,   setIsMuted]   = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [elapsed,   setElapsed]   = useState("0:00");

  // Timer
  React.useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      setElapsed(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const sendAnnotation = async (ann: Annotation) => {
    setAnnotations((prev) => [...prev, ann]);
    await fetch("/api/guardian/send-annotation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annotation: ann }),
    }).catch(() => {});
    setTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== ann.id));
    }, 10000);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawMode === "circle") {
      sendAnnotation({ id: Date.now().toString(), type: "circle", x, y });
    } else {
      const text = prompt("Enter text to show on their screen:");
      if (text) sendAnnotation({ id: Date.now().toString(), type: "text", x, y, text });
    }
  };

  const clearAll = async () => {
    setAnnotations([]);
    await fetch("/api/guardian/clear-annotations", { method: "POST" }).catch(() => {});
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A] flex flex-col">

      {/* Top toolbar */}
      <div className="bg-[#2D2D2D] border-b-2 border-[#3D3D3D] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <a href="/guardian"
            className="text-white hover:text-[#D0C8B8] transition-colors"
            aria-label="Back to dashboard">
            <ArrowLeft size={28} />
          </a>
          <div className="w-3 h-3 bg-[#1A7340] rounded-full animate-pulse" />
          <span className="text-[20px] text-white font-bold">Live Session with Ajji</span>
          <span className="text-[16px] text-[#999999] font-semibold">Connected • {elapsed}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMuted((m) => !m)}
            className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]
                        ${isMuted ? "bg-[#CC0000] text-white" : "bg-[#3D3D3D] text-white hover:bg-[#4D4D4D]"}`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <a href="/guardian"
            className="px-6 py-3 bg-[#CC0000] hover:bg-[#aa0000] text-white
                       rounded-lg font-bold text-[18px] transition-all
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          >
            End Session
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Screen view + click overlay */}
        <div className="flex-1 relative bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
          {/* Simulated Senior's Screen */}
          <div className="w-[420px] h-full max-h-[780px] bg-[#FFFDF5] rounded-2xl overflow-y-auto shadow-2xl border-2 border-[#333] relative" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            {/* Phone status bar */}
            <div className="sticky top-0 z-10 bg-[#FFFDF5] px-4 py-2 flex items-center justify-between border-b border-[#E5E5E5]">
              <span className="text-[12px] font-bold text-[#444]">9:41 AM</span>
              <span className="text-[12px] font-bold text-[#444]">📶 🔋 92%</span>
            </div>

            {/* Senior's home screen content */}
            <div className="p-5">
              {/* Greeting */}
              <div className="mb-5">
                <p className="text-[22px] font-bold text-[#1A1A1A]">Good Morning, Ajji 🌅</p>
                <p className="text-[14px] text-[#767676] font-semibold">Tuesday, 29 April 2026</p>
              </div>

              {/* Reminder cards */}
              <div className="mb-5">
                <p className="text-[16px] font-bold text-[#1A1A1A] mb-3">🔔 Today&apos;s Reminders</p>
                <div className="flex items-center gap-3 p-4 rounded-xl mb-2" style={{ background: "#EDFBF2", borderLeft: "4px solid #1A7340" }}>
                  <span className="text-[24px]">💊</span>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1A1A1A]">Metformin 500mg</p>
                    <p className="text-[12px] text-[#444] font-semibold">1 tablet after breakfast</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#1A7340] bg-[#1A734018] px-2 py-1 rounded-full">8:30 AM</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#FFF0F0", borderLeft: "4px solid #CC0000" }}>
                  <span className="text-[24px]">⚡</span>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1A1A1A]">Electricity Bill</p>
                    <p className="text-[12px] text-[#444] font-semibold">₹1,240 due today</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#CC0000] bg-[#CC000018] px-2 py-1 rounded-full">Due Today</span>
                </div>
              </div>

              {/* Bill Payment Form (what Ajji is trying to do) */}
              <div className="mb-5 p-4 rounded-xl border-2 border-[#1A56DB] bg-[#EBF2FF]">
                <p className="text-[16px] font-bold text-[#1A56DB] mb-3">💡 Pay Electricity Bill</p>
                <div className="mb-3">
                  <label className="text-[12px] font-semibold text-[#444] block mb-1">Consumer Number</label>
                  <div className="bg-white border-2 border-[#D0C8B8] rounded-lg px-3 py-2 text-[14px] text-[#1A1A1A] font-semibold">
                    1234 5678 9012
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-[12px] font-semibold text-[#444] block mb-1">Amount to Pay</label>
                  <div className="bg-white border-2 border-[#D0C8B8] rounded-lg px-3 py-2 text-[14px] text-[#1A1A1A] font-bold">
                    ₹ 1,240.00
                  </div>
                </div>
                <div className="mb-3">
                  <label className="text-[12px] font-semibold text-[#444] block mb-1">Payment Method</label>
                  <div className="bg-white border-2 border-[#1A56DB] rounded-lg px-3 py-2 text-[14px] text-[#1A56DB] font-semibold">
                    🏦 SBI Savings A/c ****4521
                  </div>
                </div>
                <button className="w-full py-3 bg-[#1A7340] text-white rounded-xl text-[16px] font-bold mt-1"
                  style={{ minHeight: "auto", minWidth: "auto" }}
                  onClick={(e) => e.preventDefault()}>
                  ✅ Proceed to Pay
                </button>
              </div>

              {/* Quick tasks */}
              <div className="mb-5">
                <p className="text-[16px] font-bold text-[#1A1A1A] mb-3">✅ Quick Tasks</p>
                {[
                  { icon: "📞", title: "Call Daughter", sub: "Tap to call", color: "#8B4000", bg: "#FFF8F0" },
                  { icon: "💊", title: "Medicine Schedule", sub: "View medicines", color: "#1A7340", bg: "#EDFBF2" },
                ].map((t) => (
                  <div key={t.title} className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: t.bg, borderLeft: `4px solid ${t.color}` }}>
                    <span className="text-[20px]">{t.icon}</span>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#1A1A1A]">{t.title}</p>
                      <p className="text-[11px] text-[#444] font-semibold">{t.sub}</p>
                    </div>
                    <span className="text-[18px]" style={{ color: t.color }}>›</span>
                  </div>
                ))}
              </div>

              {/* Bottom nav mock */}
              <div className="flex items-center justify-around py-3 border-t-2 border-[#D0C8B8] bg-[#FFFDF5] -mx-5 px-3">
                {[
                  { icon: "🏠", label: "Home", active: true },
                  { icon: "📋", label: "Tasks", active: false },
                  { icon: "❤️", label: "Health", active: false },
                  { icon: "📖", label: "Diary", active: false },
                  { icon: "❓", label: "Help", active: false },
                ].map((n) => (
                  <div key={n.label} className="flex flex-col items-center gap-0.5">
                    <span className="text-[18px]">{n.icon}</span>
                    <span className={`text-[10px] font-bold ${n.active ? "text-[#1A56DB]" : "text-[#444]"}`}>{n.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* "LIVE" badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#CC0000] px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-[13px] font-bold">LIVE — Ajji&apos;s Screen</span>
          </div>

          {/* Instruction overlay */}
          <div className="absolute bottom-4 left-4 right-80 bg-black/70 backdrop-blur px-4 py-2.5 rounded-xl">
            <p className="text-white/90 text-[13px] font-semibold text-center">
              👆 Click anywhere on Ajji&apos;s screen to draw circles or add text labels to guide her
            </p>
          </div>

          {/* Live annotations display */}
          <div className="absolute inset-0 pointer-events-none">
            {annotations.map((ann) => (
              <div
                key={ann.id}
                className="absolute"
                style={{ left: ann.x, top: ann.y }}
              >
                {ann.type === "circle" && (
                  <div
                    className="w-24 h-24 border-8 border-[#FF6B00] rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ boxShadow: "0 0 24px rgba(255,107,0,0.7)", animation: "eb-pulse 1.5s infinite" }}
                  />
                )}
                {ann.type === "text" && (
                  <div className="px-5 py-3 bg-[#FF6B00] text-white text-[24px] font-bold rounded-xl -translate-x-1/2 -translate-y-full shadow-2xl whitespace-nowrap">
                    {ann.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Click handler */}
          <div className="absolute inset-0 cursor-crosshair" onClick={handleCanvasClick} />
        </div>

        {/* Right sidebar */}
        <div className="w-72 bg-[#2D2D2D] border-l-2 border-[#3D3D3D] p-6 flex flex-col gap-5 overflow-y-auto">
          <h3 className="text-[20px] font-bold text-white">Annotation Tools</h3>

          {/* Draw mode buttons */}
          {[
            { mode: "circle" as DrawMode, icon: <Circle size={22} />, label: "Draw Circle" },
            { mode: "text"   as DrawMode, icon: <Type size={22} />,   label: "Add Text" },
          ].map((t) => (
            <button
              key={t.mode}
              onClick={() => setDrawMode(t.mode)}
              className={`w-full px-5 py-4 rounded-xl font-bold text-[18px] transition-all
                          flex items-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]
                          ${drawMode === t.mode ? "bg-[#FF6B00] text-white" : "bg-[#3D3D3D] text-white hover:bg-[#4D4D4D]"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}

          <button
            onClick={clearAll}
            className="w-full px-5 py-4 bg-[#CC0000] hover:bg-[#aa0000] text-white
                       rounded-xl font-bold text-[18px] transition-all flex items-center
                       justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          >
            <Trash2 size={22} /> Clear All
          </button>

          {/* Quick text labels */}
          <div className="bg-[#3D3D3D] rounded-xl p-5">
            <h4 className="text-[16px] font-bold text-white mb-4">Quick Labels</h4>
            <div className="space-y-2">
              {["Click Here", "Type Here", "Scroll Down", "Press Submit"].map((label) => (
                <button
                  key={label}
                  onClick={() => sendAnnotation({ id: Date.now().toString(), type: "text", x: 300, y: 300, text: label })}
                  className="w-full px-4 py-3 bg-[#4D4D4D] hover:bg-[#5D5D5D] text-white
                             rounded-lg text-[15px] font-semibold transition-all text-left
                             focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                >
                  &ldquo;{label}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Voice indicator */}
          <div className="bg-[#1A56DB] rounded-xl p-5">
            <h4 className="text-[16px] font-bold text-white mb-2">🎤 Your Voice</h4>
            <p className="text-[13px] text-white/80 mb-3">Speak slowly and clearly — they can hear you.</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/5 rounded-full" />
              </div>
              <span className="text-white text-[12px] font-semibold">60%</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes eb-pulse { 0%,100%{transform:translate(-50%,-50%) scale(1);} 50%{transform:translate(-50%,-50%) scale(1.12);} }
      `}</style>
    </div>
  );
}
