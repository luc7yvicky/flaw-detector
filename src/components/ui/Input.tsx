"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isErrored?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value: initialValue, isErrored, className, type, ...props }, ref) => {
    const [value, setValue] = useState(initialValue || "");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      if (initialValue !== undefined) {
        setValue(initialValue);
      }
    }, [initialValue]);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
    };

    const onBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value && !isErrored) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };

    return (
      <input
        value={value}
        type={type}
        onChange={onChangeInput}
        onBlur={onBlurInput}
        className={cn(
          "h-[51px] w-full rounded-lg border p-3 text-lg font-medium text-gray-dark outline-none placeholder:font-medium disabled:cursor-not-allowed disabled:bg-bggray-light",
          className,
          isValid
            ? "bg-purple-light focus:bg-transparent"
            : isErrored
              ? "bg-red-light"
              : "bg-transparent focus:bg-transparent",
          isErrored
            ? "border-accent-red placeholder:text-accent-red"
            : "border-line-default placeholder:text-gray-light focus:border-primary-500",
          value && !isErrored && "bg-purple-light focus:bg-transparent",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
