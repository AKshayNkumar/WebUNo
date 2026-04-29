"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, BookOpen, Pill, Zap, Phone, Landmark } from "lucide-react";
import { MicrophoneButton }  from "@/components/features/MicrophoneButton";
import { BottomNavigation }  from "@/components/layout/BottomNavigation";
import { VoiceConfirmDialog }from "@/components/features/VoiceConfirmDialog";
import { CognitiveLock }     from "@/components/features/CognitiveLock";
import { ScamResponse }      from "@/components/features/ScamResponse";
import { useTextToSpeech }   from "@/hooks/useTextToSpeech";
import { useVoiceCommand }   from "@/hooks/useVoiceCommand";
import { useLanguage }       from "@/hooks/useLanguage";

const DEMO_USER = { name: "Ajji", speechRate: 0.8 };

const REMINDERS = [
  { id:"r1", emoji:"💊", title:"Metformin 500mg",            detail:"1 tablet after breakfast",  time:"8:30 AM",   color:"#1A7340", bg:"#EDFBF2", overdue:false },
  { id:"r2", emoji:"⚡", title:"Electricity Bill Due Today",  detail:"₹1,240 due by midnight",    time:"Due Today", color:"#CC0000", bg:"#FFF0F0", overdue:true  },
];

const TASKS = [
  { id:"t1", emoji:"📞", title:"Call Daughter",       detail:"Tap to call family",          href:"/help",     color:"#8B4000", bg:"#FFF8F0" },
  { id:"t2", emoji:"🏦", title:"Check Bank Balance",  detail:"Safe, guided walkthrough",    href:"/playbook", color:"#1A56DB", bg:"#EBF2FF" },
  { id:"t3", emoji:"💊", title:"Medicine Schedule",   detail:"View today's medicines",      href:"/health",   color:"#1A7340", bg:"#EDFBF2" },
];

const SCAM_ANALYSIS = {
  threatLevel:"critical" as const, confidence:0.95,
  flags:[{ category:"url" as const, severity:"critical" as const, description:"Fake bank site", evidence:"www.sbi-alert-login.com" }],
  shouldBlock:true, userMessage:"This website is pretending to be your bank. It is NOT safe.",
  technicalDetails:"Phishing domain", recommendedAction:"block" as const,
};

function getGreeting(t: (k:string) => string) {
  const h = new Date().getHours();
  return h < 12 ? t("greeting_morning") : h < 17 ? t("greeting_afternoon") : t("greeting_evening");
}
function getDate(lang: string) {
  return new Date().toLocaleDateString(lang === "kn" ? "kn-IN" : "en-IN",{ weekday:"long", day:"numeric", month:"long", year:"numeric" });
}

type ScamState = "none"|"lock"|"response";

export default function HomePage() {
  const { speak } = useTextToSpeech();
  const { t, lang } = useLanguage();
  const [voiceResult, setVoiceResult]   = useState<string|null>(null);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [scamState,   setScamState]     = useState<ScamState>("none");
  const [cogAnswer,   setCogAnswer]     = useState<"phone_call"|"found_myself"|"not_sure"|null>(null);
  const [largeText,   setLargeText]     = useState(false);

  const { status, transcript, startListening, stopListening } = useVoiceCommand(r => {
    setVoiceResult(r); setShowConfirm(true);
  });

  useEffect(() => {
    const timer = setTimeout(() =>
      speak(`${getGreeting(t)}, ${DEMO_USER.name}. You have 2 reminders today. Tap the microphone to tell me what you need.`,
        { rate: DEMO_USER.speechRate }), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? "120%" : "100%";
  }, [largeText]);

  const handleConfirm = (ok: boolean) => {
    setShowConfirm(false);
    if (ok && voiceResult) {
      const l = voiceResult.toLowerCase();
      if (l.includes("bill")||l.includes("electricity")) window.location.href="/tasks";
      else if (l.includes("call")||l.includes("daughter")) window.location.href="/help";
      else if (l.includes("bank")||l.includes("balance"))  window.location.href="/playbook";
      else if (l.includes("medicine")||l.includes("tablet"))window.location.href="/health";
      else if (l.includes("guardian")||l.includes("help")) window.location.href="/help";
      else if (l.includes("practice")||l.includes("learn"))window.location.href="/playbook";
      else speak("I didn't understand. Please try again.");
    } else {
      setVoiceResult(null);
      speak("No problem. Tap the microphone and try again.");
    }
  };

  if (scamState === "lock")
    return <CognitiveLock scamAnalysis={SCAM_ANALYSIS}
      onAnswer={ans => { setCogAnswer(ans); setScamState("response"); }} />;
  if (scamState === "response" && cogAnswer)
    return <ScamResponse cognitiveAnswer={cogAnswer} scamAnalysis={SCAM_ANALYSIS}
      onGoHome={() => { setScamState("none"); setCogAnswer(null); }}
      onContactGuardian={() => window.location.href="/help"} />;

  return (
    <>
      {/* ── Floating Pill Nav (exact from homepage.html) ── */}
      <nav aria-label="Primary navigation"
        className="hidden md:flex"
        style={{
          position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
          zIndex:50, gap:24, padding:"14px 28px",
          borderRadius:9999, background:"rgba(255,253,245,0.85)",
          backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
          boxShadow:"0 4px 24px -4px rgba(180,140,80,0.22)",
          border:"1.5px solid rgba(255,255,255,0.7)",
          animation:"fadeUp 0.8s ease-out both",
        }}>
        {[[t("nav_home"),"/"],[t("nav_tasks"),"/tasks"],[t("nav_practice"),"/playbook"],[t("nav_guardian"),"/guardian"],[t("nav_help"),"/help"]].map(([label,href])=>(
          <a key={label} href={href}
            style={{ color:"#1A1A1A", fontWeight:700, fontSize:16, textDecoration:"none", transition:"color 0.2s", whiteSpace:"nowrap" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#1A56DB")}
            onMouseLeave={e=>(e.currentTarget.style.color="#1A1A1A")}>
            {label}
          </a>
        ))}
      </nav>

      {/* ── HERO (exact layout from homepage.html) ── */}
      <header style={{
        position:"relative", minHeight:"100vh",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        textAlign:"center", padding:"40px 20px 40px", overflow:"hidden",
        background:"linear-gradient(160deg, #FFFDF5 0%, #FEF3C7 55%, #FFF8F0 100%)",
      }}>
        {/* Floating ambient elements */}
        {[
          {e:"☁️",s:{top:"12%",left:"18%",fontSize:48,opacity:0.6,animation:"float 8s ease-in-out infinite"}},
          {e:"☁️",s:{top:"18%",right:"22%",fontSize:48,opacity:0.6,animation:"float 10s ease-in-out infinite reverse"}},
          {e:"🌻",s:{bottom:"14%",left:"8%",fontSize:32,opacity:0.5,animation:"float 7s ease-in-out infinite"}},
          {e:"🦋",s:{bottom:"20%",right:"10%",fontSize:32,opacity:0.5,animation:"float 9s ease-in-out infinite reverse"}},
        ].map((el,i)=>(
          <span key={i} aria-hidden style={{ position:"absolute", ...el.s as any }}>{el.e}</span>
        ))}

        {/* Grandma — left */}
        <div className="hidden md:flex"
          style={{ position:"absolute", bottom:0, left:16, zIndex:10, flexDirection:"column", alignItems:"center", pointerEvents:"none", userSelect:"none" }}>
          <div style={{
            marginBottom:-14, padding:"10px 20px", borderRadius:16, fontWeight:700, fontSize:16,
            background:"#FDE68A", color:"#78350F", border:"2px solid rgba(255,255,255,0.7)",
            boxShadow:"0 4px 24px -4px rgba(180,140,80,0.22)", transform:"rotate(-4deg)",
            maxWidth:220, textAlign:"center", animation:"float 5s ease-in-out infinite",
          }}>Share a story with Grandma 📖</div>
          <Image src="/grandma.png" alt="Illustrated grandmother" width={280} height={420}
            style={{ width:"26vw", maxWidth:280, minWidth:180, height:"auto", filter:"drop-shadow(0 18px 22px rgba(0,0,0,0.18))" }} />
        </div>

        {/* Grandpa — right */}
        <div className="hidden md:flex"
          style={{ position:"absolute", bottom:0, right:16, zIndex:10, flexDirection:"column", alignItems:"center", pointerEvents:"none", userSelect:"none" }}>
          <div style={{
            marginBottom:-14, padding:"10px 20px", borderRadius:16, fontWeight:700, fontSize:16,
            background:"#1A56DB", color:"#FFFDF5", border:"2px solid rgba(255,255,255,0.7)",
            boxShadow:"0 0 24px 2px rgba(255,160,50,0.35)", transform:"rotate(4deg)",
            maxWidth:240, textAlign:"center", animation:"float 6s ease-in-out infinite reverse",
          }}>Learn something new with Grandpa 🎓</div>
          <Image src="/grandpa.png" alt="Illustrated grandfather" width={280} height={420}
            style={{ width:"26vw", maxWidth:280, minWidth:180, height:"auto", filter:"drop-shadow(0 18px 22px rgba(0,0,0,0.18))" }} />
        </div>

        {/* Center copy */}
        <div style={{ position:"relative", zIndex:20, maxWidth:640, margin:"0 auto" }}>
          <h1 style={{ fontSize:"clamp(38px,5.5vw,62px)", fontWeight:800, color:"#1A1A1A", marginBottom:12, lineHeight:1.2, animation:"fadeUp 0.9s ease-out both" }}>
            {lang === "kn" ? "" : "Welcome to "}
            <span style={{ color:"#1A56DB" }}>ElderBridge</span>
            {lang === "kn" ? " ಗೆ ಸ್ವಾಗತ" : ""}
          </h1>
          <p style={{ fontSize:"clamp(20px,2.5vw,28px)", color:"#767676", marginBottom:40, fontWeight:600, animation:"fadeUp 0.9s 0.15s ease-out both" }}>
            {t("hero_sub")}
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:20, animation:"fadeUp 0.9s 0.3s ease-out both" }}>
            <a href="#daily"
              style={{ padding:"16px 40px", borderRadius:9999, background:"#1A56DB", color:"#FFFDF5", fontWeight:700, fontSize:"clamp(18px,2vw,22px)", textDecoration:"none", boxShadow:"0 0 24px 2px rgba(255,160,50,0.35)", transition:"transform 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.05)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
              {t("cta_start")}
            </a>
            <a href="/help"
              style={{ padding:"16px 40px", borderRadius:9999, background:"#FFFDF5", color:"#1A1A1A", fontWeight:700, fontSize:"clamp(18px,2vw,22px)", textDecoration:"none", border:"2px solid #FDE68A", boxShadow:"0 4px 24px -4px rgba(180,140,80,0.22)", transition:"transform 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.05)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
              {t("cta_talk")}
            </a>
          </div>
        </div>



        {/* Scroll hint */}
        <motion.div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", color:"#767676", fontSize:14, fontWeight:600 }}
          animate={{ y:[0,8,0] }} transition={{ duration:1.8, repeat:Infinity }}>
          {t("scroll_hint")}
        </motion.div>
      </header>

      {/* ══════════════════════════════════════════
          THREE CARDS — Reminders / Tasks / Learn
          (replaces Community/Wellness/Support)
      ══════════════════════════════════════════ */}
      <section id="services" style={{ padding:"80px 20px", display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap", background:"linear-gradient(180deg,#FFF8F0 0%,#FFFDF5 100%)" }}>
        {[
          {
            icon:"🔔", title:"Today's Reminders", href:"/tasks",
            text:"Your medicine and bill reminders — never miss an important one.",
            bg:"rgba(255,253,245,0.7)", titleColor:"#8B4000", border:"#FDE68A",
          },
          {
            icon:"✅", title:"My Tasks", href:"/tasks",
            text:"Quick tasks you need to complete today — tap any to get started.",
            bg:"rgba(255,253,245,0.7)", titleColor:"#1A56DB", border:"#93C5FD",
          },
          {
            icon:"📚", title:"Learn Something New", href:"/playbook",
            text:"Step-by-step guides to safely practice paying bills, banking and more.",
            bg:"rgba(255,253,245,0.7)", titleColor:"#1A7340", border:"#6EE7B7",
          },
        ].map(c=>(
          <motion.a key={c.title} href={c.href}
            style={{ background:c.bg, backdropFilter:"blur(8px)", padding:40, borderRadius:32, width:"100%", maxWidth:360, textAlign:"center", boxShadow:"0 4px 24px -4px rgba(180,140,80,0.22)", border:`1px solid ${c.border}`, textDecoration:"none", display:"block" }}
            whileHover={{ y:-8 }} transition={{ duration:0.25 }}
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div style={{ fontSize:56, marginBottom:16 }} aria-hidden>{c.icon}</div>
            <h3 style={{ fontSize:28, fontWeight:700, color:c.titleColor, marginBottom:12 }}>{c.title}</h3>
            <p style={{ fontSize:18, lineHeight:1.7, color:"#444444", maxWidth:"none" }}>{c.text}</p>
          </motion.a>
        ))}
      </section>

      {/* ══════════════════════════════════════════
          DAILY ASSISTANT SECTION
      ══════════════════════════════════════════ */}
      <main id="daily" style={{ background:"#FFFDF5", paddingBottom:120 }}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"48px 24px 0" }}>

          {/* Greeting */}
          <motion.header style={{ marginBottom:32 }} initial={{ opacity:0, y:-16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 style={{ fontSize:"clamp(32px,4vw,42px)", fontWeight:700, color:"#1A1A1A", marginBottom:4 }}>
              {getGreeting(t)}, {DEMO_USER.name} 🌅
            </h2>
            <p style={{ fontSize:22, fontWeight:600, color:"#767676" }}>{getDate(lang)}</p>
          </motion.header>

          {/* Voice mic (Section 6) */}
          <motion.section aria-label="Voice control" style={{ marginBottom:32 }}
            initial={{ opacity:0, scale:0.94 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
            <MicrophoneButton status={status} onStart={startListening} onStop={stopListening} transcript={transcript} />
            <p style={{ textAlign:"center", fontSize:22, fontWeight:600, color:"#767676", marginTop:16 }}>
              {t("mic_idle")}
            </p>
          </motion.section>

          {/* Reminders */}
          <motion.section aria-labelledby="rem-h" style={{ marginBottom:32 }}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 id="rem-h" style={{ fontSize:30, fontWeight:700, color:"#1A1A1A", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
              <Bell size={28} color="#8B4000" aria-hidden /> Today&apos;s Reminders
            </h2>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {REMINDERS.map(r=>(
                <div key={r.id}
                  style={{ display:"flex", alignItems:"center", gap:20, padding:24, borderRadius:20, background:r.bg, borderLeft:`5px solid ${r.color}`, boxShadow:"0 2px 12px rgba(42,36,26,0.1)" }}>
                  <span style={{ fontSize:40 }}>{r.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:22, fontWeight:700, color:"#1A1A1A", marginBottom:2 }}>{r.title}</p>
                    <p style={{ fontSize:17, fontWeight:600, color:"#444" }}>{r.detail}</p>
                  </div>
                  <span style={{ fontSize:14, fontWeight:700, color:r.color, padding:"4px 12px", background:`${r.color}18`, borderRadius:999 }}>{r.time}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Tasks */}
          <motion.section aria-labelledby="tasks-h" style={{ marginBottom:32 }}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 id="tasks-h" style={{ fontSize:30, fontWeight:700, color:"#1A1A1A", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
              <CheckCircle2 size={28} color="#1A56DB" aria-hidden /> Quick Tasks
            </h2>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {TASKS.map(t=>(
                <a key={t.id} href={t.href}
                  style={{ display:"flex", alignItems:"center", gap:20, padding:24, borderRadius:20, background:t.bg, borderLeft:`5px solid ${t.color}`, boxShadow:"0 2px 12px rgba(42,36,26,0.1)", textDecoration:"none" }}>
                  <span style={{ fontSize:40 }}>{t.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:22, fontWeight:700, color:"#1A1A1A", marginBottom:2 }}>{t.title}</p>
                    <p style={{ fontSize:17, fontWeight:600, color:"#444" }}>{t.detail}</p>
                  </div>
                  <span style={{ fontSize:26, color:t.color }}>›</span>
                </a>
              ))}
            </div>
          </motion.section>

          {/* Learn Something New (Sec 7+8) */}
          <motion.section style={{ marginBottom:32 }}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 style={{ fontSize:30, fontWeight:700, color:"#1A1A1A", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
              <BookOpen size={28} color="#1A7340" aria-hidden /> Learn Something New
            </h2>
            <a href="/playbook"
              style={{ display:"flex", alignItems:"center", gap:20, padding:28, borderRadius:20, background:"linear-gradient(135deg,#EDFBF2,#EBF2FF)", borderLeft:"5px solid #1A7340", boxShadow:"0 4px 24px -4px rgba(180,140,80,0.18)", textDecoration:"none" }}>
              <span style={{ fontSize:52 }}>🎓</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:24, fontWeight:700, color:"#1A1A1A", marginBottom:4 }}>Step-by-Step Guided Practice</p>
                <p style={{ fontSize:18, fontWeight:600, color:"#444" }}>Pay bills, check bank balance, order medicines — practise safely first</p>
              </div>
              <span style={{ fontSize:28, color:"#1A7340" }}>›</span>
            </a>
          </motion.section>

          {/* Scam demo + Guardian quick links */}
          <motion.div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:32 }}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <button onClick={() => setScamState("lock")}
              style={{ padding:24, borderRadius:20, background:"#FFF0F0", border:"2px solid #CC0000", textAlign:"center", cursor:"pointer", fontFamily:"inherit", minHeight:"auto" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>🛡️</div>
              <p style={{ fontSize:20, fontWeight:700, color:"#CC0000", marginBottom:4 }}>Scam Demo</p>
              <p style={{ fontSize:15, color:"#444", fontWeight:600 }}>See how I protect you</p>
            </button>
            <a href="/guardian"
              style={{ padding:24, borderRadius:20, background:"#EEF2FF", border:"2px solid #555577", textAlign:"center", textDecoration:"none", display:"block" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>👨‍👩‍👧</div>
              <p style={{ fontSize:20, fontWeight:700, color:"#555577", marginBottom:4 }}>Guardian</p>
              <p style={{ fontSize:15, color:"#444", fontWeight:600 }}>Family dashboard</p>
            </a>
          </motion.div>

        </div>
      </main>



      {/* Voice confirm */}
      <AnimatePresence>
        {showConfirm && voiceResult && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}>
            <VoiceConfirmDialog heardText={voiceResult}
              onConfirm={() => handleConfirm(true)}
              onRetry={() => handleConfirm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* A+ accessibility FAB (from homepage.html) */}
      <button onClick={() => setLargeText(p=>!p)}
        aria-label="Increase text size"
        style={{
          position:"fixed", bottom:120, right:20, width:56, height:56, borderRadius:"50%",
          background: largeText ? "#1A56DB" : "#FDE68A", color: largeText ? "#FFFDF5" : "#78350F",
          fontWeight:800, fontSize:18, cursor:"pointer", border:"none",
          boxShadow:"0 4px 20px -2px rgba(255,107,0,0.40)", zIndex:50, fontFamily:"inherit",
          transition:"all 0.2s", minHeight:"auto", minWidth:"auto", padding:0,
        }}>A+</button>

      <style>{`
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}
