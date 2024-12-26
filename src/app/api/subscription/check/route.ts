import { auth } from "@clerk/nextjs/server";
import { checkAndCreateSubscription } from "@/lib/subscriptionUtils";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  try {
    const userSubscription = await checkAndCreateSubscription(userId);
    return NextResponse.json(userSubscription);
  } catch (error) {
    console.log("[CHECK_SUBSCRIPTION_ROUTE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
