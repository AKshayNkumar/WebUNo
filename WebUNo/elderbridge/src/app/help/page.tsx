"use client";

import React from "react";
import { motion } from "framer-motion";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Phone, Shield, ClipboardList, Globe, Mail, Video, BookOpen, AlertTriangle } from "lucide-react";

const HELP_ITEMS = [
  {
    group: "👨‍👩‍👧 Family & Guardian",
    items: [
      { icon: <Phone size={28} color="#1A56DB" />,   bg:"#EBF2FF", border:"#1A56DB", label:"Call Daughter / Son",    detail:"Your family is always here for you",       href:"tel:+911234567890", external:true },
      { icon: <Video size={28} color="#555577" />,   bg:"#EEF2FF", border:"#555577", label:"Guardian Dashboard",    detail:"Family monitors your safety from here",    href:"/guardian"         },
      { icon: <Video size={28} color="#7C3AED" />,   bg:"#F5F0FF", border:"#7C3AED", label:"Live Help Session",     detail:"Family draws on your screen to guide you",  href:"/guardian/live-help"},
      { icon: <Mail size={28} color="#8B4000" />,    bg:"#FFF8F0", border:"#8B4000", label:"Weekly Digest Email",   detail:"Preview the email your family receives",    href:"/digest"           },
    ],
  },
  {
    group: "📋 Learning & Practice",
    items: [
      { icon: <ClipboardList size={28} color="#1A7340" />, bg:"#EDFBF2", border:"#1A7340", label:"Step-by-Step Guide",  detail:"Practice paying bills, bank balance & more", href:"/playbook" },
      { icon: <BookOpen size={28} color="#1A56DB" />,      bg:"#EBF2FF", border:"#1A56DB", label:"My Tasks",            detail:"View and complete your daily tasks",          href:"/tasks"    },
    ],
  },
  {
    group: "🛡️ Safety",
    items: [
      { icon: <Shield size={28} color="#CC0000" />,  bg:"#FFF0F0", border:"#CC0000", label:"Scam Protection Demo",  detail:"See how ElderBridge blocks dangerous websites", href:"/"       },
      { icon: <Globe size={28} color="#7C3AED" />,   bg:"#F5F0FF", border:"#7C3AED", label:"Browser Extension",    detail:"Makes any website safe on your browser",       href:"/extension" },
    ],
  },
];

export default function HelpPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FFFDF5] pb-24">
        <div className="max-w-2xl mx-auto px-6 pt-8">

          {/* Header */}
          <motion.header className="mb-8" initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
              ❓ Get Help
            </h1>
            <p className="text-[24px] font-semibold text-[#444444]">
              Everything you need is right here
            </p>
          </motion.header>

          {/* Emergency SOS */}
          <motion.section className="mb-8" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}>
            <a href="tel:112"
              className="flex items-center justify-center gap-4 w-full py-7 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FF6B00] transition-all"
              style={{ backgroundColor:"#CC0000", color:"white" }}
              aria-label="Emergency SOS — call 112">
              <AlertTriangle size={40} />
              <div className="text-center">
                <p className="text-[32px] font-bold">🆘 Emergency SOS</p>
                <p className="text-[20px] font-semibold opacity-90">Tap to call 112</p>
              </div>
            </a>
          </motion.section>

          {/* Help Groups */}
          {HELP_ITEMS.map((group, gi) => (
            <motion.section key={gi} className="mb-8"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.15 + gi * 0.08 }}>
              <h2 className="text-[26px] font-bold text-[#1A1A1A] mb-4">{group.group}</h2>
              <div className="flex flex-col gap-4">
                {group.items.map((item, i) => (
                  <a key={i} href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-5 p-6 rounded-2xl shadow-md border border-[#D0C8B8] w-full text-left hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#FF6B00]"
                    style={{ backgroundColor: item.bg, borderLeft: `5px solid ${item.border}` }}>
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <p className="text-[22px] font-bold text-[#1A1A1A]">{item.label}</p>
                      <p className="text-[17px] font-semibold text-[#444444]">{item.detail}</p>
                    </div>
                    <span className="text-[26px]" style={{ color: item.border }}>›</span>
                  </a>
                ))}
              </div>
            </motion.section>
          ))}

          {/* Footer reassurance */}
          <motion.div className="text-center p-6 rounded-2xl bg-[#EDFBF2] border border-[#1A7340]"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
            <p className="text-[22px] font-bold text-[#1A7340] mb-2">You&apos;re never alone 💚</p>
            <p className="text-[18px] font-semibold text-[#444]">
              ElderBridge is always watching over you. Your family gets alerted the moment anything goes wrong.
            </p>
          </motion.div>

        </div>
      </main>
      <BottomNavigation currentPage="help" />
    </>
  );
}
