"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Landmark, Phone, Zap, BookOpen } from "lucide-react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const allTasks = [
  { id: "t1", title: "Pay Electricity Bill", detail: "₹1,240 — due today",     accent: "#CC0000", bg: "#FFF0F0", done: false, icon: Zap },
  { id: "t2", title: "Call Doctor Sharma",   detail: "Follow-up appointment",   accent: "#8B4000", bg: "#FFF8F0", done: false, icon: Phone },
  { id: "t3", title: "Check Bank Balance",   detail: "SBI Savings Account",     accent: "#1A56DB", bg: "#EBF2FF", done: false, icon: Landmark },
  { id: "t4", title: "Buy Medicines",        detail: "From Apollo Pharmacy",     accent: "#1A7340", bg: "#EDFBF2", done: true,  icon: ClipboardList },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function TasksPage() {
  const [tasks, setTasks] = useState(allTasks);

  const toggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const pending   = tasks.filter(t => !t.done);
  const completed = tasks.filter(t =>  t.done);

  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          <motion.header
            className="mb-8"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
              📋 My Tasks
            </h1>
            <p className="text-[26px] font-semibold text-[#444444]">
              {pending.length} task{pending.length !== 1 ? "s" : ""} remaining
            </p>
          </motion.header>

          {/* ── STEP-BY-STEP GUIDE (Section 7+8 Playbook/Sandbox) ── */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-[28px] font-bold text-[#1A56DB] mb-4 flex items-center gap-2">
              <BookOpen size={28} /> Need Help With a Task?
            </h2>
            <a
              href="/playbook"
              className="flex items-center gap-5 p-6 rounded-2xl shadow-md border w-full text-left hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              style={{ backgroundColor: "#EBF2FF", borderLeft: "6px solid #1A56DB" }}
            >
              <span className="text-[44px]">🎮</span>
              <div className="flex-1">
                <p className="text-[26px] font-bold text-[#1A1A1A]">Practice First (Safe Mode)</p>
                <p className="text-[19px] font-semibold text-[#444444]">Try paying bills &amp; checking balance without any real money</p>
              </div>
              <span className="text-[28px] text-[#1A56DB]">›</span>
            </a>
          </motion.section>

          {/* ── PENDING TASKS ── */}
          {pending.length > 0 && (
            <motion.section
              className="mb-8"
              aria-labelledby="pending-heading"
              variants={stagger} initial="hidden" animate="show"
            >
              <h2 id="pending-heading" className="text-[28px] font-bold text-[#1A1A1A] mb-4">To Do</h2>
              <div className="flex flex-col gap-5">
                {pending.map((task) => {
                  const Icon = task.icon;
                  return (
                    <motion.button
                      key={task.id}
                      variants={fadeUp}
                      onClick={() => toggle(task.id)}
                      className="flex items-center gap-5 p-6 rounded-2xl shadow-md border border-[#D0C8B8] min-h-[88px] w-full text-left cursor-pointer hover:shadow-lg transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2"
                      style={{ backgroundColor: task.bg, borderLeft: `4px solid ${task.accent}`, paddingLeft: "20px" }}
                      aria-label={`Mark "${task.title}" as done`}
                    >
                      <div className="h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${task.accent}20` }}>
                        <Icon size={32} color={task.accent} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[26px] font-bold text-[#1A1A1A]">{task.title}</p>
                        <p className="text-[22px] font-semibold text-[#444444]">{task.detail}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full border-2 border-[#D0C8B8] flex-shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* ── COMPLETED TASKS ── */}
          {completed.length > 0 && (
            <motion.section
              aria-labelledby="completed-heading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
              <h2 id="completed-heading" className="text-[28px] font-bold text-[#1A7340] mb-4">✓ Completed</h2>
              <div className="flex flex-col gap-4">
                {completed.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggle(task.id)}
                    className="flex items-center gap-5 p-6 rounded-2xl bg-[#EDFBF2] border border-[#1A7340] min-h-[88px] w-full cursor-pointer opacity-80 focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2"
                    aria-label={`Unmark "${task.title}" as done`}
                  >
                    <CheckCircle2 size={36} color="#1A7340" aria-hidden="true" />
                    <div className="flex-1 text-left">
                      <p className="text-[24px] font-bold text-[#1A7340] line-through">{task.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

        </div>
      </main>
      <BottomNavigation currentPage="tasks" />
    </>
  );
}
