"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { IconClose } from "./Icons";

const switchVariants = cva("flex h-8 w-14 items-center rounded-[6.25rem]", {
  variants: {
    variant: {
      default: "cursor-pointer",
      disabled:
        "border-2 border-primary-200 bg-purple-light opacity-50 cursor-not-allowed",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function SwitchThumb({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={cn(
        "relative h-6 w-6 rounded-[50%] transition-transform duration-300 active:scale-110 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:bg-opacity-50",
        isActive ? "bg-white" : "bg-purple-light",
      )}
    >
      {/* ::after */}
      <div
        className="absolute inset-0 rounded-[50%] bg-primary-300 opacity-0 transition-opacity duration-300 hover:opacity-[0.12]"
        style={{
          width: "2.5rem",
          height: "2.5rem",
          top: "-0.5rem",
          left: "-0.5rem",
        }}
      />
    </div>
  );
}

function SwitchDisabledThumb() {
  return (
    <div
      className={cn(
        "relative h-6 w-6 rounded-[50%] transition-transform duration-300 active:scale-110 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:bg-opacity-50",
        "flex-center-center ml-[0.125rem] bg-[#1D1B20]",
      )}
    >
      <IconClose className="h-[1rem] w-[1rem] fill-purple-light opacity-50" />
    </div>
  );
}

export default function Switch({
  variant,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof switchVariants>) {
  const [isActive, setIsActive] = useState(false);

  const trackStyles = {
    active: "bg-primary-500 border-4 border-primary-500 justify-end",
    inactive: "bg-bggray-dark border-4 border-bggray-dark justify-start",
  };

  return (
    <button
      className={cn(
        switchVariants({ variant }),
        variant !== "disabled" &&
          (isActive ? trackStyles["active"] : trackStyles["inactive"]),
        className,
      )}
      onClick={() => variant !== "disabled" && setIsActive(!isActive)}
      disabled={variant === "disabled"}
      {...props}
    >
      {variant === "disabled" ? (
        <SwitchDisabledThumb />
      ) : (
        <SwitchThumb isActive={isActive} />
      )}
    </button>
  );
}
