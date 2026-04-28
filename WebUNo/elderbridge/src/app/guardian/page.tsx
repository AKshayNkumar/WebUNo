"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Activity, TrendingUp, AlertTriangle, Video, ClipboardList, Phone, Settings } from "lucide-react";

interface SeniorStats {
  seniorName:       string;
  weeklyActivity:   number;
  confidenceScore:  number;
  scamsBlocked:     number;
  helpRequests:     number;
}

interface Alert {
  id:        string;
  type:      string;
  message:   string;
  severity:  "info" | "warning" | "critical";
  time:      string;
  dismissed: boolean;
}

const DEMO_STATS: SeniorStats = {
  seniorName:      "Kamala",
  weeklyActivity:  5,
  confidenceScore: 72,
  scamsBlocked:    3,
  helpRequests:    2,
};

const DEMO_ALERTS: Alert[] = [
  {
    id: "a1", type: "scam_attempt",
    message: "Scam attempt blocked! A suspicious link was opened.",
    severity: "critical", time: "10 mins ago", dismissed: false,
  },
];

const DEMO_ACTIVITY = [
  { icon: "💊", text: "Marked Metformin 500mg as taken",        time: "8:45 AM",  color: "#1A7340" },
  { icon: "🛡️", text: "Scam website blocked automatically",     time: "9:12 AM",  color: "#CC0000" },
  { icon: "📋", text: "Completed: Pay Electricity Bill task",   time: "11:30 AM", color: "#1A56DB" },
  { icon: "🎮", text: "Practiced: Check Bank Balance (score 80)", time: "2:00 PM", color: "#8B4000" },
  { icon: "📞", text: "Called daughter via ElderBridge",        time: "4:15 PM",  color: "#555577" },
];

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function GuardianDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const stats = DEMO_STATS;

  const dismissAlert = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a)));

  const criticalAlerts = alerts.filter((a) => !a.dismissed && a.severity === "critical");

  return (
    <div className="min-h-screen bg-[#F5F0E8] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-md p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-[36px] font-bold text-[#1A1A1A] mb-1">
              {stats.seniorName}&apos;s Digital Journey
            </h1>
            <p className="text-[20px] text-[#444444] font-semibold">
              Guardian Dashboard — You&apos;re helping them stay safe online
            </p>
          </div>
          <a
            href="/guardian/live-help"
            className="flex items-center gap-3 px-8 py-4 bg-[#1A56DB] hover:bg-[#1446B8]
                       text-white rounded-xl text-[20px] font-bold transition-all shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
          >
            <Video size={24} />
            Join Their Screen Now
          </a>
        </motion.div>

        {/* Critical Alert Banner */}
        {criticalAlerts.length > 0 && (
          <motion.div
            className="bg-[#FEE2E2] border-l-8 border-[#CC0000] rounded-xl p-6 mb-6"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          >
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4">
                <AlertTriangle size={32} color="#CC0000" className="flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-[22px] font-bold text-[#CC0000] mb-1">
                    🚨 Scam Attempt Blocked Just Now
                  </h3>
                  <p className="text-[18px] text-[#7f0000] mb-4">{alert.message}</p>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-[#CC0000] hover:bg-[#aa0000] text-white
                                       rounded-lg font-bold text-[18px] transition-all
                                       focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                      📞 Call Them Now
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="px-6 py-3 bg-white border-2 border-[#CC0000] text-[#CC0000]
                                 hover:bg-[#FEE2E2] rounded-lg font-bold text-[18px] transition-all
                                 focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6"
          variants={stagger} initial="hidden" animate="show"
        >
          {[
            { icon: <Activity size={36} color="#1A56DB" />, label: "Active This Week",  value: `${stats.weeklyActivity} days`,         trend: "+2 from last week",  pos: true },
            { icon: <TrendingUp size={36} color="#1A7340" />, label: "Confidence Score", value: `${stats.confidenceScore}/100`,          trend: "Growing steadily",   pos: true },
            { icon: <Shield size={36} color="#8B4000" />, label: "Scams Blocked",        value: `${stats.scamsBlocked}`,                 trend: "All time",           pos: true },
            { icon: <Video size={36} color="#555577" />, label: "Help Requests",         value: `${stats.helpRequests}`,                 trend: "This month",         pos: false },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white rounded-xl shadow p-6">
              <div className="w-14 h-14 bg-[#F5F0E8] rounded-xl flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <p className="text-[16px] text-[#444444] font-semibold mb-1">{s.label}</p>
              <p className="text-[32px] font-bold text-[#1A1A1A] mb-1">{s.value}</p>
              <p className={`text-[14px] font-semibold ${s.pos ? "text-[#1A7340]" : "text-[#444444]"}`}>{s.trend}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            className="md:col-span-2 bg-white rounded-2xl shadow-md p-8"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <h2 className="text-[26px] font-bold text-[#1A1A1A] mb-6">Recent Activity</h2>
            <div className="space-y-5">
              {DEMO_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-xl bg-[#F5F0E8]">
                  <span className="text-[32px]">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-[18px] font-bold text-[#1A1A1A]">{a.text}</p>
                    <p className="text-[14px] text-[#444444] font-semibold">{a.time}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: a.color }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-2xl shadow-md p-8"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <h2 className="text-[26px] font-bold text-[#1A1A1A] mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { icon: <Phone size={28} color="#1A56DB" />,       label: "Video Call Them",      href: "/guardian/live-help" },
                { icon: <ClipboardList size={28} color="#1A7340" />, label: "View Full Report",   href: "#" },
                { icon: <Settings size={28} color="#555577" />,     label: "Adjust Settings",     href: "#" },
              ].map((q, i) => (
                <a key={i} href={q.href}
                  className="flex items-center gap-4 p-5 rounded-xl bg-[#F5F0E8] hover:bg-[#EDE8E0]
                             transition-all duration-200 border border-[#D0C8B8]
                             focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                >
                  {q.icon}
                  <span className="text-[20px] font-bold text-[#1A1A1A]">{q.label}</span>
                </a>
              ))}
            </div>

            {/* Confidence summary */}
            <div className="mt-8 bg-gradient-to-br from-[#EBF2FF] to-[#DBEAFE] rounded-xl p-6">
              <p className="text-[18px] font-bold text-[#1A1A1A] mb-3">This Week&apos;s Summary</p>
              <div className="w-full h-4 bg-white rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#1A56DB] to-[#3B82F6]"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.confidenceScore}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              <p className="text-[16px] text-[#444444] font-semibold">
                Confidence: {stats.confidenceScore}/100 — Growing steadily 📈
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
