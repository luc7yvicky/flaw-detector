import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?:
    | "filled"
    | "filled-light-purple"
    | "filled-sm"
    | "outlined"
    | "outlined-gray"
    | "navigation"
    | "demo";
  shape?: "rounded" | "rounded-xl" | "pill";
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "filled",
  shape = "rounded",
  onClick,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 font-semibold transition-colors duration-200 ease-in-out focus:outline-none hover:drop-shadow cursor:pointer disabled:cursor-not-allowed ";

  const variantStyles = {
    filled:
      "bg-primary-500 text-white disabled:bg-gray-light disabled:text-gray-default",
    "filled-light-purple":
      "flex-center-center bg-primary-50 h-[3.5rem] w-[12.25rem] text-2xl leading-[2.1rem] text-primary-500",
    "filled-sm":
      "bg-primary-500 text-white px-6 py-[0.688rem] text-[1.75rem] font-light leading-[2.118rem] -tracking-[0.01em]",
    outlined: "bg-white border-2 border-primary-500 text-primary-500",
    "outlined-gray":
      "flex-center-center w-full gap-x-[0.625rem] border border-line-light p-4 text-xl font-medium leading-7 text-gray-dark",
    navigation:
      "flex-center-center absolute bottom-[47%] size-[3.25rem] rounded-[50%] border border-gray-dark bg-white",
    demo: "absolute text-white whitespace-nowrap bg-[#893FFF] p-[1rem] text-xl font-normal shadow-[0_1.5rem_2.25rem_0_rgba(0,0,0,0.25)] z-10",
  };

  const shapeStyles = {
    rounded: "rounded-lg",
    "rounded-xl": "rounded-xl",
    pill: "rounded-full",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        shapeStyles[shape],
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
