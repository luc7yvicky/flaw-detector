import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const labelVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full tracking-[-0.01em] text-base",
  {
    variants: {
      variant: {
        // 취약점 DB
        hot: "px-3 py-2 h-[2.188rem] bg-accent-red text-white font-semibold leading-[1.216rem]",
        new: "px-3 py-2 h-[2.188rem] bg-accent-blue text-white font-semibold leading-[1.216rem]",
        unselected:
          "px-3 py-2 h-[2.188rem] bg-[#E8E8E8] text-[#ADADAD] font-semibold leading-[1.216rem]",

        // 취약점 DB - grid label
        index:
          "px-[0.5rem] py-[0.75rem] h-[2.625rem] bg-white font-normal border border-gray-dark leading-[1.627rem] rounded-full",

        // MY 저장소 - UI 스크랩
        clipping:
          "px-3 py-2 h-[2.188rem] bg-bggray-light text-gray-default font-semibold leading-[1.216rem]",
        "clipping-notify":
          "px-3 py-2 h-[2.188rem] bg-primary-50 text-primary-500 font-semibold leading-[1.216rem]",
        "clipping-warning":
          "px-3 py-2 h-[2.188rem] bg-red-light text-accent-red font-semibold leading-[1.216rem]",

        // MY 저장소 - 메인 (로그인 o)
        outline:
          "px-[0.75rem] py-[0.438rem] h-[1.875rem] bg-white font-normal border border-gray-dark leading-4",

        // MY 저장소 - UI 검출된 파일
        "outline-primary":
          "px-[0.75rem] py-[0.438rem] h-[1.875rem] bg-purple-light text-primary-500 font-normal border border-primary-300 leading-4",
      },
    },
    defaultVariants: {
      variant: "hot",
    },
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label: React.FC<LabelProps> = ({
  className,
  variant,
  children,
  ...props
}) => {
  return (
    <span className={cn(labelVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
};

Label.displayName = "Label";

export { Label };
