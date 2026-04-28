"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Shield, Volume2, Users, BarChart2, CheckCircle2, Download } from "lucide-react";

/* ─── Extension Popup Preview ────────────────────────────────── */
function ExtensionPopupDemo() {
  const [seniorMode, setSeniorMode] = useState(false);
  const [status,     setStatus]     = useState("Click the toggle to activate Senior Mode");
  const [statusBg,   setStatusBg]   = useState("#F3F4F6");
  const [statusColor,setStatusColor]= useState("#666666");
  const [notified,   setNotified]   = useState(false);

  const toggle = () => {
    const next = !seniorMode;
    setSeniorMode(next);
    if (next) {
      setStatus("✅ Senior Mode is ON on this page");
      setStatusBg("#DCFCE7"); setStatusColor("#1A7340");
    } else {
      setStatus("Senior Mode is OFF");
      setStatusBg("#F3F4F6"); setStatusColor("#666666");
    }
  };

  const handleGetHelp = () => {
    setNotified(true);
    setStatus("✅ Your family has been notified!");
    setStatusBg("#DCFCE7"); setStatusColor("#1A7340");
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <div style={{
      width: 360,
      padding: 24,
      fontFamily: "system-ui, sans-serif",
      background: "linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%)",
      borderRadius: 20,
      boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      border: "1px solid #E5E7EB",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48 }}>🌉</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginTop: 6 }}>ElderBridge</div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>Making the internet simple &amp; safe</div>
      </div>

      {/* Toggle */}
      <div style={{
        background: "white", borderRadius: 14, padding: 18,
        marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A" }}>Senior Mode</span>
          <div
            onClick={toggle}
            style={{
              position: "relative", width: 56, height: 30,
              background: seniorMode ? "#1A7340" : "#E5E7EB",
              borderRadius: 15, cursor: "pointer", transition: "background 0.3s",
            }}
          >
            <div style={{
              position: "absolute", top: 4,
              left: seniorMode ? 28 : 4,
              width: 22, height: 22,
              background: "white", borderRadius: "50%",
              transition: "left 0.3s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </div>
        </div>
        <div style={{
          marginTop: 10, padding: "10px 14px",
          background: statusBg, borderRadius: 8,
          fontSize: 13, color: statusColor, textAlign: "center", fontWeight: 600,
          transition: "all 0.3s",
        }}>
          {status}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: "white", borderRadius: 14, padding: 18,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 10 }}>Quick Actions</div>
        {[
          { emoji: "🛡️", label: "Check if this page is safe",  onClick: () => alert("✅ This page is safe!") },
          { emoji: "🔊", label: "Read this page aloud",         onClick: () => { const u = new SpeechSynthesisUtterance("This page is safe to use."); u.rate=0.8; window.speechSynthesis.speak(u); }},
          { emoji: "👨‍👩‍👧", label: "Get help from family",      onClick: handleGetHelp },
          { emoji: "📊", label: "Open full dashboard",          onClick: () => window.open("/guardian","_blank") },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            style={{
              width: "100%", padding: "12px 16px", marginBottom: 6,
              background: "#F3F4F6", border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 600, color: "#1A1A1A",
              cursor: "pointer", textAlign: "left", transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: 10,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#E5E7EB")}
            onMouseLeave={e => (e.currentTarget.style.background = "#F3F4F6")}
          >
            <span style={{ fontSize: 20 }}>{btn.emoji}</span>
            {btn.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "#999" }}>
        Built with ❤️ for seniors •{" "}
        <a href="/" style={{ color: "#1A56DB", textDecoration: "none" }}>Learn More</a>
      </div>
    </div>
  );
}

/* ─── Feature Cards ──────────────────────────────────────────── */
const FEATURES = [
  { icon: <Shield size={32} color="#CC0000" />,  bg: "#FFF0F0", title: "Auto Scam Detection",      desc: "Automatically checks every website you visit and blocks dangerous ones before they can harm you." },
  { icon: <Volume2 size={32} color="#1A56DB" />, bg: "#EBF2FF", title: "Read Aloud Any Page",       desc: "One click and ElderBridge reads the entire webpage out loud in a clear, slow voice." },
  { icon: <Users size={32} color="#1A7340" />,   bg: "#EDFBF2", title: "One-Tap Family Alert",      desc: "Tap once to instantly notify your family if you need help with anything on the internet." },
  { icon: <BarChart2 size={32} color="#8B4000" />,bg:"#FFF8F0", title: "Confidence Tracking",       desc: "Silently tracks your digital skills and sends a friendly weekly report to your family." },
];

export default function ExtensionPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          {/* Header */}
          <motion.header className="mb-8" initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-[40px] font-bold text-[#1A1A1A] leading-tight mb-2">
              🌉 ElderBridge Extension
            </h1>
            <p className="text-[22px] font-semibold text-[#444444]">
              Makes <em>any</em> website simple, safe &amp; accessible
            </p>
          </motion.header>

          {/* Live Popup Demo */}
          <motion.section className="mb-10" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <h2 className="text-[26px] font-bold text-[#1A1A1A] mb-5">
              🎮 Try the Extension Popup — Live Demo
            </h2>
            <p className="text-[18px] text-[#444] mb-6 font-semibold">
              This is exactly what appears when you click the extension in your browser. Try clicking the toggle and buttons below!
            </p>
            <div className="flex justify-center">
              <ExtensionPopupDemo />
            </div>
          </motion.section>

          {/* Features */}
          <motion.section className="mb-10" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
            <h2 className="text-[26px] font-bold text-[#1A1A1A] mb-5">What It Does</h2>
            <div className="flex flex-col gap-5">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-5 p-6 rounded-2xl shadow-md border border-[#D0C8B8]"
                  style={{ backgroundColor: f.bg }}
                  initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                >
                  <div className="flex-shrink-0 mt-1">{f.icon}</div>
                  <div>
                    <p className="text-[22px] font-bold text-[#1A1A1A] mb-1">{f.title}</p>
                    <p className="text-[17px] font-semibold text-[#444444]">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* How to Install */}
          <motion.section className="mb-10" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
            <h2 className="text-[26px] font-bold text-[#1A1A1A] mb-5">How to Install</h2>
            <div className="flex flex-col gap-4">
              {[
                { n:"1", text: "Ask your family to help you open Google Chrome" },
                { n:"2", text: "Go to the Chrome Web Store and search for 'ElderBridge'" },
                { n:"3", text: "Click 'Add to Chrome' — it is completely free" },
                { n:"4", text: "A small bridge icon 🌉 will appear in your browser toolbar" },
                { n:"5", text: "Tap it anytime to get help, check safety, or call family" },
              ].map((step) => (
                <div key={step.n} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#D0C8B8] shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#1A56DB] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[20px] font-bold">{step.n}</span>
                  </div>
                  <p className="text-[20px] font-bold text-[#1A1A1A]">{step.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <CheckCircle2 size={28} color="#1A7340" />
              <p className="text-[20px] font-bold text-[#1A7340]">
                Free • No account needed • Works on all websites
              </p>
            </div>
          </motion.section>

        </div>
      </main>
      <BottomNavigation currentPage="help" />
    </>
  );
}
