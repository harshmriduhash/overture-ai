import { cn, formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const subscriptionPlans = [
  {
    name: "Free",
    description:
      "Perfect choice for exploring and testing our platform's features",
    price: 0,
    features: [
      "AI-powered conversations",
      "Generate images with AI",
      "Create videos using AI",
      "AI-driven code generation",
      "Produce music with AI",
      "5 credits for limited use",
    ],
  },
  {
    name: "Pro",
    description:
      "Top choice for individuals who need more flexibility and usage",
    price: 50000,
    features: [
      "Unlimited AI conversations",
      "Generate professional images",
      "Create high-quality videos",
      "Accelerate coding with AI",
      "Produce music tracks",
      "50 credits per month",
    ],
  },
  {
    name: "Unlimited",
    description: "Best for power users and businesses with unlimited access",
    price: 300000,
    features: [
      "Endless AI conversations",
      "Unlimited image generation",
      "Create unlimited videos",
      "Unlimited code generation",
      "Endless music production",
      "Unlimited credits for heavy use",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="my-12 space-y-8 px-5 lg:my-20 lg:px-0">
      <div className="text-center">
        <h3 className="text-sm font-bold uppercase md:text-base">Pricing</h3>
        <h2 className="text-2xl font-bold md:text-3xl lg:text-5xl">
          Price for everyone
        </h2>
        <p className="mt-2 text-sm md:mt-4 md:text-[15px] lg:text-base">
          Choose a plan that works best for your needs and start creating today.
        </p>
      </div>
      {/* Pricing Cards */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "min-w-[320px] max-w-[416px] flex-1 rounded-lg border p-4 md:p-6",
              plan.name === "Pro"
                ? "border-white bg-[#714ab0] text-white"
                : "border-[#593a8b] bg-white",
            )}
          >
            <h3 className="text-base font-bold md:text-lg">{plan.name}</h3>
            <p className="mt-2 text-sm md:text-[15px]">{plan.description}</p>

            <div className="mt-3 lg:mt-6">
              <span className="text-2xl font-bold md:text-3xl lg:text-4xl">
                {plan.price === 0 ? "Free" : `Rp ${formatPrice(plan.price)}`}
              </span>
              {plan.price !== 0 && (
                <span className="ml-1 text-xs md:text-sm">/ month</span>
              )}
            </div>

            <ul className="mt-3 space-y-3 lg:mt-6">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2 text-[15px]"
                >
                  <p className={plan.name === "Pro" ? "" : "text-indigo-600"}>
                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                  </p>
                  <p className="text-sm md:text-[15px]">{feature}</p>
                </li>
              ))}
            </ul>
            <Link href="/sign-up">
              <Button
                variant={plan.name === "Pro" ? "secondary" : "custom"}
                className="mt-6 w-full text-xs md:text-sm"
              >
                {plan.price === 0 ? "Get Started" : "Choose Plan"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
