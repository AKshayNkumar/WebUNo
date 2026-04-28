"use client";

import React, { useState } from "react";
import { ClipboardList, CheckCircle2, Clock, Landmark, Phone, Zap } from "lucide-react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { clsx } from "clsx";

const allTasks = [
  { id: "t1", title: "Pay Electricity Bill", detail: "₹1,240 — due today", accent: "#CC0000", bg: "#FFF0F0", done: false, icon: Zap },
  { id: "t2", title: "Call Doctor Sharma",   detail: "Follow-up appointment", accent: "#8B4000", bg: "#FFF8F0", done: false, icon: Phone },
  { id: "t3", title: "Check Bank Balance",   detail: "SBI Savings Account",   accent: "#1A56DB", bg: "#EBF2FF", done: false, icon: Landmark },
  { id: "t4", title: "Buy Medicines",        detail: "From Apollo Pharmacy",   accent: "#1A7340", bg: "#EDFBF2", done: true,  icon: ClipboardList },
];

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

          <header className="mb-8 animate-fade-in">
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
              📋 My Tasks
            </h1>
            <p className="text-[26px] font-semibold text-[#444444]">
              {pending.length} task{pending.length !== 1 ? "s" : ""} remaining
            </p>
          </header>

          {/* Pending */}
          {pending.length > 0 && (
            <section className="mb-8" aria-labelledby="pending-heading">
              <h2 id="pending-heading" className="text-[28px] font-bold text-[#1A1A1A] mb-4">To Do</h2>
              <div className="flex flex-col gap-5">
                {pending.map((task) => {
                  const Icon = task.icon;
                  return (
                    <button
                      key={task.id}
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
                      <div className="h-10 w-10 rounded-full border-3 border-[#D0C8B8] flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section aria-labelledby="completed-heading">
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
            </section>
          )}

        </div>
      </main>
      <BottomNavigation currentPage="tasks" />
    </>
  );
}
