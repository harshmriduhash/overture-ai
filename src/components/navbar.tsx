import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";

export default function Navbar() {
  return (
    <div className="flex h-full items-center justify-between px-4">
      <MobileSidebar />
      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
}
