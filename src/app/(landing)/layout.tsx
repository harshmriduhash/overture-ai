import { ArrowUp } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#be9cf6] via-[#e2dcf3] to-[#e2dcf3]">
      <div className="h-full lg:mx-auto lg:max-w-screen-lg xl:max-w-screen-xl">
        {children}
      </div>
      <a
        href="#home"
        className="fixed bottom-4 right-4 z-50 transform rounded-full bg-[#8f69cb] p-2 text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#6b4aa0] md:p-3"
      >
        <ArrowUp className="h-4 w-4 md:h-6 md:w-6" />
      </a>
    </div>
  );
}
