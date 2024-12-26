"use client";

import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";

import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
} from "lucide-react";
import Heading from "@/components/heading";

const contents = [
  { label: "Conversation", icon: MessageSquare, href: "/conversation" },
  { label: "Image Generation", icon: ImageIcon, href: "/image" },
  { label: "Video Generation", icon: VideoIcon, href: "/video" },
  { label: "Music Generation", icon: Music, href: "/music" },
  { label: "Code Generation", icon: Code, href: "/code" },
];

export default function DashboardPage() {
  const { userName } = useUserStore();
  const router = useRouter();

  return (
    <div className="flex flex-col pb-8 md:pb-10">
      <Heading
        title={`Hello, ${userName}`}
        description="Discover a variety of powerful AI SaaS features designed just for you.
          Choose a tool below and unleash the full potential of AI!"
      />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {contents.map((content) => (
          <div
            onClick={() => router.push(content.href)}
            key={content.href}
            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow-sm transition hover:bg-white/30"
          >
            <div className="flex w-full flex-col items-center gap-3">
              <div className="flex w-full items-center justify-between">
                <div className="font-semibold">{content.label}</div>
                <div className="rounded-full border bg-[#714ab0]/20 p-1">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <div className="flex w-full items-center justify-center rounded-md bg-[#714ab0]/20 p-7">
                <content.icon className="h-24 w-24 text-[#714ab0] xl:h-32 xl:w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
