import { IconClose, IconRoundedDoc } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const inputChipVariants = cva(
  "inline-flex items-center justify-between min-w-[13.813rem] py-2 px-3 h-[2.188rem] text-base font-normal tracking-[-0.01em] leading-[1.216rem] text-gray-dark rounded-lg",
);

export type InputChipProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inputChipVariants> & {
    percentage?: string;
    selected?: boolean;
  };

const InputChip: React.FC<InputChipProps> = ({
  percentage,
  selected = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        inputChipVariants({
          className,
        }),
        selected ? "bg-purple-light" : "bg-transparent",
      )}
      {...props}
    >
      <IconRoundedDoc className="text-[#848484]" />
      {children}
      {percentage && <p className="font-medium">{percentage}</p>}
      <button>
        <IconClose />
      </button>
    </div>
  );
};
InputChip.displayName = "InputChip";

export { InputChip };
