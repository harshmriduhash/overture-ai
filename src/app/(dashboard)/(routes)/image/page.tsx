"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, getRandomHeader } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";

import { ImageIcon, Download } from "lucide-react";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import Empty from "@/components/empty";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { toast } from "sonner";
import ChatForm from "@/components/chat-form";

type MessageParam = {
  role: "user" | "assistant";
  content: string | { header: string; b64_json: string[] };
};

const headerVariations = [
  "Here are your variations of images generated from your prompt. Let us know if you need more ideas!",
  "Certainly! Your visual representation has been created based on the provided prompt. Please review the images below.",
  "Got it! We've created some image variations from your prompt. Check them out below!",
  "Here you go! These images were generated using your input. Hope they inspire you!",
  "These are the images generated from the prompt you provided. Feel free to explore them below.",
];

export default function ImagePage() {
  const { userName } = useUserStore();
  const { userSubscription, setUserSubscription } = useUserSubscriptionStore();

  const [messages, setMessages] = useState<MessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const endMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("imageMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("imageMessages", JSON.stringify(messages));
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
      const response = await fetch("/api/image", {
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

      const data = (await response.json()) as { b64_json: string }[];

      const assistantMessage: MessageParam = {
        role: "assistant",
        content: {
          header: getRandomHeader(headerVariations),
          b64_json: data.map(
            (item) => `data:image/png;base64,${item.b64_json}`,
          ),
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
        title="Image Generation"
        description="Transform your ideas into stunning visuals with our cutting-edge image generator"
        icon={ImageIcon}
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
                    <div className="mt-2 grid w-fit grid-cols-1 gap-4 sm:grid-cols-2">
                      {typeof message.content !== "string" &&
                        message.content.b64_json.map((image, idx) => (
                          <div
                            key={`image-${idx}`}
                            className="relative aspect-square h-64 max-h-full w-64 max-w-full rounded-lg border border-transparent transition-colors duration-100 sm:h-72 sm:w-72"
                          >
                            <div className="absolute right-2 top-2 z-10 flex items-center justify-center rounded-lg bg-[#593a8b] p-2 transition-all duration-200 hover:bg-[#462e6f]">
                              <a href={image} download={`image-${idx}.png`}>
                                <Download className="h-5 w-5 text-white" />
                              </a>
                            </div>
                            <Image
                              alt="Generated"
                              src={image}
                              layout="fill"
                              className="rounded-lg object-cover"
                            />
                          </div>
                        ))}
                    </div>
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
