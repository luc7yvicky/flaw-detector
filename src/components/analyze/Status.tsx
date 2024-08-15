import { cn } from "@/lib/utils";
import { IconClose, IconTriangle, IconCircle } from "../ui/Icons";

function Status({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex-center-center h-[4.063rem] w-[15.375rem] gap-x-5 rounded-lg border border-line-default px-5 py-5 text-[1.268rem] font-medium -tracking-[0.01rem]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function StatusError({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex items-center gap-x-[0.125rem]", className)}
      {...props}
    >
      <IconClose
        width={28}
        height={28}
        className="fill-accent-red stroke-accent-red stroke-[0.013rem]"
      />
      <span>{children}</span>
    </div>
  );
}

function StatusWarning({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex items-center gap-x-2", className)}
      {...props}
    >
      <IconTriangle />
      <span>{children}</span>
    </div>
  );
}

function StatusSuccess({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex items-center gap-x-2", className)}
      {...props}
    >
      <IconCircle />
      <span>{children}</span>
    </div>
  );
}

export { Status, StatusError, StatusWarning, StatusSuccess };
