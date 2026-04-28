import { NextResponse } from "next/server";

// In-memory playbook store — replace with Prisma in production
const PLAYBOOKS: Record<string, { id: string; name: string; steps: object[] }> = {
  "electricity": {
    id: "electricity",
    name: "Pay Electricity Bill",
    steps: [
      { stepNumber: 1, totalSteps: 5, instruction: "Open Google Chrome. Look for the colourful circle icon.", actionType: "navigate" },
      { stepNumber: 2, totalSteps: 5, instruction: "In the address bar, type: www.billdesk.com and press Enter.", actionType: "navigate" },
      { stepNumber: 3, totalSteps: 5, instruction: "Look for the button that says 'Electricity'. Tap on it.", actionType: "click", targetSelector: "button:contains('Electricity')" },
      { stepNumber: 4, totalSteps: 5, instruction: "You will see a box asking for your Consumer Number. Type those numbers carefully.", actionType: "type" },
      { stepNumber: 5, totalSteps: 5, instruction: "Tap the green 'Proceed to Pay' button. Well done!", actionType: "click", autoClickOption: true },
    ],
  },
  "bank-balance": {
    id: "bank-balance",
    name: "Check Bank Balance",
    steps: [
      { stepNumber: 1, totalSteps: 3, instruction: "Open your bank's app on your phone or go to their website.", actionType: "navigate" },
      { stepNumber: 2, totalSteps: 3, instruction: "Enter your username and password carefully.", actionType: "type" },
      { stepNumber: 3, totalSteps: 3, instruction: "Look for 'Account Balance' or 'My Accounts' on the main page.", actionType: "click" },
    ],
  },
  "medicines": {
    id: "medicines",
    name: "Order Medicines Online",
    steps: [
      { stepNumber: 1, totalSteps: 6, instruction: "Open Google Chrome and go to www.apollopharmacy.in", actionType: "navigate" },
      { stepNumber: 2, totalSteps: 6, instruction: "Click on the search bar at the top and type your medicine name.", actionType: "type" },
      { stepNumber: 3, totalSteps: 6, instruction: "Look at the results and tap on your medicine.", actionType: "click" },
      { stepNumber: 4, totalSteps: 6, instruction: "Tap 'Add to Cart'.", actionType: "click" },
      { stepNumber: 5, totalSteps: 6, instruction: "Tap the cart icon at the top right and review your order.", actionType: "click" },
      { stepNumber: 6, totalSteps: 6, instruction: "Tap 'Proceed to Checkout' and enter your address.", actionType: "click", autoClickOption: true },
    ],
  },
};

// Simple in-memory activity log for demo
const executionLog: object[] = [];

export async function POST(request: Request) {
  try {
    const { playbookId, userId } = await request.json();

    const playbook = PLAYBOOKS[playbookId];
    if (!playbook) {
      return NextResponse.json({ error: "Playbook not found" }, { status: 404 });
    }

    // Log the execution
    executionLog.push({
      userId,
      playbookId,
      playbookName: playbook.name,
      startedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      playbook,
      steps: playbook.steps,
      useCount: executionLog.filter((e: any) => e.playbookId === playbookId).length,
    });

  } catch (error) {
    console.error("Playbook execution error:", error);
    return NextResponse.json({ error: "Failed to execute playbook" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    playbooks: Object.values(PLAYBOOKS).map(p => ({
      id: p.id,
      name: p.name,
      totalSteps: p.steps.length,
    })),
  });
}
