// /app/api/confidence/calculate/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Get recent activity (last 30 days)
    const activities = await prisma.activityLog.findMany({
      where: {
        userId,
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get scam blocks
    const scamBlocks = await prisma.scamAttempt.count({
      where: {
        userId,
        blocked: true,
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Calculate score components
    const independentTasks = activities.filter(a => 
      a.succeeded && !a.wasGuided
    ).length;
    
    const totalTasks = activities.length;
    const successRate = totalTasks > 0 ? independentTasks / totalTasks : 0;

    const uniqueSkills = new Set(
      activities.filter(a => a.succeeded).map(a => a.actionType)
    ).size;

    const consistency = calculateConsistency(activities);

    // Weighted scoring
    const score = Math.min(100, Math.round(
      (successRate * 40) +
      (scamBlocks > 0 ? 20 : 0) +
      (Math.min(uniqueSkills, 5) * 4) +
      (consistency * 10) +
      (activities.some(a => a.sandboxPracticedFirst) ? 10 : 0)
    ));

    const levelName = getConfidenceLevel(score);

    // Save score
    await prisma.confidenceScore.create({
      data: {
        userId,
        score,
        levelName,
        breakdown: {
          independentTasks,
          totalTasks,
          successRate,
          scamBlocks,
          uniqueSkills,
          consistency
        }
      }
    });

    return NextResponse.json({ score, levelName });

  } catch (error) {
    console.error('Confidence calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate confidence' },
      { status: 500 }
    );
  }
}

function calculateConsistency(activities: any[]): number {
  // Check how many different days they were active
  const activeDays = new Set(
    activities.map(a => a.timestamp.toISOString().split('T')[0])
  );
  return Math.min(activeDays.size / 7, 1); // Max 1 for daily usage
}

function getConfidenceLevel(score: number): string {
  if (score < 20) return 'just_starting';
  if (score < 40) return 'getting_comfortable';
  if (score < 60) return 'growing_confident';
  if (score < 80) return 'quite_independent';
  return 'digital_champion';
}