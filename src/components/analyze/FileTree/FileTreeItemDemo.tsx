"use client";

import IconCaretLeft from "@/components/ui/icons/IconCaretLeft";
import IconCloseFolder from "@/components/ui/icons/IconCloseFolder";
import IconDoc from "@/components/ui/icons/IconDoc";
import IconDone from "@/components/ui/icons/IconDone";
import IconOpenFolder from "@/components/ui/icons/IconOpenFolder";
import IconStar from "@/components/ui/icons/IconStar";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

const calcPadding = (element: keyof HTMLElementTagNameMap, level: number) => {
  const BASE_PADDING = 8;
  const PADDING_INCREMENT = 16;

  if (element === "li") {
    return {
      paddingLeft: `${BASE_PADDING + level * PADDING_INCREMENT}px`,
    };
  }

  return {
    left: `${BASE_PADDING * 2 + level * PADDING_INCREMENT}px`,
  };
};

export type FileTreeItemDemoProps = {
  type: 0 | 1; // 0: dir, 1: file
  name: string;
  depth: number;
  isOpenDir?: boolean;
  isHovered?: boolean;
  isChecked?: boolean;
  isBookmarked?: boolean;
  isSuccessful?: boolean;
};

function FileTreeItemDemo({
  type,
  depth,
  isOpenDir = false,
  isHovered = false,
  isChecked = false,
  isBookmarked = false,
  isSuccessful = false,
  children,
}: FileTreeItemDemoProps & { children?: React.ReactNode }) {
  const depthIndicators = useMemo(() => {
    if (depth > 0) {
      return Array.from({ length: depth }).map((_, index) => (
        <span
          key={index}
          className="absolute bottom-0 top-0 inline-block h-full w-px bg-gray-300"
          style={calcPadding("span", index)}
        />
      ));
    }
    return null;
  }, [depth]);

  // 폴더
  if (type === 0) {
    return (
      <li
        className="relative flex w-full border-b border-line-light p-2.5 py-[-1px]"
        style={depth ? calcPadding("li", depth) : undefined}
      >
        {depthIndicators}
        <div className="flex w-full items-center gap-x-[0.267rem]">
          <IconCaretLeft
            className={cn(
              "size-4 fill-gray-dark",
              isOpenDir ? "-rotate-90" : "rotate-180",
            )}
          />
          {isOpenDir ? (
            <IconOpenFolder width={20} height={20} />
          ) : (
            <IconCloseFolder width={20} height={20} />
          )}
          <span className="shrink items-center truncate leading-8">
            {children}
          </span>
        </div>
      </li>
    );
  }

  // 파일
  return (
    <li
      className={cn(
        "relative flex w-full items-center gap-x-[0.267rem] border-b border-line-light p-2.5 py-[-1px]",
        isChecked && "bg-primary-50",
        isHovered && "bg-purple-light",
      )}
      style={depth ? calcPadding("li", depth) : undefined}
    >
      {depthIndicators}
      {isChecked && (
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          aria-label="selected file"
        />
      )}
      <IconDoc width={20} />
      <span>{children}</span>
      {isBookmarked && (
        <IconStar className="ml-auto size-5 fill-primary-500" filled />
      )}
      {isSuccessful && (
        <IconDone className="ml-auto size-6 fill-accent-green" />
      )}
    </li>
  );
}

export default memo(FileTreeItemDemo);
