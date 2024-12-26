"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import markdownit from "markdown-it";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import useUserSubscriptionStore from "@/store/useUserSubscriptionStore";

import { Check, Code, Copy } from "lucide-react";
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

export default function CodePage() {
  const { userName } = useUserStore();
  const { userSubscription, setUserSubscription } = useUserSubscriptionStore();

  const [messages, setMessages] = useState<MessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const endMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("codeMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("codeMessages", JSON.stringify(messages));
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
      const response = await fetch("/api/code", {
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
      const md = markdownit();

      setIsLoading(false);

      const assistantMessage: MessageParam = { role: "assistant", content: "" };
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);

      let messageBuffer = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        messageBuffer += decoder.decode(value, { stream: true });
        const renderedMessage = md.render(messageBuffer);

        setMessages((currentMessages) => {
          const updatedMessages = [...currentMessages];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: renderedMessage,
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

  const handleCopy = async () => {
    try {
      const lastMessage = messages[messages.length - 1];
      const htmlContent = lastMessage.content;

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent as string;

      const textContent = tempDiv.textContent || tempDiv.innerText;

      if (textContent) {
        await navigator.clipboard.writeText(textContent);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      }
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Heading
        title="Code Generation"
        description="Generate high-quality, efficient code effortlessly with our advanced model"
        icon={Code}
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
                <p className="text-sm font-semibold leading-none md:text-[15px]">
                  {message.role === "user" ? userName : "OvertureAI"}
                </p>
                {message.role === "user" ? (
                  <p className="text-sm md:text-[15px]">
                    {String(message.content)}
                  </p>
                ) : (
                  <div className="mr-10 mt-2 overflow-hidden rounded-lg text-white">
                    <div className="flex items-center justify-between bg-[#4b4b4b] px-5 py-3 text-xs">
                      <p>Generated Code</p>
                      <div
                        className="flex cursor-pointer items-center gap-x-2"
                        onClick={handleCopy}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-4 w-4" />
                            <p>Copied</p>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <p>Copy Code</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="overflow-auto bg-[#282828] p-5 text-sm md:text-[15px]"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
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
