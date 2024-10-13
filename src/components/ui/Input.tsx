"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isErrored?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ isErrored, className, type, ...props }, ref) => {
    const [isValid, setIsValid] = useState(false);

    const onBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value && !isErrored) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };

    useEffect(() => {
      if (isErrored) {
        setIsValid(false);
      }
    }, [isErrored]);

    return (
      <input
        type={type}
        onBlur={onBlurInput}
        className={cn(
          "h-[3.188rem] w-full rounded-lg border p-3 text-lg font-medium text-gray-dark outline-none placeholder:font-medium placeholder:text-gray-light disabled:cursor-not-allowed disabled:bg-bggray-light",
          className,
          isValid
            ? "bg-purple-light focus:bg-transparent"
            : isErrored
              ? "bg-red-light"
              : "bg-transparent focus:bg-transparent",
          isErrored
            ? "border-accent-red"
            : "border-line-default focus:border-primary-500",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
