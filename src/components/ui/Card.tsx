"use client";

import React from "react";
import Image from "next/image";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconArrow, IconMenu } from "./Icons";

export const CardVariants = cva(`flex flex-col border relative`, {
  variants: {
    variant: {
      default: "justify-between hover:bg-primary-50",
      article: "justify-between border-[#c3c3c3]",
      image: "justify-end border-0 hover:bg-opacity-70",
    },
    size: {
      default:
        "h-[12.5rem] w-[19.375rem] rounded-xl px-5 py-5 border-primary-100",
      extended:
        "h-[13.563rem] w-[26.375rem] px-7 py-7 rounded-lg gap-6 border-[#c3c3c3] [&>*:nth-child(2)]:mt-[-1.25rem]",
      short: "w-[25.875rem] h-[17.188rem] px-7 py-7 rounded-lg gap-6",
      long: "w-[54.063rem] h-[15.813rem] px-7 py-7 rounded-lg gap-6",
      main: "w-[39.063rem] h-[24.375rem] px-9 py-9 rounded-[1.25rem]",
      sub: "h-[24.375rem] w-[19.75rem] px-9 py-9 rounded-[1.25rem]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type CardProps = VariantProps<typeof CardVariants> & {
  children?: React.ReactNode;
};

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
  hasMenu?: boolean;
};

type CardTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "big" | "small" | "xsmall" | "default";
  weight?: "bold" | "default";
  color?: string;
  isSingleLine?: boolean;
};

type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  bgColor?: "white" | "transparent" | "default";
};

function Card({ variant, size, ...props }: CardProps) {
  return <div className={cn(CardVariants({ variant, size }))} {...props} />;
}
Card.displayName = "Card";

function CardHeader({
  label = "label",
  hasMenu = false,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-fit flex-wrap items-center gap-2",
        hasMenu ? "justify-between" : "justify-start",
        className,
      )}
      {...props}
    >
      {/* 임시, Label 컴포넌트 자리 */}
      <div>{label}</div>
      {children}
      {hasMenu && <IconMenu />}
    </div>
  );
}
CardHeader.displayName = "CardHeader";

function CardTitleWrapper({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col justify-end gap-y-[0.625rem]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
CardTitleWrapper.displayName = "CardTitleWrapper";

function CardTitle({
  size = "default",
  weight = "default",
  color,
  className,
  children,
  ...props
}: CardTitleProps) {
  const textColor = color ? `text-${color}` : "text-gray-dark";
  return (
    <p
      className={cn(
        "line-clamp-2 text-ellipsis",
        textColor,
        size === "big"
          ? "text-[1.75rem] leading-[2.45rem]"
          : size === "small"
            ? "text-xl leading-[1.513rem]"
            : size === "xsmall"
              ? "text-lg leading-[1.361rem]"
              : "text-2xl leading-9",
        weight === "bold" ? "font-semibold" : "font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
CardTitle.displayName = "CardTitle";

function CardSubTitle({
  size = "default",
  color,
  isSingleLine = false,
  className,
  children,
  ...props
}: CardTitleProps) {
  const textColor = color ? `text-${color}` : "text-gray-default";
  return (
    <span
      className={cn(
        "flex items-center",
        textColor,
        size === "small" ? "text-xs" : "text-base",
        isSingleLine && "basis-full",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
CardSubTitle.displayName = "CardSubTitle";

function CardContent({
  bgColor,
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn(
        "h-[3.688rem] w-full rounded-2xl px-5 py-5",
        bgColor === "white"
          ? "bg-white"
          : bgColor === "transparent"
            ? "bg-transparent"
            : "bg-bggray-light",
        className,
      )}
    >
      <p className="text-base leading-[1.21rem]" {...props}>
        {children}
      </p>
    </div>
  );
}
CardContent.displayName = "CardContent";

function CardCoverImage({
  src,
  className,
  ...props
}: React.ComponentProps<typeof Image>) {
  return (
    <Image
      src={src}
      layout="fill"
      objectFit="cover"
      objectPosition="center"
      className={cn("z-[-1] rounded-[1.25rem]", className)}
      {...props}
    />
  );
}
CardCoverImage.displayName = "CardCoverImage";

// 임시, 껍데기만 개발
function CardMoreInfoButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-[50%] bg-white opacity-70",
        className,
      )}
      {...props}
    >
      <IconArrow direction="right" color="fill-black" />
    </div>
  );
}
CardMoreInfoButton.displayName = "CardMoreInfoButton";

function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardTitleWrapper,
  CardTitle,
  CardSubTitle,
  CardContent,
  CardCoverImage,
  CardMoreInfoButton,
  CardFooter,
};
