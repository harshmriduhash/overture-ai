import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import TypewriterComponent from "typewriter-effect";

export default function LandingHero() {
  return (
    <div className="mb-12 mt-28 px-5 md:mt-32 lg:mb-20 lg:mt-52 lg:px-0">
      <div className="space-y-5 text-center md:space-y-8">
        <div className="space-y-5 text-3xl font-bold md:text-4xl lg:text-5xl">
          <h1>
            Transform your workflow and creativity with cutting-edge AI tools
            for
          </h1>
          <div className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            <TypewriterComponent
              options={{
                strings: [
                  "Chatbot.",
                  "Photo Generation.",
                  "Music Generation.",
                  "Video Generation.",
                  "Code Generation.",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
        <p className="mx-auto text-sm md:text-[15px] lg:text-base">
          OvertureAI empowers you with cutting-edge AI tools to create stunning
          images, generate music, produce videos, build code, and enhance
          customer interactions with chatbots. Experience seamless creativity
          and productivity like never before.
        </p>
        <div className="space-x-2 pb-5 md:pb-8">
          <Link href="/sign-up">
            <Button variant="custom" className="text-xs md:text-sm">
              Sign Up
            </Button>
          </Link>
          <a href="#contact">
            <Button variant="secondary" className="text-xs md:text-sm">
              Contact Us
            </Button>
          </a>
        </div>
        <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl">
          <Image
            alt="landing-image"
            src="/assets/landing-image.png"
            width={1280}
            height={720}
          />
        </div>
      </div>
    </div>
  );
}
