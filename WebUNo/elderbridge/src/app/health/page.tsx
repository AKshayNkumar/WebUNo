"use client";

import React from "react";
import { Heart, Pill, Activity, Calendar } from "lucide-react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { clsx } from "clsx";

const medicines = [
  { name: "Metformin 500mg",  dose: "1 tablet",  time: "After Breakfast", color: "#1A7340", bg: "#EDFBF2" },
  { name: "Amlodipine 5mg",   dose: "1 tablet",  time: "After Dinner",    color: "#1A56DB", bg: "#EBF2FF" },
  { name: "Atorvastatin 10mg",dose: "1 tablet",  time: "At Bedtime",      color: "#8B4000", bg: "#FFF8F0" },
];

const vitals = [
  { label: "Blood Pressure", value: "128 / 82", icon: Activity, unit: "mmHg", status: "normal" },
  { label: "Blood Sugar",    value: "112",       icon: Heart,    unit: "mg/dL", status: "normal" },
  { label: "Heart Rate",     value: "74",        icon: Heart,    unit: "bpm",   status: "normal" },
];

export default function HealthPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          <header className="mb-8 animate-fade-in">
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
              ❤️ Health & Medicines
            </h1>
            <p className="text-[26px] font-semibold text-[#444444]">Keep track of your health easily</p>
          </header>

          {/* Medicines */}
          <section className="mb-8" aria-labelledby="medicines-heading">
            <h2 id="medicines-heading" className="text-[32px] font-bold text-[#1A1A1A] mb-4 flex items-center gap-3">
              <Pill size={32} color="#1A7340" aria-hidden="true" />
              Today&apos;s Medicines
            </h2>
            <div className="flex flex-col gap-5">
              {medicines.map((med) => (
                <div
                  key={med.name}
                  className="flex items-center gap-5 p-6 rounded-2xl shadow-md border border-[#D0C8B8] min-h-[88px]"
                  style={{ backgroundColor: med.bg, borderLeft: `4px solid ${med.color}`, paddingLeft: "20px" }}
                >
                  <div className="h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${med.color}20` }}>
                    <Pill size={32} color={med.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[26px] font-bold text-[#1A1A1A]">{med.name}</p>
                    <p className="text-[22px] font-semibold text-[#444444]">{med.dose} — {med.time}</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl text-[18px] font-bold"
                    style={{ backgroundColor: med.color, color: "#FFFDF5" }}>
                    Take
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vitals */}
          <section aria-labelledby="vitals-heading">
            <h2 id="vitals-heading" className="text-[32px] font-bold text-[#1A1A1A] mb-4 flex items-center gap-3">
              <Activity size={32} color="#1A56DB" aria-hidden="true" />
              Today&apos;s Vitals
            </h2>
            <div className="flex flex-col gap-5">
              {vitals.map((v) => (
                <div key={v.label}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-[#F5F0E8] border border-[#D0C8B8] shadow-md min-h-[88px]">
                  <div className="flex-1">
                    <p className="text-[24px] font-semibold text-[#444444]">{v.label}</p>
                    <p className="text-[36px] font-bold text-[#1A1A1A]">
                      {v.value} <span className="text-[22px] font-semibold text-[#444444]">{v.unit}</span>
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#EDFBF2] text-[#1A7340] text-[20px] font-bold">Normal</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
      <BottomNavigation currentPage="health" />
    </>
  );
}
