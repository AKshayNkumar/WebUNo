// /app/api/scam/check/route.ts

import { NextResponse } from 'next/server';
import { ScamDetector } from '@/lib/scam/ScamDetector';

export async function POST(request: Request) {
  try {
    const { url, userId, context } = await request.json();

    const detector = new ScamDetector();
    const analysis = await detector.analyzeUrl(url, context);

    // Log scam check
    await prisma.scamAttempt.create({
      data: {
        userId,
        url,
        threatLevel: analysis.threatLevel,
        flags: analysis.flags,
        blocked: analysis.shouldBlock,
        guardianAlerted: analysis.recommendedAction === 'alert_guardian'
      }
    });

    // Alert guardians if critical
    if (analysis.shouldBlock) {
      await alertGuardians(userId, analysis);
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Scam check error:', error);
    return NextResponse.json(
      { error: 'Failed to check URL safety' },
      { status: 500 }
    );
  }
}