"use client";

import React from "react";
import { Phone, MessageCircle, Shield, Users, AlertTriangle } from "lucide-react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const contacts = [
  { name: "Priya (Daughter)",  phone: "+91 98765 43210", color: "#8B4000", bg: "#FFF8F0", emoji: "👩" },
  { name: "Raj (Son)",         phone: "+91 87654 32109", color: "#1A56DB", bg: "#EBF2FF", emoji: "👨" },
  { name: "Dr. Sharma",        phone: "+91 76543 21098", color: "#1A7340", bg: "#EDFBF2", emoji: "👨‍⚕️" },
];

export default function HelpPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          <header className="mb-8 animate-fade-in">
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">👥 Get Help</h1>
            <p className="text-[26px] font-semibold text-[#444444]">Call your family or get support</p>
          </header>

          {/* Emergency SOS */}
          <section className="mb-8">
            <button
              onClick={() => alert("🚨 SOS sent to your family! They will call you shortly.")}
              className="w-full min-h-[96px] rounded-2xl bg-[#CC0000] text-[#FFFDF5] text-[30px] font-bold flex items-center justify-center gap-4 shadow-lg hover:bg-[#AA0000] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2"
              aria-label="Emergency SOS"
            >
              <AlertTriangle size={40} /> 🆘 Emergency SOS
            </button>
            <p className="text-center text-[22px] font-semibold text-[#444444] mt-3">
              Sends an alert to all your family members instantly
            </p>
          </section>

          {/* Step-by-step guide */}
          <section className="mb-8">
            <a href="/playbook"
              className="flex items-center gap-5 p-7 rounded-2xl shadow-md border border-[#D0C8B8] min-h-[88px] w-full bg-[#EBF2FF] hover:bg-[#DBEAFE] transition-all no-underline focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              style={{ borderLeft: "6px solid #1A56DB", paddingLeft: "24px" }}
            >
              <span className="text-[48px]">📋</span>
              <div className="flex-1">
                <p className="text-[26px] font-bold text-[#1A1A1A]">Step-by-Step Guide</p>
                <p className="text-[20px] font-semibold text-[#444444]">I&apos;ll walk you through any task</p>
              </div>
              <span className="text-[32px] text-[#1A56DB]">›</span>
            </a>
          </section>

          {/* Family contacts */}
          <section className="mb-8" aria-labelledby="contacts-heading">
            <h2 id="contacts-heading" className="text-[32px] font-bold text-[#1A1A1A] mb-4 flex items-center gap-3">
              <Users size={32} color="#1A56DB" aria-hidden="true" />
              Your Family
            </h2>
            <div className="flex flex-col gap-5">
              {contacts.map((c) => (
                <div key={c.name}
                  className="flex items-center gap-5 p-6 rounded-2xl shadow-md border border-[#D0C8B8] min-h-[88px]"
                  style={{ backgroundColor: c.bg, borderLeft: `4px solid ${c.color}`, paddingLeft: "20px" }}>
                  <span className="text-[48px] flex-shrink-0">{c.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[26px] font-bold text-[#1A1A1A]">{c.name}</p>
                    <p className="text-[22px] font-semibold text-[#444444]">{c.phone}</p>
                  </div>
                  <div className="flex gap-3">
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="h-[60px] w-[60px] rounded-xl flex items-center justify-center no-underline"
                      style={{ backgroundColor: c.color }}
                      aria-label={`Call ${c.name}`}>
                      <Phone size={28} color="#FFFDF5" />
                    </a>
                    <a href={`sms:${c.phone.replace(/\s/g, "")}`}
                      className="h-[60px] w-[60px] rounded-xl flex items-center justify-center bg-[#EDEDDD] no-underline"
                      aria-label={`Message ${c.name}`}>
                      <MessageCircle size={28} color="#444444" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Guardian Dashboard */}
          <section className="mb-8">
            <a href="/guardian"
              className="flex items-center gap-5 p-7 rounded-2xl shadow-md border border-[#D0C8B8] min-h-[88px] w-full bg-[#EDFBF2] hover:bg-[#D1FAE5] transition-all no-underline focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
              style={{ borderLeft: "6px solid #1A7340", paddingLeft: "24px" }}
            >
              <span className="text-[48px]">🛡️</span>
              <div className="flex-1">
                <p className="text-[26px] font-bold text-[#1A1A1A]">Guardian Dashboard</p>
                <p className="text-[20px] font-semibold text-[#444444]">Family safety monitoring view</p>
              </div>
              <span className="text-[32px] text-[#1A7340]">›</span>
            </a>
          </section>

          {/* Scam protection */}
          <section className="p-6 rounded-2xl bg-[#FFF8F0] border-2 border-[#8B4000]">
            <div className="flex items-center gap-4 mb-3">
              <Shield size={36} color="#8B4000" />
              <h2 className="text-[28px] font-bold text-[#8B4000]">Protect Yourself</h2>
            </div>
            <p className="text-[24px] font-semibold text-[#444444] leading-relaxed">
              Remember: <strong className="text-[#CC0000]">Never share your PIN, OTP, or bank password</strong> with anyone — even people calling from a bank number.
            </p>
            <p className="text-[22px] font-semibold text-[#444444] mt-3">
              If unsure, tap the SOS button above and your family will help you.
            </p>
          </section>

        </div>
      </main>
      <BottomNavigation currentPage="help" />
    </>
  );
}
