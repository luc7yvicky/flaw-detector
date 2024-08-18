"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const trackStyles = {
  active: "bg-primary-500 border-4 border-primary-500 justify-end",
  inactive: "bg-bggray-dark border-4 border-bggray-dark justify-start",
};

const thumbStyles = {
  active: "top-0 left-0 bg-white",
  inactive: "top-0 right-0 bg-purple-light",
};

function SwitchThumb({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={cn(
        "relative h-6 w-6 rounded-[50%] transition-transform duration-300 active:scale-110 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:bg-opacity-50",
        isActive ? thumbStyles["active"] : thumbStyles["inactive"],
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

export default function Switch({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={cn(
        "flex h-8 w-14 cursor-pointer items-center rounded-[6.25rem]",
        isActive ? trackStyles["active"] : trackStyles["inactive"],
        className,
      )}
      onClick={() => setIsActive(!isActive)}
      {...props}
    >
      <SwitchThumb isActive={isActive} />
    </button>
  );
}
