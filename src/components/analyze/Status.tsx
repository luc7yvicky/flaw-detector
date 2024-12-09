import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { memo } from "react";
import IconCircle from "../ui/icons/IconCircle";
import IconTriangle from "../ui/icons/IconTriangle";

const IconClose = dynamic(() => import("../ui/icons/IconClose"));

const statusType = {
  error: {
    style: "gap-x-[0.62rem]",
    icon: (
      <IconClose
        width={24}
        height={24}
        className="ml-[0.5rem] fill-accent-red stroke-accent-red stroke-[0.013rem]"
      />
    ),
    text: "검출된 취약점",
  },
  warning: {
    icon: <IconTriangle width={19} height={19} className="ml-[0.667rem]" />,
    text: "수정 제안",
  },
  success: {
    icon: <IconCircle width={20} height={20} className="ml-[0.667rem]" />,
    text: "문제 없음",
  },
};

type StatusProperty = {
  style?: string;
  icon: JSX.Element;
  text: string;
};

type StatusMessageProps = {
  type: keyof typeof statusType;
} & React.HTMLAttributes<HTMLDivElement>;

export function Status({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 px-2 text-[1.268rem] font-medium -tracking-[0.01rem]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const StatusMessage = memo(function StatusMessage({
  type,
  className,
  children,
  ...props
}: StatusMessageProps) {
  const { style, icon, text } = statusType[type] as StatusProperty;

  return (
    <div
      className={cn("flex items-center gap-x-[0.833rem]", style, className)}
      {...props}
    >
      {icon}
      <span>{text}</span>
      <span className="ml-auto">{children}</span>
    </div>
  );
});

export const StatusMessageSkeleton = memo(function StatusMessageSkeleton() {
  return (
    <div className="inline-flex gap-x-[0.833rem]">
      <div className="ml-[0.667rem] size-[1.667rem] rounded-full bg-gray-200" />
      <div className="h-[1.902rem] w-[6.833rem] rounded-lg bg-gray-200" />
      <div className="ml-auto size-[1.667rem] rounded-lg bg-gray-200" />
    </div>
  );
});
