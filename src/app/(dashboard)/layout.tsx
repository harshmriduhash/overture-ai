"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import useUserStore from "@/store/useUserStore";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";

interface Props {
  children: React.ReactNode;
}

const whitelistedPages = ["/dashboard", "/help", "/subscription"];

export default function DashboardLayout({ children }: Props) {
  const { user, isLoaded } = useUser();
  const { setUserName, setUserEmail } = useUserStore();
  const { setUserSubscription } = useUserSubscriptionStore();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch("/api/subscription/check", {
          method: "GET",
        });
        const data = await response.json();
        setUserSubscription(data);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };
    if (user) {
      checkSubscription();
    }
  }, [user, setUserSubscription]);

  useEffect(() => {
    if (isLoaded && user) {
      setUserName(user.fullName || "Guest");
      setUserEmail(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user, setUserName, setUserEmail]);

  const pathname = usePathname();
  const isWhitelisted = whitelistedPages.includes(pathname);

  return (
    <div
      className={`relative ${isWhitelisted ? "min-h-full" : "h-full"} bg-[#f5f1ff]`}
    >
      <div className="fixed h-[72px] w-full border-b-[1px] bg-white">
        <Navbar />
      </div>
      <div className="fixed hidden h-full w-72 md:block">
        <Sidebar />
      </div>
      <div className="h-full w-full md:pl-72">
        <div className="mx-auto h-full max-w-screen-xl px-4 pt-14 md:px-8 md:pt-[72px]">
          <div className="h-full pt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
