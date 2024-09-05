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
        "w-full flex flex-col gap-4 text-[1.268rem] px-2 font-medium -tracking-[0.01rem]",
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
      className={cn("flex items-center gap-x-[0.125rem]", className)}
      {...props}
    >
      <IconClose
        width={28}
        height={28}
        className="fill-accent-red stroke-accent-red stroke-[0.013rem]"
      />
      <span>검출된 취약점</span>
      <span className="ml-auto">{children}</span>
    </div>
  );
}

function StatusWarning({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-x-2", className)} {...props}>
      <IconTriangle />
      <span>수정 제안</span>
      <span className="ml-auto">{children}</span>
    </div>
  );
}

function StatusSuccess({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-x-2", className)} {...props}>
      <IconCircle />
      <span>문제 없음</span>
      <span className="ml-auto">{children}</span>
    </div>
  );
}

export { Status, StatusError, StatusWarning, StatusSuccess };
