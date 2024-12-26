import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const inter = Inter({
  weight: "600",
  subsets: ["latin"],
});

export default function LandingNavbarMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed z-50 w-full lg:hidden">
      <div className="flex items-center justify-between bg-[#8f69cb]/20 p-5 backdrop-blur-md">
        <a href="#home" className="flex items-center justify-center gap-x-2">
          <div className="relative h-5 w-5">
            <Image alt="logo" fill src="/assets/logo.png" />
          </div>
          <p className={cn("", inter.className)}>OvertureAI</p>
        </a>
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {/* Content */}
      {isMenuOpen && (
        <div className="absolute top-[64px] w-full bg-[#8f69cb]/20 text-center text-sm backdrop-blur-md">
          <div className="flex flex-col">
            <a
              className="p-5 hover:bg-[#593a8b]/60 hover:text-white"
              href="#home"
            >
              Home
            </a>
            <a
              className="p-5 hover:bg-[#593a8b]/60 hover:text-white"
              href="#features"
            >
              Features
            </a>
            <a
              className="p-5 hover:bg-[#593a8b]/60 hover:text-white"
              href="#pricing"
            >
              Pricing
            </a>
            <a
              className="p-5 hover:bg-[#593a8b]/60 hover:text-white"
              href="#contact"
            >
              Contact Us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
