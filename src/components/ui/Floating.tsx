"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { IconArrow, IconChat } from "./Icons";

const floatingVariants = cva(
  "w-[4.75rem] h-[4.75rem] border-[0.091rem] px-4 border-primary-500 rounded-full text-primary-500 flex-center-center flex-col z-20",
  {
    variants: {
      variant: {
        top: "text-lg font-normal tracking-[-1%]",
        chat: "",
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
        {variant === "top" ? <IconArrow /> : <IconChat />}
        {variant === "top" && "TOP"}
      </button>
    );
  },
);
Floating.displayName = "Floating";

export { Floating };
