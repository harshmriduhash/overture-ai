import { Check, Mail, MapPin, Phone, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendMessage } from "@/lib/contact-message";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const contents = [
  { title: "Our Location", icon: MapPin, value: "Delhi, India" },
  { title: "Phone Number", icon: Phone, value: "9876543210" },
  { title: "Email Address", icon: Mail, value: "ABC@gmail.com" },
];

const formSchema = z.object({
  fullname: z.string().min(1, {
    message: "Name field has to be filled.",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email field has to be filled.",
    })
    .email("This is not a valid email."),
  subject: z.string().min(1, {
    message: "Subject field has to be filled.",
  }),
  message: z.string().min(1, {
    message: "Message field has to be filled.",
  }),
});

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await sendMessage(values);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.log(error);
      setIsFailed(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsSuccess(false);
        setIsFailed(false);
      }, 2000);
    }
  };

  return (
    <div className="my-12 space-y-5 px-5 md:space-y-8 lg:my-20 lg:px-0">
      <div className="text-center">
        <h3 className="text-sm font-bold uppercase md:text-base">Contact Us</h3>
        <h2 className="text-2xl font-bold md:text-3xl lg:text-5xl">
          Get In Touch With Us
        </h2>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Left */}
        <div className="flex flex-1 flex-col gap-y-4">
          <p className="text-justify text-sm md:mb-4 md:text-start md:text-[15px] lg:text-base">
            We’d love to hear from you! Whether you have questions, need
            assistance, or just want to share your thoughts, we’re here to help.
            Don’t hesitate to reach out to us through any of the channels below.
          </p>
          {contents.map((content) => (
            <div
              className="flex items-start gap-3 md:gap-4"
              key={content.title}
            >
              <div className="w-fit rounded-md bg-white/75 p-3 md:p-[14px]">
                <content.icon className="h-5 w-5 text-[#714ab0] md:h-7 md:w-7" />
              </div>
              <div>
                <h2 className="text-sm font-bold md:text-[15px] lg:text-base">
                  {content.title}
                </h2>
                <p className="text-xs md:text-sm">{content.value}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Right */}
        <div className="flex-1 rounded-xl border border-[#593a8b] bg-white p-4 md:p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 sm:space-y-4"
            >
              <div className="flex flex-col gap-x-3 sm:flex-row">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm">
                        Fullname
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your fullname"
                          autoComplete="off"
                          {...field}
                          className="text-xs text-black focus-visible:ring-0 focus-visible:ring-transparent sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your email"
                          autoComplete="off"
                          {...field}
                          className="text-xs text-black focus-visible:ring-0 focus-visible:ring-transparent sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your subject"
                        autoComplete="off"
                        {...field}
                        className="text-xs text-black focus-visible:ring-0 focus-visible:ring-transparent sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your message"
                        autoComplete="off"
                        {...field}
                        className="text-xs text-black focus-visible:ring-0 focus-visible:ring-transparent sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="custom"
                className="text-xs md:text-sm"
                disabled={isLoading}
              >
                <Send className="h-[14px] w-[14px] md:h-4 md:w-4" />
                Send Message
              </Button>
              <div
                className={cn(
                  "flex items-center gap-x-2 text-green-500",
                  isSuccess ? "" : "hidden",
                )}
              >
                <Check className="h-4 w-4" />
                <p className="text-xs">Message sent successfully</p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-x-2 text-red-500",
                  isFailed ? "" : "hidden",
                )}
              >
                <X className="h-4 w-4" />
                <p className="text-xs">Message failed to send</p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
