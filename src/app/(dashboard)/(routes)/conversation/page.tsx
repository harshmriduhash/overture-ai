"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";

import { MessageSquare } from "lucide-react";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import Empty from "@/components/empty";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import ChatForm from "@/components/chat-form";
import { toast } from "sonner";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
});

export default function ConversationPage() {
  const { userName } = useUserStore();
  const { userSubscription, setUserSubscription } = useUserSubscriptionStore();

  const [messages, setMessages] = useState<MessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const endMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("conversationMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("conversationMessages", JSON.stringify(messages));
    }
    endMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: userMessage, userSubscription }),
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

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      setIsLoading(false);

      const assistantMessage: MessageParam = { role: "assistant", content: "" };
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);

      let messageBuffer = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        messageBuffer += decoder.decode(value, { stream: true });
        setMessages((currentMessages) => {
          const updatedMessages = [...currentMessages];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: messageBuffer,
          };
          return updatedMessages;
        });
      }
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
        title="Conversation"
        description="Engage in natural, dynamic interactions powered by our conversational AI"
        icon={MessageSquare}
      />
      <div className="h-full flex-1 overflow-auto rounded-t-lg border border-[#593a8b] bg-white p-4 scrollbar-hide">
        <div className="h-full space-y-3">
          {messages.length == 0 && !isLoading && (
            <Empty description="No conversation started." />
          )}
          {messages.map((message) => (
            <div
              key={String(message.content)}
              className={cn(
                "flex w-full gap-x-3 rounded-lg p-5",
                message.role === "user"
                  ? "border border-black/10 bg-white"
                  : "bg-muted",
              )}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <div className="flex flex-col gap-y-[6px]">
                <p className="text-sm font-semibold leading-none md:text-[15px]">
                  {message.role === "user" ? userName : "OvertureAI"}
                </p>
                <p className="text-sm md:text-[15px]">
                  {String(message.content)}
                </p>
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
