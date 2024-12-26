"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, getRandomHeader } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";

import { Video } from "lucide-react";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import Empty from "@/components/empty";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { toast } from "sonner";
import ChatForm from "@/components/chat-form";

type MessageParam = {
  role: "user" | "assistant";
  content: string | { header: string; videoBase64: string };
};

const headerVariations = [
  "Discover the cinematic experience created from your prompt. Dive into your unique video!",
  "Your video masterpiece is ready! Witness your imagination brought to screen.",
  "We’ve turned your idea into a captivating visual journey. Watch your video below!",
  "Here’s a custom video generated just for you. Enjoy the creative visuals we’ve crafted!",
  "Your vision is now a reality! Explore the dynamic video we’ve made based on your input.",
];

const isVideoMessage = (
  content: string | { header: string; videoBase64: string },
): content is { header: string; videoBase64: string } => {
  return (
    (content as { header: string; videoBase64: string }).videoBase64 !==
    undefined
  );
};

export default function VideoPage() {
  const { userName } = useUserStore();
  const { userSubscription, setUserSubscription } = useUserSubscriptionStore();

  const [messages, setMessages] = useState<MessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const endMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("videoMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("videoMessages", JSON.stringify(messages));
    }
    endMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formSchema = z.object({
    prompt: z.string().min(1, {
      message: "Prompt is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const userMessage: MessageParam = { role: "user", content: values.prompt };
    setMessages((currentMessages) => [...currentMessages, userMessage]);

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: values.prompt, userSubscription }),
      });

      if (response.status === 403) {
        toast(
          "You've reached your monthly limit. Please upgrade your plan or wait until next month for more credits.",
          {
            style: { backgroundColor: "#FFD2D2", color: "#D8000C" },
          },
        );
        setMessages((currentMessages) => currentMessages.slice(0, -1));
        return;
      }

      const data = (await response.json()) as { videoBase64: string };

      const assistantMessage: MessageParam = {
        role: "assistant",
        content: {
          header: getRandomHeader(headerVariations),
          videoBase64: data.videoBase64,
        },
      };
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    } finally {
      setIsLoading(false);
      form.reset();
      inputRef.current?.focus();

      if (userSubscription && userSubscription.credits > 0) {
        setUserSubscription({
          ...userSubscription,
          credits: userSubscription.credits - 1,
        });
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Heading
        title="Video Generation"
        description="Bring your concepts to life with visually captivating videos crafted by our AI"
        icon={Video}
      />
      <div className="h-full flex-1 overflow-y-auto rounded-t-lg border border-[#593a8b] bg-white p-4 scrollbar-hide">
        <div className="h-full space-y-3">
          {messages.length == 0 && !isLoading && (
            <Empty description="No conversation started." />
          )}
          {messages.map((message) => (
            <div
              key={String(message.content)}
              className={cn(
                "flex gap-x-3 rounded-lg p-5",
                message.role === "user"
                  ? "border border-black/10 bg-white"
                  : "bg-muted",
              )}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <div className="flex w-full flex-col gap-y-[6px]">
                <p className="font-semibold leading-none">
                  {message.role === "user" ? userName : "OvertureAI"}
                </p>
                {message.role === "user" ? (
                  <p className="text-sm md:text-[15px]">
                    {String(message.content)}
                  </p>
                ) : (
                  <>
                    <p className="text-sm md:text-[15px]">
                      {typeof message.content !== "string" &&
                        message.content.header}
                    </p>
                    {isVideoMessage(message.content) && (
                      <video
                        controls
                        className="mt-2 w-full rounded-lg border border-black"
                      >
                        <source
                          src={message.content.videoBase64}
                          type="video/mp4"
                        />
                        Your browser does not support the audio element.
                      </video>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          {isLoading && <Loader />}
          <div ref={endMessageRef} />
        </div>
      </div>
      <ChatForm
        inputRef={inputRef}
        isLoading={isLoading}
        onSubmit={onSubmit}
        formInstance={form}
      />
    </div>
  );
}
