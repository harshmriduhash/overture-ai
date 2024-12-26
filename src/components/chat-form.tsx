import { RefObject } from "react";

import { SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface ChatFormProps {
  onSubmit: (data: { prompt: string }) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  formInstance: any;
}

export default function ChatForm({
  inputRef,
  isLoading,
  onSubmit,
  formInstance: form,
}: ChatFormProps) {
  return (
    <div className="space-y-2 border-l border-r border-[#593a8b] bg-white p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-14 items-center justify-between rounded-xl border-2 border-[#593a8b] px-4"
        >
          <FormField
            name="prompt"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl className="m-0 p-0">
                  <Input
                    {...field}
                    ref={inputRef}
                    autoComplete="off"
                    className="border-0 text-sm outline-none focus-visible:ring-transparent md:text-[15px]"
                    disabled={isLoading}
                    placeholder="Send a message.."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={isLoading} size="chat" variant="custom">
            <SendHorizontal />
          </Button>
        </form>
      </Form>
      <p className="text-center text-xs">
        OvertureAI can make mistakes. Consider checkng important information.
      </p>
    </div>
  );
}
