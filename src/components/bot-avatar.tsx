import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

export default function BotAvatar() {
  return (
    <Avatar className="h-7 w-7">
      <Image alt="logo" fill src="/assets/logo.png" />
    </Avatar>
  );
}
