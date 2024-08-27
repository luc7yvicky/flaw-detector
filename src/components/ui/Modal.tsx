import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { IconRoundedDoc } from "./Icons";

const modalVariants = cva("relative flex flex-col bg-white ", {
  variants: {
    variant: {
      selectFile: "justify-center items-center  border", //임시보더
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
      large:
        "w-[42.875rem] h-[29.875rem] top-[10rem] p-[3rem] rounded-[1.25rem]", //selectFile
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
    <li className="flex h-11 w-full items-center justify-between p-[0.625rem]">
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
    <>
      <div className="mb-10">
        {items.map((item, ulIndex) => (
          <ul
            key={ulIndex}
            className={cn(
              "h-11 w-[36.875rem] border border-b border-[#bcbcbc]",
              {
                "rounded-t-lg": ulIndex === 0 && items.length > 1, // 첫번째 행, 여러 행이 있을 경우
                "rounded-b-lg":
                  ulIndex === items.length - 1 && items.length > 1, // 마지막 행, 여러 행이 있을 경우
                "rounded-lg": items.length === 1, // 행이 하나일 때 네 꼭지점을 둥글게
              },
            )}
          >
            <ListItem
              title={item.title}
              subtitle={item.subtitle}
              date={item.date}
            />
          </ul>
        ))}
      </div>
    </>
  );
}

export type ModalProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof modalVariants> & {
    children?: React.ReactNode;
  };

export type ModalTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "big" | "small" | "default";
  weight?: "bold" | "semi-bold" | "default";
  color?: string;
  isSingleLine?: boolean;
};

export function Modal({ variant, size, className, ...props }: ModalProps) {
  return (
    <div className="flex-center-center fixed inset-0 z-50">
      {/* 로그인 모달이 아닐 때만 어두운 배경 처리*/}
      {variant !== "login" && (
        <div className="fixed inset-0 bg-black opacity-50"></div> // 어두운 배경 처리
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
  const getTextSize = (size: string) => {
    switch (size) {
      case "big":
        return "text-[2.25rem] leading-[3.375rem]"; //inquirySubmitted
      case "small":
        return "text-[1.15rem] leading-[1.512rem]"; //login
      default:
        return "text-[1.5rem] leading-[1.816rem]"; //processing, selectFile
    }
  };

  return (
    <p
      className={cn(
        "tracking-[-0.01em]",
        getTextSize(size),
        weight === "default"
          ? "font-medium" //login
          : weight === "semi-bold" //selectedfile
            ? "font-semibold"
            : "font-bold", //inquirySubmitted
        className,
      )}
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
  const marginBottom = (() => {
    switch (variant) {
      case "selectFile":
        return "mb-10";
      case "processing":
        return "mb-6";
      case "login":
        return "mb-8";
      case "inquirySubmitted":
        return "gap-[1.438rem]";
      default:
        return "";
    }
  })();

  return (
    <div className={cn("flex flex-col items-center", marginBottom)} {...props}>
      {children}
    </div>
  );
}

export function ModalDescription({
  size = "default",
  color,
  isSingleLine = false,
  className,
  children,
  ...props
}: ModalTitleProps) {
  const textColor = color ? { color } : { color: "text-gray-default" };
  return (
    <span
      className={cn(
        "flex items-center tracking-[-0.01em] text-gray-default",
        size === "big" ? "text-2xl" : size === "small" ? "text-xl" : "text-xs",
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
