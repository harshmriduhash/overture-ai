interface HeadingProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function Heading({
  title,
  description,
  icon: Icon,
}: HeadingProps) {
  return (
    <div className="mb-5 flex items-center gap-3 md:mb-8">
      {Icon && (
        <div className="w-fit rounded-md bg-[#714ab0]/20 p-2">
          <Icon className="h-8 w-8 text-[#714ab0] md:h-9 md:w-9" />
        </div>
      )}
      <div>
        <h2 className="text-lg font-bold md:text-xl lg:text-2xl">{title}</h2>
        <p className="text-sm text-muted-foreground lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
