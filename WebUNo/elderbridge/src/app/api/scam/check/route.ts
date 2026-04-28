import { NextResponse } from "next/server";

// Known scam patterns — extend with real ML in production
const SCAM_PATTERNS = [
  { pattern: /sbi.{0,20}alert/i,           severity: "critical" as const, desc: "Fake SBI bank alert" },
  { pattern: /bank.{0,10}login.{0,10}now/i, severity: "critical" as const, desc: "Fake bank login page" },
  { pattern: /prize.{0,20}winner/i,          severity: "danger"   as const, desc: "Prize scam detected" },
  { pattern: /irs.{0,20}tax.{0,20}refund/i,  severity: "critical" as const, desc: "IRS tax refund scam" },
  { pattern: /covid.{0,20}free.{0,20}money/i, severity: "danger"  as const, desc: "COVID relief scam" },
  { pattern: /lucky.{0,20}draw/i,             severity: "warning"  as const, desc: "Lucky draw phishing" },
  { pattern: /verify.{0,10}account.{0,10}immediately/i, severity: "danger" as const, desc: "Urgent verify scam" },
];

const TRUSTED_DOMAINS = [
  "google.com", "sbi.co.in", "hdfcbank.com", "icicibank.com",
  "apollopharmacy.in", "billdesk.com", "npci.org.in", "upi.org",
  "gov.in", "nic.in", "irctc.co.in", "amazon.in", "flipkart.com",
  "localhost", "elderbridge.app",
];

function analyzeUrl(url: string) {
  try {
    const parsed    = new URL(url);
    const domain    = parsed.hostname.replace("www.", "");
    const fullUrl   = url.toLowerCase();
    const flags: object[] = [];

    // Check trusted
    const isTrusted = TRUSTED_DOMAINS.some(d => domain === d || domain.endsWith(`.${d}`));
    if (isTrusted) {
      return { threatLevel: "safe", confidence: 0.98, flags: [], shouldBlock: false,
        userMessage: "This website is safe to use.", recommendedAction: "allow" };
    }

    // Pattern matching
    for (const { pattern, severity, desc } of SCAM_PATTERNS) {
      if (pattern.test(fullUrl)) {
        flags.push({ category: "url", severity, description: desc, evidence: url });
      }
    }

    // Heuristic checks
    if ((domain.match(/-/g) || []).length >= 3) {
      flags.push({ category: "url", severity: "warning", description: "Suspicious domain with many hyphens", evidence: domain });
    }
    if (/\d{4,}/.test(domain)) {
      flags.push({ category: "url", severity: "warning", description: "Domain contains long number sequence", evidence: domain });
    }
    if (!parsed.protocol.startsWith("https") && !domain.includes("localhost")) {
      flags.push({ category: "url", severity: "warning", description: "Not using secure HTTPS connection", evidence: parsed.protocol });
    }

    const criticals = (flags as any[]).filter(f => f.severity === "critical").length;
    const dangers   = (flags as any[]).filter(f => f.severity === "danger").length;
    const warnings  = (flags as any[]).filter(f => f.severity === "warning").length;

    let threatLevel: string, shouldBlock: boolean, userMessage: string, recommendedAction: string, confidence: number;

    if (criticals > 0) {
      threatLevel = "critical"; shouldBlock = true; confidence = 0.96;
      userMessage = "This website is very dangerous. It is trying to steal your money or personal information.";
      recommendedAction = "block";
    } else if (dangers > 0) {
      threatLevel = "danger"; shouldBlock = true; confidence = 0.88;
      userMessage = "This website looks suspicious. It may not be safe to use.";
      recommendedAction = "block";
    } else if (warnings > 0) {
      threatLevel = "warning"; shouldBlock = false; confidence = 0.72;
      userMessage = "Please be careful on this website. Check with your family before entering any details.";
      recommendedAction = "warn";
    } else {
      threatLevel = "safe"; shouldBlock = false; confidence = 0.75;
      userMessage = "This website seems okay, but always be careful about sharing personal details.";
      recommendedAction = "allow";
    }

    return { threatLevel, confidence, flags, shouldBlock, userMessage, recommendedAction };

  } catch {
    return { threatLevel: "warning", confidence: 0.5, flags: [], shouldBlock: false,
      userMessage: "Could not check this website. Please be careful.", recommendedAction: "warn" };
  }
}

// In-memory scam log
const scamLog: object[] = [];

export async function POST(request: Request) {
  try {
    const { url, userId = "demo-user" } = await request.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const analysis = analyzeUrl(url);

    // Log attempt
    scamLog.push({ userId, url, ...analysis, timestamp: new Date().toISOString() });

    return NextResponse.json(analysis);

  } catch (error) {
    console.error("Scam check error:", error);
    return NextResponse.json({ error: "Failed to check URL safety" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ recentChecks: scamLog.slice(-10).reverse() });
}
