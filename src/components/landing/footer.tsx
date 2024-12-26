import Image from "next/image";
import { Input } from "../ui/input";
import { ArrowRight } from "lucide-react";

export default function FooterPage() {
  return (
    <div>
      <div className="mt-8 flex flex-col items-center justify-between gap-y-14 bg-[#8f69cb]/20 px-4 py-4 md:px-6 lg:mb-8 lg:rounded-xl">
        <div className="flex w-full flex-col items-end justify-between gap-4 sm:flex-row">
          {/* Left */}
          <div className="flex w-full flex-col gap-y-2">
            <div className="relative h-7 w-7 md:h-8 md:w-8">
              <Image alt="logo" fill src="/assets/logo.png" />
            </div>
            <h2 className="text-sm font-bold uppercase md:text-[15px] lg:text-base">
              Join a Newsletter
            </h2>
            <div className="flex items-center gap-x-2">
              <Input
                className="w-52 border-0 text-xs outline-none focus-visible:ring-transparent md:w-[250px] md:text-sm"
                disabled
                placeholder="Enter your email here"
              />
              <div className="flex h-[40px] items-center justify-center rounded-md bg-[#714ab0]/20 p-2">
                <ArrowRight className="h-4 w-4 text-[#714ab0] md:h-5 md:w-5 lg:h-[25px] lg:w-[25px]" />
              </div>
            </div>
          </div>
          {/* Right */}
          <div className="flex w-full flex-col gap-y-2 sm:items-end">
            <div className="flex items-center gap-x-4">
              <a
                href="https://github.com/Firkhie"
                target="_blank"
                className="relative h-5 w-5 md:h-6 md:w-6"
              >
                <Image alt="logo" fill src="/assets/github.svg" />
              </a>
              <a
                href="https://www.linkedin.com/in/firdigalfalakhi/"
                target="_blank"
                className="relative h-5 w-5 md:h-6 md:w-6"
              >
                <Image alt="logo" fill src="/assets/linkedin.svg" />
              </a>
            </div>
            <p className="text-xs md:text-sm">
              © 2024 Firdig Alfalakhi. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
