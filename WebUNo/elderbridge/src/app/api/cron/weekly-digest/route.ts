import { NextResponse } from "next/server";

// Verify cron secret to prevent unauthorized runs
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "dev-cron-secret";

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Demo: simulate sending digests to all active users
  const mockUsers = [
    { id: "user_1", fullName: "Kamala", guardianEmail: "priya@example.com" },
    { id: "user_2", fullName: "Rajan",  guardianEmail: "arjun@example.com" },
  ];

  const results = mockUsers.map(user => ({
    userId:   user.id,
    name:     user.fullName,
    guardian: user.guardianEmail,
    status:   "sent",
    sentAt:   new Date().toISOString(),
  }));

  console.log(`📧 Weekly digest sent to ${results.length} guardians`);

  return NextResponse.json({
    success:   true,
    sent:      results.length,
    failed:    0,
    total:     results.length,
    recipients: results,
    note: "In production: integrate Resend + Prisma for real email delivery",
  });
}

// Also support POST for manual trigger from dashboard
export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Digest queued for sending",
    scheduledFor: "Sunday 9:00 AM",
  });
}
