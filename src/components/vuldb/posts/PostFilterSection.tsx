import { cn } from "@/lib/utils";
import { Label } from "../../ui/Label";
import React from "react";

type PostFilterSectionProps = {
  isLoggedIn?: boolean;
  filter: "hot" | "new" | "all";
  onChangeFilter: (chip: "hot" | "new" | "all") => void;
  children?: React.ReactNode;
};

const FILTER_LABELS = ["all", "hot", "new"];

export default function PostFilterSection({
  isLoggedIn,
  filter,
  onChangeFilter,
  children,
}: PostFilterSectionProps) {
  return (
    <section className="relative w-full min-w-[54.063rem]">
      <div className="flex-between-center mb-8 max-w-[54.063rem]">
        <h2 className="text-2xl font-semibold leading-[1.816rem] tracking-[-0.01em]">
          취약점 DB
        </h2>
        <div
          className={cn(
            "flex-end-center gap-3",
            !isLoggedIn && "pointer-events-none",
          )}
        >
          {FILTER_LABELS.map((label) => (
            <Label
              key={label}
              variant={filter === label ? label : "unselected"}
              onClick={() =>
                filter !== label &&
                onChangeFilter(label as "hot" | "new" | "all")
              }
            >
              {label.toUpperCase()}
            </Label>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}
