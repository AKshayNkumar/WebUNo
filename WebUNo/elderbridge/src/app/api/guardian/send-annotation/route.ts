import { NextResponse } from "next/server";

// In-memory store (replace with Redis in production)
let annotations: any[] = [];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.annotation) annotations.push(body.annotation);
  return NextResponse.json({ ok: true });
}
