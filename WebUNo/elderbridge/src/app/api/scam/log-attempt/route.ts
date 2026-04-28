import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // In production: save to DB + report to dashboard
  console.log("[SCAM LOG]", body);
  return NextResponse.json({ ok: true });
}
