import { NextResponse } from "next/server";

// In-memory annotation store (replace with DB/Redis in production)
let annotations: any[] = [];

export async function GET() {
  return NextResponse.json({ annotations });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.annotation) {
    annotations.push(body.annotation);
    // Auto-expire after 10s
    setTimeout(() => {
      annotations = annotations.filter((a) => a.id !== body.annotation.id);
    }, 10000);
  }
  return NextResponse.json({ ok: true });
}
