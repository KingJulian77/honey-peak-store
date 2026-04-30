import { cn } from "@/lib/utils";

interface PlaceholderProps {
  className?: string;
  rounded?: boolean;
  textSize?: string;
}

const Placeholder = ({ className, rounded = true, textSize = "text-5xl md:text-7xl" }: PlaceholderProps) => {
  return (
    <div
      className={cn(
        "placeholder-tile w-full h-full",
        rounded && "rounded-2xl",
        textSize,
        className
      )}
      aria-hidden="true"
    >
      !!!
    </div>
  );
};

export default Placeholder;
