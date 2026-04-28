"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const MOCK_DIGEST = {
  seniorName: "Kamala",
  guardianName: "Priya",
  weekStart: "Apr 21",
  weekEnd: "Apr 27",
  highlights: {
    biggestAchievement: "Paid her electricity bill completely on her own for the first time! 🌟",
    confidenceScore: 72,
    confidenceChange: +8,
    newSkillsLearned: [
      "Paying bills online",
      "Checking bank balance",
      "Recognising a scam website",
    ],
    funnyMoment:
      "She typed her password three times correctly but kept looking for the 'OK' button — then tapped Enter by accident and it worked! 😄",
  },
  activities: [
    { date: "Mon, Apr 21", action: "Marked Metformin 500mg as taken",       success: true,  timeSpent: 60  },
    { date: "Tue, Apr 22", action: "Scam website blocked automatically",      success: true,  timeSpent: 0   },
    { date: "Wed, Apr 23", action: "Completed: Pay Electricity Bill task",    success: true,  timeSpent: 600 },
    { date: "Thu, Apr 24", action: "Practiced: Check Bank Balance (score 80)", success: true, timeSpent: 300 },
    { date: "Fri, Apr 25", action: "Called daughter via ElderBridge",          success: true,  timeSpent: 900 },
  ],
  scamsBlocked: 3,
  helpRequests: 2,
  nextGoals: [
    "Complete a task independently without help",
    "Recognise and report one scam attempt",
  ],
  actionItems: [
    "Talk to Kamala about the 3 scam attempts we blocked this week",
    "Celebrate her growing confidence! Maybe try teaching her something new?",
  ],
};

export default function DigestPage() {
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const d = MOCK_DIGEST;

  const handleSendDigest = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      <main className="min-h-screen bg-[#F3F4F6] pb-24">
        <div className="max-w-2xl mx-auto px-4 pt-8">

          {/* Page header */}
          <motion.div className="mb-6" initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-[36px] font-bold text-[#1A1A1A] mb-2">📧 Weekly Digest Preview</h1>
            <p className="text-[18px] font-semibold text-[#444]">
              This is the email sent every Sunday to {d.guardianName}
            </p>
            <button
              onClick={handleSendDigest}
              disabled={sending || sent}
              className="mt-4 px-6 py-3 rounded-xl font-bold text-[18px] text-white transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              style={{ background: sent ? "#1A7340" : "#1A56DB", opacity: sending ? 0.7 : 1 }}
            >
              {sent ? "✅ Digest Sent!" : sending ? "Sending…" : "📤 Send Digest Now (Demo)"}
            </button>
          </motion.div>

          {/* Email card */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          >
            {/* Email header */}
            <div className="px-8 py-8 text-center"
              style={{ background: "linear-gradient(135deg, #DBEAFE 0%, #EEF2FF 100%)" }}>
              <div className="text-[56px] mb-3">🌉</div>
              <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-1">{d.seniorName}&apos;s Digital Week</h2>
              <p className="text-[16px] text-[#666]">{d.weekStart} – {d.weekEnd}</p>
            </div>

            <div className="px-8 py-6">

              {/* Greeting */}
              <p className="text-[20px] font-semibold text-[#1A1A1A] mb-2">Dear {d.guardianName},</p>
              <p className="text-[16px] text-[#444] leading-relaxed mb-6">
                What a wonderful week! {d.seniorName} has been actively learning and growing more
                confident online. Here&apos;s everything that happened this week.
              </p>

              {/* Highlight */}
              <div className="text-center p-6 rounded-2xl mb-6"
                style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)" }}>
                <div className="text-[40px] mb-2">🌟</div>
                <p className="text-[18px] font-bold text-[#92400E] mb-1">Highlight of the Week</p>
                <p className="text-[16px] font-semibold text-[#78350F]">{d.highlights.biggestAchievement}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { emoji:"📈", value:`${d.highlights.confidenceScore}/100`, label:"Confidence Score",
                    sub: `${d.highlights.confidenceChange > 0 ? "+" : ""}${d.highlights.confidenceChange} from last week`, pos: d.highlights.confidenceChange > 0 },
                  { emoji:"🛡️", value: String(d.scamsBlocked), label:"Scams Blocked",
                    sub:`Kept ${d.seniorName} safe`, pos: true },
                  { emoji:"🎯", value: String(d.activities.filter(a=>a.success).length), label:"Tasks Completed",
                    sub:"This week", pos: true },
                  { emoji:"📞", value: String(d.helpRequests), label:"Help Requests",
                    sub:"This month", pos: false },
                ].map((s, i) => (
                  <div key={i} className="text-center p-5 bg-[#F9FAFB] rounded-xl">
                    <div className="text-[32px] mb-1">{s.emoji}</div>
                    <p className="text-[28px] font-bold text-[#1A1A1A]">{s.value}</p>
                    <p className="text-[13px] text-[#666] font-semibold mb-1">{s.label}</p>
                    <p className={`text-[12px] font-bold ${s.pos ? "text-[#1A7340]" : "text-[#444]"}`}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* New Skills */}
              <div className="mb-6">
                <p className="text-[18px] font-bold text-[#1A1A1A] mb-3">🌿 What {d.seniorName} Learned This Week</p>
                {d.highlights.newSkillsLearned.map((s, i) => (
                  <p key={i} className="text-[15px] text-[#444] mb-1 font-semibold">✓ {s}</p>
                ))}
              </div>

              {/* Funny moment */}
              <div className="p-5 rounded-xl mb-6"
                style={{ backgroundColor: "#EEF2FF", borderLeft: "4px solid #1A56DB" }}>
                <div className="text-[28px] mb-2">😊</div>
                <p className="text-[15px] text-[#1e40af] italic font-semibold leading-relaxed">
                  {d.highlights.funnyMoment}
                </p>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <p className="text-[18px] font-bold text-[#1A1A1A] mb-3">📋 This Week&apos;s Activities</p>
                <div className="flex flex-col gap-2">
                  {d.activities.map((a, i) => (
                    <div key={i} className="p-4 bg-[#F9FAFB] rounded-xl">
                      <p className="text-[12px] text-[#999] font-semibold mb-1">{a.date}</p>
                      <p className="text-[15px] font-bold text-[#1A1A1A]">
                        {a.success ? "✅" : "🔄"} {a.action}
                      </p>
                      {a.timeSpent > 0 && (
                        <p className="text-[13px] text-[#666]">{Math.round(a.timeSpent/60)} minutes</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Goals */}
              <div className="mb-6">
                <p className="text-[18px] font-bold text-[#1A1A1A] mb-3">🎯 Working Toward</p>
                {d.nextGoals.map((g, i) => (
                  <p key={i} className="text-[15px] text-[#444] font-semibold mb-1">→ {g}</p>
                ))}
              </div>

              {/* Action items */}
              <div className="p-6 rounded-xl mb-6" style={{ backgroundColor: "#DBEAFE" }}>
                <p className="text-[17px] font-bold text-[#1A56DB] mb-3">👉 You Can Help By:</p>
                {d.actionItems.map((a, i) => (
                  <p key={i} className="text-[15px] text-[#1e40af] font-semibold mb-2">{i+1}. {a}</p>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-[#E5E7EB] pt-6 text-center">
                <p className="text-[14px] text-[#666] leading-relaxed mb-3">
                  Keep encouraging {d.seniorName}! Every small step builds their digital confidence. 💪
                </p>
                <p className="text-[14px] text-[#666]">
                  With care,<br />
                  <strong>The ElderBridge Team</strong>
                </p>
                <div className="flex justify-center gap-6 mt-4">
                  <a href="/guardian" className="text-[14px] text-[#1A56DB] font-semibold">
                    View Full Dashboard →
                  </a>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </main>
      <BottomNavigation currentPage="home" />
    </>
  );
}
