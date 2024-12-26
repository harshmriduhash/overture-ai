import { useState } from "react";
import {
  CircleCheck,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const contents = [
  {
    label: "Conversation",
    icon: MessageSquare,
    features: [
      "Real-time Chat",
      "AI-based Suggestions",
      "Language Translation",
    ],
    description: "Engage in real-time conversations with AI.",
    image: "/assets/feature-conversation.png",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    features: ["High-quality Images", "Custom Styles", "Batch Processing"],
    description: "Generate stunning images tailored to your needs.",
    image: "/assets/feature-image.png",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    features: ["Customizable Templates", "HD Quality", "Fast Rendering"],
    description: "Create high-quality videos effortlessly.",
    image: "/assets/feature-video.png",
  },
  {
    label: "Music Generation",
    icon: Music,
    features: ["Custom Genres", "AI Compositions", "Seamless Looping"],
    description: "Compose beautiful music with AI assistance.",
    image: "/assets/feature-music.png",
  },
  {
    label: "Code Generation",
    icon: Code,
    features: ["Code Snippets", "Syntax Correction", "Custom Algorithms"],
    description: "Generate optimized code for your projects.",
    image: "/assets/feature-code.png",
  },
];

export default function FeaturePage() {
  const [activeContent, setActiveContent] = useState(contents[0]);

  return (
    <div className="my-12 space-y-8 px-5 lg:my-20 lg:px-0">
      <div className="text-center">
        <h3 className="text-sm font-bold uppercase md:text-base">Features</h3>
        <h2 className="text-2xl font-bold md:text-3xl lg:text-5xl">
          Unlock the Power of Generative AI
        </h2>
        <p className="mt-2 text-sm md:mt-4 md:text-[15px] lg:text-base">
          Elevate your creative process with AI-driven features tailored for
          creators
        </p>
      </div>
      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm lg:gap-4 lg:text-[15px]">
        {contents.map((content) => (
          <button
            key={content.label}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 md:px-6 md:py-3 lg:px-10 ${
              activeContent.label === content.label
                ? "bg-[#714ab0] text-white"
                : "bg-[#ece5ff] text-[#714ab0]"
            }`}
            onClick={() => setActiveContent(content)}
          >
            <content.icon
              className={`h-5 w-5 lg:h-6 lg:w-6 ${
                activeContent.label === content.label
                  ? "text-white"
                  : "text-[#714ab0]"
              }`}
            />
            {content.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="grid grid-cols-12 gap-6 rounded-lg border border-[#593a8b] bg-white p-4 md:p-5 lg:p-8">
        <div className="col-span-12 lg:col-span-4">
          <h1 className="text-xl font-bold lg:text-2xl">
            {activeContent.description}
          </h1>
          <p className="mt-4 text-sm font-semibold md:text-base">
            Features include:
          </p>
          <div className="mt-2 space-y-2">
            {activeContent.features.map((feature) => (
              <div key={feature} className="flex items-center gap-x-2">
                <CircleCheck className="h-3 w-3 flex-shrink-0 text-[#714ab0] md:h-4 md:w-4" />
                <p className="text-sm lg:text-[15px]">{feature}</p>
              </div>
            ))}
          </div>
          <Link href="/sign-up">
            <Button variant="custom" className="mt-4 text-xs md:text-sm">
              Start Exploring Now
            </Button>
          </Link>
        </div>
        <div className="col-span-12 overflow-hidden rounded-lg border border-neutral-300 lg:col-span-8">
          <Image
            alt="feature-image"
            src={activeContent.image}
            width={1280}
            height={720}
          />
        </div>
      </div>
    </div>
  );
}
