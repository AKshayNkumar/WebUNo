"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Activity, TrendingUp, AlertTriangle, Video,
  ClipboardList, Phone, Settings, Mail, Globe
} from "lucide-react";

interface ConfidenceData {
  score: number;
  levelName: string;
  breakdown: {
    independentTasks: number;
    totalTasks: number;
    successRate: number;
    scamBlocksCount: number;
    uniqueSkills: number;
    consistency: number;
  };
}

interface Alert {
  id: string; type: string; message: string;
  severity: "info" | "warning" | "critical"; time: string; dismissed: boolean;
}

const DEMO_ALERTS: Alert[] = [
  { id: "a1", type: "scam_attempt",
    message: "Scam attempt blocked! A suspicious link was opened.",
    severity: "critical", time: "10 mins ago", dismissed: false },
];

const DEMO_ACTIVITY = [
  { icon: "💊", text: "Marked Metformin 500mg as taken",          time: "8:45 AM",  color: "#1A7340" },
  { icon: "🛡️", text: "Scam website blocked automatically",       time: "9:12 AM",  color: "#CC0000" },
  { icon: "📋", text: "Completed: Pay Electricity Bill task",      time: "11:30 AM", color: "#1A56DB" },
  { icon: "🎮", text: "Practiced: Check Bank Balance (score 80)",  time: "2:00 PM",  color: "#8B4000" },
  { icon: "📞", text: "Called daughter via ElderBridge",           time: "4:15 PM",  color: "#555577" },
];

const LEVEL_LABELS: Record<string, string> = {
  just_starting:      "🌱 Just Starting",
  getting_comfortable:"🌿 Getting Comfortable",
  growing_confident:  "🌳 Growing Confident",
  quite_independent:  "⭐ Quite Independent",
  digital_champion:   "🏆 Digital Champion",
};

const fadeUp = { hidden: { opacity:0, y:16 }, show: { opacity:1, y:0, transition: { ease:"easeOut", duration:0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function GuardianDashboard() {
  const [alerts,     setAlerts]     = useState<Alert[]>(DEMO_ALERTS);
  const [confidence, setConfidence] = useState<ConfidenceData | null>(null);
  const [scamUrl,    setScamUrl]    = useState("");
  const [scamResult, setScamResult] = useState<any>(null);
  const [checking,   setChecking]   = useState(false);
  const [digestSent, setDigestSent] = useState(false);

  // Fetch live confidence score
  useEffect(() => {
    fetch("/api/confidence/calculate")
      .then(r => r.json())
      .then(setConfidence)
      .catch(() => setConfidence({ score: 72, levelName: "growing_confident",
        breakdown: { independentTasks: 3, totalTasks: 5, successRate: 0.6, scamBlocksCount: 3, uniqueSkills: 4, consistency: 0.7 } }));
  }, []);

  const dismissAlert = (id: string) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));

  const criticalAlerts = alerts.filter(a => !a.dismissed && a.severity === "critical");

  const checkScamUrl = async () => {
    if (!scamUrl.trim()) return;
    setChecking(true); setScamResult(null);
    try {
      const res  = await fetch("/api/scam/check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scamUrl, userId: "guardian-demo" }),
      });
      setScamResult(await res.json());
    } catch { setScamResult({ threatLevel: "warning", userMessage: "Could not check URL." }); }
    setChecking(false);
  };

  const sendDigest = async () => {
    await fetch("/api/cron/weekly-digest", { method: "POST" });
    setDigestSent(true);
    setTimeout(() => setDigestSent(false), 3000);
  };

  const score = confidence?.score ?? 72;

  return (
    <div className="min-h-screen bg-[#F5F0E8] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
        >
          <div>
            <h1 className="text-[32px] md:text-[36px] font-bold text-[#1A1A1A] mb-1">
              Kamala&apos;s Digital Journey
            </h1>
            <p className="text-[18px] md:text-[20px] text-[#444444] font-semibold">
              Guardian Dashboard — You&apos;re helping them stay safe online
            </p>
          </div>
          <a href="/guardian/live-help"
            className="flex items-center gap-3 px-6 py-4 bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-xl text-[18px] font-bold transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
            <Video size={22} /> Join Their Screen Now
          </a>
        </motion.div>

        {/* ── Critical Alert Banner ── */}
        {criticalAlerts.length > 0 && (
          <motion.div
            className="bg-[#FEE2E2] border-l-8 border-[#CC0000] rounded-xl p-6 mb-6"
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
          >
            {criticalAlerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-4">
                <AlertTriangle size={32} color="#CC0000" className="flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-[20px] font-bold text-[#CC0000] mb-1">🚨 Scam Attempt Blocked Just Now</h3>
                  <p className="text-[16px] text-[#7f0000] mb-4">{alert.message}</p>
                  <div className="flex gap-3 flex-wrap">
                    <button className="px-5 py-2 bg-[#CC0000] hover:bg-[#aa0000] text-white rounded-lg font-bold text-[16px] transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                      📞 Call Them Now
                    </button>
                    <button onClick={() => dismissAlert(alert.id)}
                      className="px-5 py-2 bg-white border-2 border-[#CC0000] text-[#CC0000] hover:bg-[#FEE2E2] rounded-lg font-bold text-[16px] transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Stats Grid (with live confidence) ── */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={stagger} initial="hidden" animate="show">
          {[
            { icon: <Activity size={32} color="#1A56DB" />, label: "Active This Week",  value: "5 days",   trend: "+2 from last week", pos: true },
            { icon: <TrendingUp size={32} color="#1A7340" />, label: "Confidence Score", value: `${score}/100`,
              trend: LEVEL_LABELS[confidence?.levelName ?? "growing_confident"] ?? "Growing steadily", pos: true },
            { icon: <Shield size={32} color="#8B4000" />, label: "Scams Blocked",       value: `${confidence?.breakdown?.scamBlocksCount ?? 3}`, trend: "All time", pos: true },
            { icon: <Video size={32} color="#555577" />, label: "Help Requests",         value: "2",         trend: "This month",        pos: false },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white rounded-xl shadow p-5">
              <div className="w-12 h-12 bg-[#F5F0E8] rounded-xl flex items-center justify-center mb-3">{s.icon}</div>
              <p className="text-[15px] text-[#444444] font-semibold mb-1">{s.label}</p>
              <p className="text-[28px] font-bold text-[#1A1A1A] mb-1">{s.value}</p>
              <p className={`text-[13px] font-bold ${s.pos ? "text-[#1A7340]" : "text-[#444444]"}`}>{s.trend}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Confidence Progress Bar ── */}
        {confidence && (
          <motion.div className="bg-white rounded-2xl shadow-md p-6 mb-6"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
            <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-4">
              📈 Confidence Score — Live from API
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[32px] font-bold text-[#1A56DB]">{confidence.score}/100</span>
              <span className="text-[18px] font-semibold text-[#444]">{LEVEL_LABELS[confidence.levelName]}</span>
            </div>
            <div className="w-full h-5 bg-[#F5F0E8] rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #1A56DB, #3B82F6)" }}
                initial={{ width: 0 }}
                animate={{ width: `${confidence.score}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Independent Tasks", value: `${confidence.breakdown.independentTasks}/${confidence.breakdown.totalTasks}` },
                { label: "Skills Learned",    value: String(confidence.breakdown.uniqueSkills) },
                { label: "Consistency",       value: `${Math.round(confidence.breakdown.consistency * 100)}%` },
              ].map((b, i) => (
                <div key={i} className="bg-[#F5F0E8] rounded-xl p-3">
                  <p className="text-[20px] font-bold text-[#1A1A1A]">{b.value}</p>
                  <p className="text-[13px] text-[#444] font-semibold">{b.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Main 2-col grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Activity feed */}
          <motion.div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
            <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-5">Recent Activity</h2>
            <div className="space-y-3">
              {DEMO_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F0E8]">
                  <span className="text-[28px]">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-[16px] font-bold text-[#1A1A1A]">{a.text}</p>
                    <p className="text-[13px] text-[#444444] font-semibold">{a.time}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: a.color }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="bg-white rounded-2xl shadow-md p-6"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
            <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-5">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { icon: <Phone size={24} color="#1A56DB" />,        label: "Video Call Them",     href: "/guardian/live-help" },
                { icon: <ClipboardList size={24} color="#1A7340" />, label: "View Playbooks",     href: "/playbook" },
                { icon: <Globe size={24} color="#CC0000" />,         label: "Check a URL Safety", href: "#scam-check" },
                { icon: <Mail size={24} color="#8B4000" />,          label: "Preview Digest",     href: "/digest" },
                { icon: <Settings size={24} color="#555577" />,      label: "Extension Info",     href: "/extension" },
              ].map((q, i) => (
                <a key={i} href={q.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F0E8] hover:bg-[#EDE8E0] transition-all border border-[#D0C8B8] focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                  {q.icon}
                  <span className="text-[17px] font-bold text-[#1A1A1A]">{q.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Section 14: Live Scam URL Checker ── */}
        <motion.div id="scam-check" className="bg-white rounded-2xl shadow-md p-6 mb-6"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
          <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-2">🛡️ Live URL Safety Checker</h2>
          <p className="text-[16px] text-[#444] font-semibold mb-4">Enter any website URL to check if it&apos;s safe for Kamala</p>
          <div className="flex gap-3 mb-4 flex-wrap">
            <input
              type="text"
              placeholder="e.g. www.sbi-alert-login.com or www.google.com"
              value={scamUrl}
              onChange={e => setScamUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkScamUrl()}
              className="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-[#D0C8B8] text-[16px] font-semibold focus:outline-none focus:border-[#1A56DB]"
            />
            <button onClick={checkScamUrl} disabled={checking}
              className="px-6 py-3 bg-[#1A56DB] hover:bg-[#1446B8] text-white rounded-xl font-bold text-[16px] transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00] disabled:opacity-60">
              {checking ? "Checking…" : "Check URL"}
            </button>
          </div>
          {scamResult && (
            <motion.div
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              className="p-5 rounded-xl border-l-4"
              style={{
                backgroundColor: scamResult.shouldBlock ? "#FEE2E2" : scamResult.threatLevel === "warning" ? "#FEF3C7" : "#EDFBF2",
                borderColor: scamResult.shouldBlock ? "#CC0000" : scamResult.threatLevel === "warning" ? "#D97706" : "#1A7340",
              }}
            >
              <p className="text-[18px] font-bold mb-1" style={{
                color: scamResult.shouldBlock ? "#CC0000" : scamResult.threatLevel === "warning" ? "#92400E" : "#1A7340"
              }}>
                {scamResult.shouldBlock ? "🚨 BLOCKED — Dangerous!" : scamResult.threatLevel === "warning" ? "⚠️ Be Careful" : "✅ Safe"}
                {" "}({Math.round((scamResult.confidence ?? 0.8)*100)}% confidence)
              </p>
              <p className="text-[15px] font-semibold text-[#444]">{scamResult.userMessage}</p>
              {scamResult.flags?.length > 0 && (
                <div className="mt-3 space-y-1">
                  {(scamResult.flags as any[]).map((f: any, i: number) => (
                    <p key={i} className="text-[13px] font-semibold text-[#666]">• {f.description}</p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* ── Section 13: Digest CTA ── */}
        <motion.div className="bg-gradient-to-br from-[#EEF2FF] to-[#DBEAFE] rounded-2xl shadow-md p-6"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-1">📧 Weekly Digest</h2>
              <p className="text-[16px] font-semibold text-[#444]">
                Sends every Sunday to Priya with Kamala&apos;s highlights, scam alerts &amp; progress
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href="/digest"
                className="px-5 py-3 bg-white rounded-xl font-bold text-[16px] text-[#1A56DB] border-2 border-[#1A56DB] hover:bg-[#EBF2FF] transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                Preview Email
              </a>
              <button onClick={sendDigest}
                className="px-5 py-3 rounded-xl font-bold text-[16px] text-white transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                style={{ background: digestSent ? "#1A7340" : "#1A56DB" }}>
                {digestSent ? "✅ Sent!" : "Send Now"}
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
