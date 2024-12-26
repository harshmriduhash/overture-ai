import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const inter = Inter({
  weight: "600",
  subsets: ["latin"],
});

export default function LandingNavbar() {
  return (
    <div className="fixed left-0 top-6 z-50 hidden w-full lg:flex">
      <div className="flex w-full items-center justify-between rounded-full bg-[#8f69cb]/20 px-6 py-4 text-[15px] backdrop-blur-md lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl">
        <a href="#home" className="flex items-center justify-center gap-x-2">
          <div className="relative h-6 w-6">
            <Image alt="logo" fill src="/assets/logo.png" />
          </div>
          <p className={cn("text-[17px]", inter.className)}>OvertureAI</p>
        </a>
        <div className="flex gap-x-8">
          <a className="hover:text-[#593a8b]" href="#home">
            Home
          </a>
          <a className="hover:text-[#593a8b]" href="#features">
            Features
          </a>
          <a className="hover:text-[#593a8b]" href="#pricing">
            Pricing
          </a>
          <a className="hover:text-[#593a8b]" href="#contact">
            Contact Us
          </a>
        </div>
        <div className="space-x-2">
          <Link href="/sign-in">
            <Button variant="secondary" size="navbar">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="custom" size="navbar">
              Getting Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
