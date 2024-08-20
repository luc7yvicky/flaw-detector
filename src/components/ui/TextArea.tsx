"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

export type TextAreaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    isErrored?: boolean;
  };

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ isErrored, className, ...props }, ref) => {
    const [isValid, setIsValid] = useState(false);

    const onBlurTextArea = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (e.target.value && !isErrored) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };

    return (
      <textarea
        onBlur={onBlurTextArea}
        className={cn(
          "h-[220px] w-full resize-none rounded-lg border p-3 text-lg font-medium text-gray-dark outline-none placeholder:font-medium placeholder:text-gray-light disabled:cursor-not-allowed disabled:bg-bggray-light",
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
TextArea.displayName = "TextArea";

export { TextArea };
