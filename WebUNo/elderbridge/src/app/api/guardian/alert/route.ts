import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // In production: send push notification / SMS / email to guardians
  console.log("[GUARDIAN ALERT]", body);
  return NextResponse.json({ ok: true, message: "Guardian alerted" });
}
