import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { upgradeSubscription } from "@/lib/subscriptionUtils";

export async function POST(req: Request) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const body = await req.json();
  const { plan, userSubscription } = body;

  const newPlan = plan.toUpperCase();
  try {
    const response = await upgradeSubscription(userSubscription, newPlan);
    return NextResponse.json(response);
  } catch (error) {
    console.log("[UPGRADE_SUBSCRIPTION_ROUTE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
