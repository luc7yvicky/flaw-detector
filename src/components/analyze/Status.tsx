import { cn } from "@/lib/utils";
import { IconClose, IconTriangle, IconCircle } from "../ui/Icons";

export default function Status() {
  return (
    <div
      className={cn(
        "flex-center-center h-[4.063rem] w-[15.375rem] gap-x-5 rounded-lg border border-line-default px-5 py-5 text-[1.268rem] font-medium -tracking-[0.01rem]",
      )}
    >
      <div className="inline-flex items-center gap-x-2">
        <IconClose
          width={28}
          height={28}
          className="fill-accent-red stroke-accent-red stroke-[0.013rem]"
        />
        <span>12</span>
      </div>
      <div className="inline-flex items-center gap-x-2">
        <IconTriangle />
        <span>13</span>
      </div>
      <div className="inline-flex items-center gap-x-2">
        <IconCircle />
        <span>12</span>
      </div>
    </div>
  );
}
