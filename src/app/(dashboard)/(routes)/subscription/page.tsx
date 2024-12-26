"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";
import useUserStore from "@/store/useUserStore";

import { formatEndDate, formatPlanName } from "@/lib/utils";

import { CreditCard } from "lucide-react";
import Heading from "@/components/heading";
import SubscriptionCard from "@/components/subscription/subscription-card";

const subscriptionPlans = [
  {
    name: "Free",
    description: "Perfect for exploring and testing our platform's features",
    price: 0,
    features: [
      "Access to all features: conversation, image generation, video generation, code generation, and music generation",
      "Limited to 5 credits",
    ],
  },
  {
    name: "Pro",
    description: "Great for individuals who need more flexibility and usage",
    price: 50000,
    features: [
      "Access to all features: conversation, image generation, video generation, code generation, and music generation",
      "50 credits per month",
    ],
  },
  {
    name: "Unlimited",
    description:
      "Best for power users and businesses who require unlimited access",
    price: 300000,
    features: [
      "Access to all features: conversation, image generation, video generation, code generation, and music generation",
      "Unlimited credits",
    ],
  },
];

export default function SubscriptionPage() {
  const { userName, userEmail } = useUserStore();
  const { userSubscription, setUserSubscription } = useUserSubscriptionStore();

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    plan: z.string().min(1, { message: "Please select a plan" }),
    price: z.number().min(1, { message: "Price is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userName,
      email: userEmail,
      plan: "",
      price: 0,
    },
  });

  if (!userSubscription) return null;

  const { plan, endDate } = userSubscription;
  const formattedPlan = formatPlanName(plan);
  const formattedEndDate = formatEndDate(endDate);

  return (
    <div className="flex flex-col pb-8 md:pb-10">
      <Heading
        title="Subscription"
        description="Manage account subscription planning"
        icon={CreditCard}
      />
      <div className="mb-4 text-sm md:text-[15px]">
        <p>
          You&apos;re currently on a <strong>{formattedPlan} Plan</strong>
        </p>
        <p className="mb-3">
          Expired in: <strong>{formattedEndDate}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <SubscriptionCard
            key={plan.name}
            plan={plan}
            currentPlan={userSubscription.plan.toLowerCase()}
            form={form} // Pass the form to the component
            setUserSubscription={setUserSubscription} // Pass setUserSubscription function to the component
          />
        ))}
      </div>
    </div>
  );
}
