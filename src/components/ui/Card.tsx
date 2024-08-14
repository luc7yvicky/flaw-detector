"use client";

import Image from "next/image";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconArrow, IconMenu } from "./Icons";

const cardVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      default: "justify-between border hover:bg-primary-50",
      article: "justify-between border border-[#c3c3c3]",
      image: "justify-end hover:bg-opacity-70",
      service:
        "justify-center items-center shadow-[0_5rem_3.75rem_-2.5rem_rgba(0,0,0,0.25)]",
    },
    size: {
      default:
        "h-[12.5rem] w-[19.375rem] rounded-xl border-primary-100 px-5 py-5",
      extended:
        "h-[13.563rem] w-[26.375rem] gap-6 rounded-lg border-[#c3c3c3] px-7 py-7 [&>*:nth-child(2)]:mt-[-1.25rem]",
      short: "h-[17.188rem] w-[25.875rem] gap-6 rounded-lg px-7 py-7",
      long: "h-[15.813rem] w-[54.063rem] gap-6 rounded-lg px-7 py-7",
      main: "h-[24.375rem] w-[39.063rem] rounded-[1.25rem] px-9 py-9",
      sub: "h-[24.375rem] w-[19.75rem] rounded-[1.25rem] px-9 py-9",
      service: "h-[28.829rem] w-[21.208rem] rounded-[2.5rem]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const cardContentVariants = cva("", {
  variants: {
    variant: {
      default: "h-[3.688rem] w-full rounded-2xl px-5 py-5",
      emoji: "flex-center-center mb-[2.344rem] mt-[1.694rem] h-fit w-full",
    },
    bgColor: {
      default: "bg-bggray-light",
      white: "bg-white",
      transparent: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
    bgColor: "default",
  },
});

export type CardProps = VariantProps<typeof cardVariants> & {
  children?: React.ReactNode;
};

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  hasMenu?: boolean;
};

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "big" | "small" | "xsmall" | "default";
  weight?: "bold" | "default";
  color?: string;
  isSingleLine?: boolean;
};

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardContentVariants>;

function Card({ variant, size, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, size }))} {...props} />;
}
Card.displayName = "Card";

function CardHeader({
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
  const textColor = color ? { color } : { color: "text-gray-dark" };
  return (
    <p
      className={cn(
        "line-clamp-2 text-ellipsis",
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
      style={textColor}
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
  const textColor = color ? { color } : { color: "text-gray-default" };
  return (
    <span
      className={cn(
        "flex items-center text-gray-default",
        size === "big" ? "text-xl" : size === "small" ? "text-xs" : "text-base",
        isSingleLine && "basis-full",
        className,
      )}
      style={textColor}
      {...props}
    >
      {children}
    </span>
  );
}
CardSubTitle.displayName = "CardSubTitle";

function CardContent({
  variant,
  bgColor,
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn(cardContentVariants({ variant, bgColor }), className)}
      {...props}
    >
      {variant === "default" ? (
        <p className="text-base leading-[1.21rem]">{children}</p>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
CardContent.displayName = "CardContent";

function CardCoverImage({
  src,
  alt,
  className,
  ...props
}: React.ComponentProps<typeof Image>) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: "cover", objectPosition: "center" }}
      className={cn("-z-10 rounded-[1.25rem]", className)}
      {...props}
    />
  );
}
CardCoverImage.displayName = "CardCoverImage";

// 임시, 껍데기만 개발
function CardLinkButton({
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
CardLinkButton.displayName = "CardLinkButton";

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
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitleWrapper,
  CardTitle,
  CardSubTitle,
  CardContent,
  CardCoverImage,
  CardLinkButton,
  CardFooter,
};
