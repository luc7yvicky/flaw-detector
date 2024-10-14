"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { IconCaretLeft } from "./Icons";

type TitleBarProps = {
  hasBackButton?: boolean;
  backPath?: string;
  title: string;
  align?: "start" | "center";
  h1ClassName?: string;
};

export default function TitleBar({
  hasBackButton = true,
  title,
  backPath,
  align = "start",
  className,
  h1ClassName,
  ...props
}: TitleBarProps & React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const alignStyle =
    align === "start" ? "flex-center-left" : "flex-center-center";
  const h1AlignStyle =
    align === "start" ? "w-flex-center-start" : "flex-center-center w-auto";

  const onClickBackButton = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  const onClickTitle = () => {
    window.location.reload();
  };

  return (
    <div
      className={cn("relative mb-8 flex h-[4.875rem]", alignStyle, className)}
      {...props}
    >
      {hasBackButton && (
        <Button
          shape="pill"
          variant="outlined"
          className={cn(
            "flex-center-center size-[4.875rem] border-[0.25rem] px-5",
            align === "center" && "absolute left-0 z-30",
          )}
          onClick={onClickBackButton}
          aria-label="Go To Back"
        >
          <IconCaretLeft className="stroke-primary-500 stroke-[0.1rem]" />
        </Button>
      )}
      <h1
        className={cn(
          "flex size-full h-fit cursor-pointer rounded-full border-[0.25rem] border-primary-500 px-[2rem] py-3 text-[2.5rem] leading-tight -tracking-[0.01em] text-primary-500",
          hasBackButton && "ml-[1.5rem]",
          h1AlignStyle,
          h1ClassName,
        )}
        onClick={onClickTitle}
      >
        {title}
      </h1>
    </div>
  );
}
