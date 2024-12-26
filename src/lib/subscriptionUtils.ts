import prismadb from "./prismadb";
import {
  SubscriptionPlan,
  UserSubscription as UserSubscriptionParams,
} from "@prisma/client";
import { addMonths } from "date-fns";

export async function checkAndCreateSubscription(userId: string) {
  const userSubscription = await checkSubscription(userId);

  // If no subscription exists, create a new FREE plan
  if (!userSubscription) {
    return await createFreePlan(userId);
  }

  // Check if the subscription has expired
  const isExpired = userSubscription.endDate!.getTime() <= Date.now();
  if (isExpired) {
    await prismadb.userSubscription.update({
      where: { id: userSubscription.id },
      data: { isActive: false },
    });
    return await createFreePlan(userId);
  }

  return userSubscription;
}

export async function executeFeature(userSubscription: UserSubscriptionParams) {
  if (userSubscription.plan === "UNLIMITED") return true;

  if (userSubscription.credits >= 1) {
    await prismadb.userSubscription.update({
      where: { id: userSubscription.id },
      data: {
        credits: userSubscription.credits - 1,
      },
    });
    return true;
  }

  return false;
}

export async function upgradeSubscription(
  userSubscription: UserSubscriptionParams,
  newPlan: SubscriptionPlan,
) {
  // Deactivate current subscription if any
  if (newPlan.toLowerCase() !== userSubscription.plan.toLowerCase()) {
    if (userSubscription) {
      await prismadb.userSubscription.update({
        where: { id: userSubscription.id },
        data: { isActive: false },
      });
    }

    // Determine credits and duration for the new plan
    const credits = newPlan === "FREE" ? 5 : newPlan === "PRO" ? 50 : 0;

    // Create the new subscription
    return await prismadb.userSubscription.create({
      data: {
        userId: userSubscription.userId,
        plan: newPlan,
        credits: credits,
        isActive: true,
        endDate: addMonths(new Date(), 1),
      },
    });
  }
}

async function checkSubscription(userId: string) {
  const userSubscription = await prismadb.userSubscription.findFirst({
    where: {
      userId: userId,
      isActive: true,
    },
  });

  return userSubscription;
}

async function createFreePlan(userId: string) {
  const userSubscription = await prismadb.userSubscription.create({
    data: {
      userId: userId,
      plan: "FREE",
      credits: 5,
      isActive: true,
      endDate: addMonths(new Date(), 1),
    },
  });

  return userSubscription;
}
