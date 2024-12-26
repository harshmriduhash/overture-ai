import Image from "next/image";

export default function BannerPage() {
  return (
    <div className="my-8 space-y-8 px-5 text-center md:my-12 lg:my-20 lg:px-0">
      <h2 className="text-sm font-bold uppercase md:text-base">
        Powered by Industry-Leading AI Technologies
      </h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-16">
        <Image
          src="/assets/openai-logo.svg"
          alt="OpenAI Logo"
          width={128}
          height={48}
          className="h-9 w-24 grayscale md:h-12 md:w-32"
        />

        <Image
          src="/assets/claude-logo.svg"
          alt="Claude Logo"
          width={128}
          height={48}
          className="h-9 w-24 grayscale md:h-12 md:w-32"
        />

        <Image
          src="/assets/replicate-logo.svg"
          alt="Replicate Logo"
          width={128}
          height={48}
          className="h-9 w-24 grayscale md:h-12 md:w-32"
        />
      </div>
    </div>
  );
}
