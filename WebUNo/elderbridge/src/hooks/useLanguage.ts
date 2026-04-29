"use client";

import { useState, useEffect, useCallback } from "react";

export type Lang = "en" | "kn";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Bottom nav
    nav_home: "Home", nav_tasks: "My Tasks", nav_health: "Health", nav_diary: "Diary", nav_help: "Get Help",
    nav_practice: "Practice", nav_guardian: "Guardian",
    // Common
    greeting_morning: "Good Morning", greeting_afternoon: "Good Afternoon", greeting_evening: "Good Evening",
    hero_sub: "Where care meets connection.",
    cta_start: "Start Your Journey", cta_talk: "Talk to Us",
    scroll_hint: "↓ Scroll down",
    // Tasks page
    tasks_title: "My Tasks", tasks_reminders: "🔔 Today's Reminders", tasks_quick: "✅ Quick Tasks",
    tasks_help: "Need Help With a Task?", tasks_safe: "Practice First (Safe Mode)", tasks_safe_d: "Try paying bills & checking balance without any real money",
    tasks_todo: "To Do", tasks_done: "Completed Tasks",
    med_name: "Metformin 500mg", med_detail: "1 tablet after breakfast",
    bill_title: "Electricity Bill Due Today", bill_detail: "₹1,240 due by midnight", due_today: "Due Today",
    task_call: "Call Daughter", task_call_d: "Tap to call family",
    task_bank: "Check Bank Balance", task_bank_d: "Safe, guided walkthrough",
    task_med: "Medicine Schedule", task_med_d: "View today's medicines",
    task_call_doctor: "Call Doctor Sharma", task_call_doctor_d: "Follow-up appointment",
    task_sbi_d: "SBI Savings Account",
    task_buy_meds: "Buy Medicines", task_buy_meds_d: "From Apollo Pharmacy",
    // Health page
    health_title: "Health & Medicines", health_bp: "Blood Pressure", health_sugar: "Blood Sugar",
    health_track: "Track Health", health_meds: "My Medicines", health_add: "Add Medicine",
    health_history: "History", health_normal: "Normal", health_take: "Take", health_vitals: "Today's Vitals", health_hr: "Heart Rate",
    // Playbook page
    playbook_title: "Learn & Practice", playbook_sub: "Step-by-step guides to learn safely",
    playbook_start: "Start Practice", playbook_step: "Step", playbook_of: "of",
    playbook_bill: "Pay Electricity Bill", playbook_bill_d: "Learn to pay your electricity bill online safely",
    playbook_bank: "Check Bank Balance", playbook_bank_d: "Learn to check your bank balance online",
    playbook_upi: "Send Money via UPI", playbook_upi_d: "Learn to send money using UPI apps",
    // Guardian page
    guardian_title: "Ajji's Digital Journey", guardian_sub: "Guardian Dashboard — You're helping them stay safe online",
    guardian_confidence: "Confidence Score", guardian_alerts: "Recent Alerts",
    guardian_scam_check: "🛡️ Live URL Safety Checker", guardian_check_btn: "Check URL",
    guardian_safe_for: "Enter any website URL to check if it's safe for Ajji",
    guardian_digest: "📧 Weekly Digest",
    guardian_digest_d: "Sends every Sunday to Priya with Ajji's highlights, scam alerts & progress",
    guardian_join: "Join Their Screen Now",
    // Help page
    help_title: "Get Help", help_call: "Call Family", help_msg: "Send Message",
    help_sos: "Emergency SOS", help_faq: "Frequently Asked Questions",
    // Diary page
    diary_title: "My Diary", diary_write: "Write Today's Entry", diary_placeholder: "What happened today?",
    diary_save: "Save Entry", diary_past: "Past Entries", diary_cancel: "Cancel",
    // Digest page
    digest_title: "Weekly Digest", digest_for: "Weekly report for",
    // Language
    lang_switch: "ಕನ್ನಡ",
    // Mic
    mic_idle: "Tap and tell me what you want to do today",
    mic_listening: "🎤 Listening... speak now",
  },
  kn: {
    // Bottom nav
    nav_home: "ಮನೆ", nav_tasks: "ನನ್ನ ಕಾರ್ಯಗಳು", nav_health: "ಆರೋಗ್ಯ", nav_diary: "ಡೈರಿ", nav_help: "ಸಹಾಯ ಪಡೆಯಿರಿ",
    nav_practice: "ಅಭ್ಯಾಸ", nav_guardian: "ರಕ್ಷಕ",
    // Common
    greeting_morning: "ಶುಭೋದಯ", greeting_afternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ", greeting_evening: "ಶುಭ ಸಂಜೆ",
    hero_sub: "ಕಾಳಜಿ ಮತ್ತು ಸಂಪರ್ಕ ಸೇರುವ ಸ್ಥಳ.",
    cta_start: "ನಿಮ್ಮ ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ", cta_talk: "ನಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಿ",
    scroll_hint: "↓ ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ",
    // Tasks page
    tasks_title: "ನನ್ನ ಕಾರ್ಯಗಳು", tasks_reminders: "🔔 ಇಂದಿನ ಜ್ಞಾಪನೆಗಳು", tasks_quick: "✅ ತ್ವರಿತ ಕಾರ್ಯಗಳು",
    tasks_help: "ಕಾರ್ಯದಲ್ಲಿ ಸಹಾಯ ಬೇಕೇ?", tasks_safe: "ಮೊದಲು ಅಭ್ಯಾಸ ಮಾಡಿ (ಸುರಕ್ಷಿತ ಮೋಡ್)", tasks_safe_d: "ಯಾವುದೇ ನೈಜ ಹಣವಿಲ್ಲದೆ ಬಿಲ್‌ಗಳನ್ನು ಪಾವತಿಸಲು ಮತ್ತು ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಲು ಪ್ರಯತ್ನಿಸಿ",
    tasks_todo: "ಮಾಡಬೇಕಾದ ಕೆಲಸಗಳು", tasks_done: "ಪೂರ್ಣಗೊಂಡ ಕಾರ್ಯಗಳು",
    med_name: "ಮೆಟ್ಫಾರ್ಮಿನ್ 500mg", med_detail: "ಬೆಳಗಿನ ಉಪಾಹಾರದ ನಂತರ 1 ಮಾತ್ರೆ",
    bill_title: "ವಿದ್ಯುತ್ ಬಿಲ್ ಇಂದು ಬಾಕಿ", bill_detail: "₹1,240 ಮಧ್ಯರಾತ್ರಿಯೊಳಗೆ ಬಾಕಿ", due_today: "ಇಂದು ಬಾಕಿ",
    task_call: "ಮಗಳಿಗೆ ಕರೆ ಮಾಡಿ", task_call_d: "ಕುಟುಂಬಕ್ಕೆ ಕರೆ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    task_bank: "ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ", task_bank_d: "ಸುರಕ್ಷಿತ, ಮಾರ್ಗದರ್ಶಿ ಪ್ರಕ್ರಿಯೆ",
    task_med: "ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ", task_med_d: "ಇಂದಿನ ಔಷಧಿಗಳನ್ನು ನೋಡಿ",
    task_call_doctor: "ಡಾಕ್ಟರ್ ಶರ್ಮಾ ಅವರಿಗೆ ಕರೆ ಮಾಡಿ", task_call_doctor_d: "ಫಾಲೋ-ಅಪ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
    task_sbi_d: "SBI ಉಳಿತಾಯ ಖಾತೆ",
    task_buy_meds: "ಔಷಧಿಗಳನ್ನು ಖರೀದಿಸಿ", task_buy_meds_d: "ಅಪೊಲೊ ಫಾರ್ಮಸಿಯಿಂದ",
    // Health page
    health_title: "ಆರೋಗ್ಯ ಮತ್ತು ಔಷಧಿ", health_bp: "ರಕ್ತದೊತ್ತಡ", health_sugar: "ರಕ್ತದ ಸಕ್ಕರೆ",
    health_track: "ಆರೋಗ್ಯ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", health_meds: "ನನ್ನ ಔಷಧಿಗಳು", health_add: "ಔಷಧಿ ಸೇರಿಸಿ",
    health_history: "ಇತಿಹಾಸ", health_normal: "ಸಾಮಾನ್ಯ", health_take: "ತೆಗೆದುಕೊಳ್ಳಿ", health_vitals: "ಇಂದಿನ ಪ್ರಮುಖ ಅಂಶಗಳು", health_hr: "ಹೃದಯ ಬಡಿತ",
    // Playbook page
    playbook_title: "ಕಲಿಯಿರಿ ಮತ್ತು ಅಭ್ಯಾಸ ಮಾಡಿ", playbook_sub: "ಸುರಕ್ಷಿತವಾಗಿ ಕಲಿಯಲು ಹಂತ-ಹಂತ ಮಾರ್ಗದರ್ಶಿಗಳು",
    playbook_start: "ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ", playbook_step: "ಹಂತ", playbook_of: "ರಲ್ಲಿ",
    playbook_bill: "ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿಸಿ", playbook_bill_d: "ವಿದ್ಯುತ್ ಬಿಲ್ ಆನ್‌ಲೈನ್ ಪಾವತಿ ಕಲಿಯಿರಿ",
    playbook_bank: "ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಿ", playbook_bank_d: "ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲಿಸಲು ಕಲಿಯಿರಿ",
    playbook_upi: "UPI ಮೂಲಕ ಹಣ ಕಳುಹಿಸಿ", playbook_upi_d: "UPI ಆ್ಯಪ್‌ಗಳನ್ನು ಬಳಸಿ ಹಣ ಕಳುಹಿಸಲು ಕಲಿಯಿರಿ",
    // Guardian page
    guardian_title: "ಅಜ್ಜಿಯ ಡಿಜಿಟಲ್ ಪ್ರಯಾಣ", guardian_sub: "ರಕ್ಷಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ — ಅವರು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರಲು ಸಹಾಯ ಮಾಡುತ್ತಿದ್ದೀರಿ",
    guardian_confidence: "ವಿಶ್ವಾಸ ಅಂಕ", guardian_alerts: "ಇತ್ತೀಚಿನ ಎಚ್ಚರಿಕೆಗಳು",
    guardian_scam_check: "🛡️ ಲೈವ್ URL ಸುರಕ್ಷತೆ ಪರಿಶೀಲಕ", guardian_check_btn: "URL ಪರಿಶೀಲಿಸಿ",
    guardian_safe_for: "ಅಜ್ಜಿಗೆ ಸುರಕ್ಷಿತವೇ ಎಂದು ಪರಿಶೀಲಿಸಲು ವೆಬ್‌ಸೈಟ್ URL ನಮೂದಿಸಿ",
    guardian_digest: "📧 ವಾರದ ಸಾರಾಂಶ",
    guardian_digest_d: "ಪ್ರತಿ ಭಾನುವಾರ ಪ್ರಿಯಾಗೆ ಅಜ್ಜಿಯ ವಿಶೇಷಗಳು, ವಂಚನೆ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಪ್ರಗತಿಯೊಂದಿಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ",
    guardian_join: "ಅವರ ಪರದೆಗೆ ಸೇರಿ",
    // Help page
    help_title: "ಸಹಾಯ ಪಡೆಯಿರಿ", help_call: "ಕುಟುಂಬಕ್ಕೆ ಕರೆ ಮಾಡಿ", help_msg: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    help_sos: "ತುರ್ತು SOS", help_faq: "ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು",
    // Diary page
    diary_title: "ನನ್ನ ಡೈರಿ", diary_write: "ಇಂದಿನ ನಮೂದನ್ನು ಬರೆಯಿರಿ", diary_placeholder: "ಇಂದು ಏನಾಯಿತು?",
    diary_save: "ನಮೂದನ್ನು ಉಳಿಸಿ", diary_past: "ಹಿಂದಿನ ನಮೂದುಗಳು", diary_cancel: "ರದ್ದುಮಾಡಿ",
    // Digest page
    digest_title: "ವಾರದ ಸಾರಾಂಶ", digest_for: "ವಾರದ ವರದಿ",
    // Language
    lang_switch: "EN",
    // Mic
    mic_idle: "ಟ್ಯಾಪ್ ಮಾಡಿ ಮತ್ತು ನಿಮಗೆ ಏನು ಬೇಕು ಎಂದು ಹೇಳಿ",
    mic_listening: "🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ",
  },
};

export function useLanguage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("elderbridge-lang") as Lang | null;
    if (saved === "kn" || saved === "en") {
      setLang(saved);
    }
  }, []);

  const toggleLang = useCallback(() => {
    const next: Lang = lang === "en" ? "kn" : "en";
    setLang(next);
    localStorage.setItem("elderbridge-lang", next);
  }, [lang]);

  const t = useCallback(
    (key: string): string => {
      return translations[lang]?.[key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  return { lang, toggleLang, t };
}
