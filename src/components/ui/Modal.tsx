import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { IconRoundedDoc } from "./Icons";
import { useCallback } from "react";

const modalVariants = cva("relative flex flex-col bg-white ", {
  variants: {
    variant: {
      selectFile: "fixed justify-center items-center ",
      processing: "justify-center items-center",
      login:
        "justify-center items-center shadow-[0_0_1.55rem_rgba(0,0,0,0.25)]",
      inquirySubmitted: "justify-center items-center ",
    },
    size: {
      small:
        "w-[21.313rem] h-[13.125rem] top-[15.375rem] p-[2.5rem_3.75rem] rounded-[1.25rem]", //login
      medium:
        "w-[26.688rem] h-[24.063rem] top-[10rem] p-[3rem] gap-[3.313rem] rounded-[1.25rem]", //processing
      large: "w-[42.875rem] min-h-[29.875rem] p-[3rem] rounded-[1.25rem]", //selectFile
      extraLarge:
        "w-[61.563rem] h-[21.563rem] top-[10rem] p-[3.75rem] rounded-[2.5rem]", //inquirySubmitted
    },
  },
  defaultVariants: {
    variant: "selectFile",
    size: "large",
  },
});

type ModalVariantsConfig = {
  variant: {
    selectFile: string;
    processing: string;
    login: string;
    inquirySubmitted: string;
  };
  size: {
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
  };
};

type ModalVariant = keyof ModalVariantsConfig["variant"];

//selectfile 모달에서 쓰이는 List, ListItem 컴포넌트
type ListItemProps = {
  title: string;
  subtitle: string;
  date: string;
};

export function ListItem({ title, subtitle, date }: ListItemProps) {
  return (
    <li className="grid h-11 w-full grid-cols-[1fr_1fr_4rem] items-center justify-between border border-b p-[0.625rem] last:border-0">
      <div className="flex items-center">
        <IconRoundedDoc className="mr-[0.625rem]" />
        <div className="font-medium">{title}</div>
      </div>
      <div className="text-xs font-normal leading-[0.907rem] tracking-[-0.01em] text-[#9E9E9E]">
        {subtitle}
      </div>
      <div className="text-xs leading-[0.907rem] tracking-[-0.01em] text-[#9E9E9E]">
        {date}
      </div>
    </li>
  );
}

type ListProps = {
  items: {
    title: string;
    subtitle: string;
    date: string;
  }[];
};

export function List({ items }: ListProps) {
  return (
    <ul className="max-h-[16rem] w-[36.875rem] overflow-hidden overflow-y-scroll rounded-lg border border-[#bcbcbc]">
      {items.map((item, index) => (
        <ListItem key={index} {...item} />
      ))}
    </ul>
  );
}

export type ModalProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof modalVariants> & {
    children?: React.ReactNode;
    onClose?: () => void;
    isOpen?: boolean;
  };

export type ModalTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "big" | "small" | "default";
  weight?: "bold" | "semi-bold" | "default";
  color?: string;
  isSingleLine?: boolean;
};

export function Modal({
  variant,
  size,
  className,
  onClose,
  isOpen,
  ...props
}: ModalProps) {
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;
  return (
    <div
      className={cn(
        "flex-center-center inset-0 z-50",
        variant === "login" ? "absolute" : "fixed",
      )}
    >
      {/* 로그인 모달이 아닐 때만 어두운 배경 처리*/}
      {variant !== "login" && (
        // 어두운 배경 처리
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={handleBackgroundClick}
        />
      )}
      <div
        className={cn(modalVariants({ variant, size }), className)}
        {...props}
      />
    </div>
  );
}

//타이틀
export function ModalTitle({
  size = "default",
  weight = "default",
  color,
  className,
  children,
  ...props
}: ModalTitleProps) {
  const textColor = color ? { color } : { color: "#3F3F3F" };
  const textSize = {
    big: "text-[2.25rem] leading-[3.375rem]", //inquirySubmitted
    small: "text-[1.15rem] leading-[1.512rem]", //login
    default: "text-[1.5rem] leading-[1.816rem]", //processing, selectFile
  }[size];
  const fontWeight = {
    bold: "font-bold", //inquirySubmitted
    "semi-bold": "font-semibold", //selectedfile
    default: "font-medium", //login
  }[weight];

  return (
    <p
      className={cn("tracking-[-0.01em]", textSize, fontWeight, className)}
      style={textColor}
      {...props}
    >
      {children}
    </p>
  );
}

export function ModalTitleWrapper({
  variant,
  children,
  ...props
}: {
  variant: ModalVariant;
  children: React.ReactNode;
}) {
  const marginBottom = {
    selectFile: "mb-10",
    processing: "mb-6",
    login: "mb-8",
    inquirySubmitted: "gap-[1.438rem]",
  }[variant];

  return (
    <div className={cn("flex flex-col items-center", marginBottom)} {...props}>
      {children}
    </div>
  );
}

export function ModalDescription({
  size = "default",
  color = "text-gray-default",
  isSingleLine = false,
  className,
  children,
  ...props
}: ModalTitleProps) {
  return (
    <span
      className={cn(
        "flex items-center tracking-[-0.01em]",
        size === "big" ? "text-2xl" : size === "small" ? "text-xl" : "text-xs",
        isSingleLine && "basis-full",
        color,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
