// /app/api/playbooks/execute/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { playbookId, userId } = await request.json();

    const playbook = await prisma.playbook.findUnique({
      where: { id: playbookId },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' }
        }
      }
    });

    if (!playbook) {
      return NextResponse.json(
        { error: 'Playbook not found' },
        { status: 404 }
      );
    }

    // Log playbook execution
    await prisma.activityLog.create({
      data: {
        userId,
        actionType: 'playbook_start',
        actionDescription: `Started playbook: ${playbook.name}`,
        durationSeconds: 0,
        succeeded: true,
        wasGuided: true
      }
    });

    // Update playbook stats
    await prisma.playbook.update({
      where: { id: playbookId },
      data: {
        useCount: { increment: 1 },
        lastUsed: new Date()
      }
    });

    return NextResponse.json({
      playbook,
      steps: playbook.steps
    });

  } catch (error) {
    console.error('Playbook execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute playbook' },
      { status: 500 }
    );
  }
}