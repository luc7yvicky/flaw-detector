import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "filled" | "outlined" | "navigation";
  shape?: "rounded" | "pill";
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
    filled: "bg-primary-500 text-white",
    outlined: "bg-white border-2 border-primary-500 text-primary-500",
    navigation:
      "flex-center-center absolute bottom-[47%] size-[3.25rem] rounded-[50%] border border-gray-dark bg-white",
  };

  const shapeStyles = {
    rounded: "rounded-lg",
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
