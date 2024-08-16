import { IconDone, IconOnProcess } from "../ui/Icons";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

type StatusVariantsProps = VariantProps<typeof statusVariants>;

interface ProcessStatusProps extends StatusVariantsProps {
  status?: "inProgress" | "done";
}

const statusVariants = cva(
  "mb-8 w-full max-w-[20rem] rounded-lg border py-[0.625rem] text-center text-xl",
  {
    variants: {
      status: {
        inProgress: "border-primary-500 bg-primary-50 text-primary-500",
        done: "border-accent-green bg-[#E5F8E5] text-accent-green",
      },
    },
    defaultVariants: {
      status: "inProgress",
    },
  },
);

export default function ProcessStatus({
  status = "inProgress",
}: ProcessStatusProps) {
  const statusText = {
    inProgress: "취약성 실시간 검사중",
    done: "분석 완료",
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6">
        {status === "inProgress" ? (
          <IconOnProcess className="animate-spin" size={40}/>
        ) : (
          <IconDone />
        )}
      </div>
      <div className={cn(statusVariants({ status }))}>{statusText[status]}</div>
    </div>
  );
}
