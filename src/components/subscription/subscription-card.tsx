import { useState } from "react";
import { formatPrice } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { postInitiatePayment, postUpgradeSubscription } from "@/lib/api";
import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";
import useUserStore from "@/store/useUserStore";

const SubscriptionCard = ({
  plan,
  currentPlan,
  form,
  setUserSubscription,
}: {
  plan: any;
  currentPlan: string;
  form: any;
  setUserSubscription: (data: any) => void;
}) => {
  const { userSubscription } = useUserSubscriptionStore();
  const { userName, userEmail } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isCurrentPlan = currentPlan === plan.name.toLowerCase();
  const isDowngrade =
    currentPlan === "pro" && plan.name.toLowerCase() === "free";

  const handlePlanSelect = async (selectedPlan: {
    name: string;
    price: number;
  }) => {
    if (selectedPlan.name === "Free") {
      const data = await postUpgradeSubscription("Free", userSubscription);
      setUserSubscription(data);
      return;
    }

    form.setValue("plan", selectedPlan.name);
    form.setValue("price", selectedPlan.price);

    const values = {
      name: userName,
      email: userEmail,
      plan: selectedPlan.name,
      price: selectedPlan.price,
    };

    setIsLoading(true); // Enable loading state

    try {
      const { token } = await postInitiatePayment(values);

      const snapScript = document.createElement("script");
      snapScript.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      snapScript.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
      );
      snapScript.async = true;
      document.body.appendChild(snapScript);

      snapScript.onload = () => {
        setIsOpen(false);
        window.snap.pay(token, {
          onSuccess: async (result: any) => {
            const response = await fetch("/api/subscription/upgrade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan: values.plan, userSubscription }),
            });
            const data = await response.json();
            setUserSubscription(data);

            console.log("Payment successful:", result);
            alert("Payment successful!");

            setIsOpen(false); // Close the dialog on success
            setIsLoading(false); // Disable loading state
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result);
            alert("Payment pending!");
            setIsLoading(false); // Disable loading state
          },
          onError: (result: any) => {
            console.error("Payment error:", result);
            alert("Payment failed!");
            setIsLoading(false); // Disable loading state
          },
          onClose: () => {
            alert("Payment popup closed without completion.");
            setIsLoading(false); // Disable loading state
          },
        });
      };
    } catch (error) {
      console.error("Error in handlePlanSelect:", error);
      setIsLoading(false); // Disable loading state on error
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-2 rounded-lg border border-[#593a8b] bg-white p-5 md:gap-y-3">
      <h2 className="text-base font-bold md:text-xl">{plan.name} Plan</h2>
      <p className="text-sm font-light md:text-[15px]">{plan.description}</p>
      <div className="flex items-end gap-x-1">
        <h1 className="text-2xl font-bold md:text-3xl">
          Rp. {formatPrice(plan.price)}
        </h1>
        <p className="text-sm md:text-[15px]">/mo</p>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          disabled={isCurrentPlan}
          className="disabled:pointer-events-none disabled:opacity-50"
        >
          <Button variant="custom" className="w-full text-xs md:text-sm">
            {isCurrentPlan ? "Plan Selected" : "Select Plan"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base md:text-[18px]">
              {isDowngrade
                ? "Are you sure you want to downgrade?"
                : "Are you sure you want to upgrade?"}
            </DialogTitle>
            <DialogDescription>
              You’re currently on the{" "}
              <strong>
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}{" "}
                Plan
              </strong>
              .
              {isDowngrade ? (
                <>
                  {" "}
                  By switching to the <strong>{plan.name} Plan</strong>, you may
                  lose access to certain features. Are you sure you want to
                  downgrade?
                </>
              ) : (
                <>
                  {" "}
                  By upgrading to the <strong>{plan.name} Plan</strong>,
                  you&apos;ll gain additional features and benefits. Are you
                  sure you want to upgrade?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="custom"
              onClick={() => handlePlanSelect(plan)}
              disabled={isLoading}
              className="text-xs md:text-sm"
            >
              {isLoading ? (
                <LoaderCircle className="mx-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-xs md:text-sm"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="text-[15px] font-semibold md:text-base">Features include</p>
      {plan.features.map((feature: string) => (
        <div key={feature} className="flex items-center gap-x-2">
          <CircleCheck className="h-4 w-4 flex-shrink-0 text-[#714ab0]" />
          <p className="text-sm md:text-[15px]">{feature}</p>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionCard;
