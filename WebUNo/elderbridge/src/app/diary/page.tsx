"use client";

import React, { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const initialEntries = [
  { id: "e1", date: "Monday, 28 April 2026", text: "Walked in the park for 20 minutes. Felt good today. Had breakfast with my daughter.", mood: "😊" },
  { id: "e2", date: "Sunday, 27 April 2026", text: "Attended the temple in the morning. Spoke to my son on the phone.", mood: "🙏" },
];

export default function DiaryPage() {
  const [entries, setEntries]   = useState(initialEntries);
  const [writing, setWriting]   = useState(false);
  const [newText, setNewText]   = useState("");
  const [newMood, setNewMood]   = useState("😊");

  const moods = ["😊", "😐", "😢", "🙏", "😴", "💪"];

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const save = () => {
    if (!newText.trim()) return;
    setEntries([{ id: Date.now().toString(), date: today, text: newText.trim(), mood: newMood }, ...entries]);
    setNewText(""); setMood("😊"); setWriting(false);
  };

  const setMood = (m: string) => setNewMood(m);

  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          <header className="mb-8 animate-fade-in">
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">📖 My Diary</h1>
            <p className="text-[26px] font-semibold text-[#444444]">Your personal thoughts and memories</p>
          </header>

          {/* Write new entry */}
          {!writing ? (
            <button
              onClick={() => setWriting(true)}
              className="w-full min-h-[88px] rounded-2xl bg-[#1A56DB] text-[#FFFDF5] text-[28px] font-bold flex items-center justify-center gap-4 shadow-lg hover:bg-[#1446B8] transition-colors duration-100 mb-8 focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2"
              aria-label="Write a new diary entry"
            >
              <Plus size={36} /> Write Today&apos;s Entry
            </button>
          ) : (
            <div className="bg-[#F5F0E8] rounded-2xl p-6 shadow-md border border-[#D0C8B8] mb-8">
              <p className="text-[24px] font-bold text-[#444444] mb-3">{today}</p>

              {/* Mood selector */}
              <div className="flex gap-3 mb-4 flex-wrap">
                {moods.map((m) => (
                  <button key={m} onClick={() => setMood(m)}
                    className={`text-[36px] h-[60px] w-[60px] rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00] ${newMood === m ? "bg-[#EBF2FF] scale-110" : "bg-white"}`}
                    aria-label={`Set mood to ${m}`}>{m}</button>
                ))}
              </div>

              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Write about your day..."
                rows={5}
                className="mb-4 resize-none"
                aria-label="Diary entry text"
              />
              <div className="flex gap-4">
                <button onClick={save}
                  className="flex-1 min-h-[72px] bg-[#1A7340] text-[#FFFDF5] text-[24px] font-bold rounded-xl hover:bg-[#155C33] focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                  Save Entry
                </button>
                <button onClick={() => setWriting(false)}
                  className="flex-1 min-h-[72px] bg-[#EDEDDD] text-[#1A1A1A] text-[24px] font-bold rounded-xl hover:bg-[#D0C8B8] focus:outline-none focus:ring-4 focus:ring-[#FF6B00]">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Past entries */}
          <div className="flex flex-col gap-6">
            {entries.map((entry) => (
              <div key={entry.id}
                className="p-6 rounded-2xl bg-[#F5F0E8] border border-[#D0C8B8] shadow-md"
                style={{ borderLeft: "4px solid #8B4000", paddingLeft: "20px" }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[36px]">{entry.mood}</span>
                  <p className="text-[22px] font-semibold text-[#444444]">{entry.date}</p>
                </div>
                <p className="text-[26px] font-semibold text-[#1A1A1A] leading-relaxed">{entry.text}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
      <BottomNavigation currentPage="diary" />
    </>
  );
}
