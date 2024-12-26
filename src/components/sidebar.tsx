"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";

import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CircleHelp,
  Code,
  CreditCard,
  ImageIcon,
  LayoutDashboardIcon,
  MessageSquare,
  Music,
  VideoIcon,
} from "lucide-react";

const inter = Inter({
  weight: "600",
  subsets: ["latin"],
});

const sidebarMenu = [
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/dashboard",
    border: true,
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    border: false,
  },
  { label: "Image Generation", icon: ImageIcon, href: "/image", border: false },
  { label: "Video Generation", icon: VideoIcon, href: "/video", border: false },
  { label: "Music Generation", icon: Music, href: "/music", border: false },
  { label: "Code Generation", icon: Code, href: "/code", border: true },
  {
    label: "Subscription",
    icon: CreditCard,
    href: "/subscription",
    border: false,
  },
  { label: "Help & FAQ", icon: CircleHelp, href: "/help", border: false },
];

const creditLimit = {
  FREE: 5,
  PRO: 50,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { userSubscription } = useUserSubscriptionStore();

  const plan = userSubscription?.plan ?? null;
  const credits = userSubscription?.credits ?? null;

  return (
    <div className="flex h-full flex-col justify-between border-r bg-white">
      <div>
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex h-[72px] items-center justify-center gap-x-1 border-b"
        >
          <div className="relative h-[22px] w-[22px]">
            <Image alt="logo" fill src="/assets/logo.png" />
          </div>
          <p className={cn("text-xl", inter.className)}>OvertureAI</p>
        </Link>
        {/* Menu */}
        <div className="space-y-1 p-4">
          {sidebarMenu.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex cursor-pointer rounded-lg p-3 text-sm transition hover:bg-[#ece5ff]",
                  pathname === item.href ? "bg-[#ece5ff]" : "text-black",
                )}
              >
                <div className="flex flex-1 items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </div>
              </Link>
              {item.border && <hr className="border-dashed" />}
            </div>
          ))}
        </div>
      </div>
      {/* Counter */}
      <div className="flex flex-col gap-y-2 p-4">
        {plan && credits !== null && credits !== undefined ? (
          <>
            {plan !== "UNLIMITED" && (
              <div className="flex flex-col gap-y-2 rounded-lg bg-[#ece5ff] p-3">
                <p className="text-xs">
                  {credits} / {creditLimit[plan]} credits remaining
                </p>
                <Progress
                  className="h-1"
                  value={(credits / creditLimit[plan]) * 100}
                />
              </div>
            )}
            <div className="flex flex-col gap-y-2 rounded-lg bg-[#ece5ff] p-3">
              <div className="relative h-9 w-9">
                <Image alt="logo" fill src="/assets/logo.png" />
              </div>
              <p className="text-sm">
                You’re on the{" "}
                <span className="font-bold">
                  {plan === "PRO"
                    ? "Pro"
                    : plan === "UNLIMITED"
                      ? "Unlimited"
                      : "Free"}{" "}
                  Plan
                </span>
                {plan === "FREE"
                  ? ". Upgrade for more features!"
                  : ". Thank you for subscribing."}
              </p>
              {plan === "FREE" && (
                <Link href="/subscription">
                  <Button variant="custom" className="w-full">
                    Upgrade Now
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[52px] animate-pulse flex-col gap-y-2 rounded-lg bg-[#ece5ff] p-3"></div>
            <div className="flex h-[108px] animate-pulse flex-col gap-y-2 rounded-lg bg-[#ece5ff] p-3"></div>
          </>
        )}
      </div>
    </div>
  );
}
