import { cn } from "@/lib/utils";

const calculate = (value: number): number => {
  return value * 100;
};

export default function ProgressBar({
  className,
  value = 0,
  indicatorClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  indicatorClassName?: string;
}) {
  const percentage = calculate(value);

  return (
    <div
      className={cn(
        "h-[0.75rem] w-[87rem] rounded-lg bg-line-light",
        className,
      )}
      {...props}
      role="progress"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-lg bg-accent-green", indicatorClassName)}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
