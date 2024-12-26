import Heading from "@/components/heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleHelp } from "lucide-react";

type AccordionItemType = {
  id: string;
  header: string;
  content: JSX.Element;
};

const accordionItems: AccordionItemType[] = [
  {
    id: "item-1",
    header:
      "What is the difference between the Free Plan, Pro Plan, and Unlimited Plan?",
    content: (
      <>
        <p>
          All plans provide access to the same features: conversation, image
          generation, video generation, code generation, and music generation.
        </p>
        <p>The difference lies in the number of credits provided:</p>
        <ul>
          <li>
            <strong>Free Plan:</strong> 5 credits per month.
          </li>
          <li>
            <strong>Pro Plan:</strong> 50 credits per month.
          </li>
          <li>
            <strong>Unlimited Plan:</strong> Unlimited credits, no restrictions.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "item-2",
    header: "How do I upgrade to the Pro Plan or Unlimited Plan?",
    content: (
      <>
        <p>
          You can upgrade to the <strong>Pro Plan</strong> or{" "}
          <strong>Unlimited Plan</strong> by visiting the{" "}
          <strong>Subscription</strong> page. If you click the
          &quot;Upgrade&quot; button in the sidebar, you’ll be redirected to the
          subscription page where you can see all available plans, along with
          the plan you currently have.
        </p>
        <p>
          From there, you can select the desired plan and follow the steps to
          complete your subscription.
        </p>
      </>
    ),
  },
  {
    id: "item-3",
    header:
      "What happens if I run out of credits on the Free Plan or Pro Plan?",
    content: (
      <>
        <p>
          If you run out of credits on the <strong>Free Plan</strong> or{" "}
          <strong>Pro Plan</strong>, you won’t be able to use the features until
          your credits reset at the start of the next month or you upgrade to a
          higher plan.
        </p>
        <p>
          You can upgrade at any time by visiting the{" "}
          <strong>Subscription</strong> page.
        </p>
      </>
    ),
  },
  {
    id: "item-4",
    header: "Why does video or image generation sometimes fail?",
    content: (
      <>
        <p>
          Video or image generation might fail if the process takes too long to
          complete due to high server load or other technical issues. While most
          requests are completed successfully, occasional delays may result in
          failures.
        </p>
      </>
    ),
  },
  {
    id: "item-5",
    header: "Are my credits deducted for failed requests?",
    content: (
      <>
        <p>
          Yes, credits are deducted even if a request fails. This is because the
          system processes the request regardless of its outcome. We recommend
          retrying the request in such cases.
        </p>
      </>
    ),
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col pb-8 md:pb-10">
      <Heading
        title="Help & FAQ"
        description="Find answers to common questions and tips for using our AI features"
        icon={CircleHelp}
      />
      <Accordion type="single" collapsible className="w-full space-y-3">
        {accordionItems.map((item) => (
          <AccordionItem
            value={item.id}
            className="rounded-lg border-[#593a8b] bg-white"
            key={item.id}
          >
            <AccordionTrigger className="text-start text-sm md:text-[15px]">
              {item.header}
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full border"></div>
              <div className="space-y-3 px-5 pt-4">{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
