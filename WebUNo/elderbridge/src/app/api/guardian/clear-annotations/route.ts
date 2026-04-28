import { NextResponse } from "next/server";

export async function POST() {
  // Clear all annotations (in production: Redis DEL)
  return NextResponse.json({ ok: true });
}
