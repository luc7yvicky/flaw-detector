"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { IconArrow, IconChat } from "./Icons";

const floatingVariants = cva(
  "w-[4.75rem] h-[4.75rem] border-[0.091rem] border-primary-500 rounded-full text-primary-500 flex-center-center flex-col z-20",
  {
    variants: {
      variant: {
        top: "text-lg font-normal tracking-[-1%]",
        chat: "p-[1.281rem]",
      },
    },
  },
);

export type FloatingProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof floatingVariants> & {};

const Floating = React.forwardRef<HTMLButtonElement, FloatingProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        type="button"
        className={cn(
          floatingVariants({ variant }),
          className,
          "bg-white text-primary-500 transition-all duration-75 hover:bg-primary-500 hover:text-white",
        )}
        ref={ref}
        {...props}
      >
        {variant === "top" ? (
          <IconArrow className="h-7 w-7" />
        ) : (
          <IconChat className="h-[2.103rem] w-[2.103rem]" />
        )}
        {variant === "top" && <span>TOP</span>}
      </button>
    );
  },
);
Floating.displayName = "Floating";

export { Floating };
