import Image from "next/image";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-3 rounded-lg bg-[#ece5ff]/90 p-4">
      <div className="relative h-10 w-10 animate-spin">
        <Image alt="logo" src="/assets/logo.png" fill />
      </div>
      <p className="text-sm">OvertureAI is thinking...</p>
    </div>
  );
}
