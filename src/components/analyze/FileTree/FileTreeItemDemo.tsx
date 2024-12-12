"use client";

import IconCaretLeft from "@/components/ui/icons/IconCaretLeft";
import IconCloseFolder from "@/components/ui/icons/IconCloseFolder";
import IconDoc from "@/components/ui/icons/IconDoc";
import IconDone from "@/components/ui/icons/IconDone";
import IconOpenFolder from "@/components/ui/icons/IconOpenFolder";
import IconStar from "@/components/ui/icons/IconStar";
import { PADDING } from "@/lib/const";
import { cn } from "@/lib/utils";
import {
  FileItemProps,
  FileTreeItemDemoProps,
  FolderItemProps,
} from "@/types/file";
import { memo, PropsWithChildren, useMemo } from "react";

const calcPadding = (element: keyof HTMLElementTagNameMap, level: number) => {
  if (element === "li") {
    return {
      paddingLeft: `${PADDING.BASE + level * PADDING.INCREMENT}px`,
    };
  }

  return {
    left: `${PADDING.BASE * 2 + level * PADDING.INCREMENT}px`,
  };
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
}: FileTreeItemDemoProps) {
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

  return (
    <li
      className={cn(
        "relative flex w-full items-center border-b border-line-light p-2.5 py-[-1px]",
        type !== 0 && "gap-x-[0.267rem]",
        isChecked && "bg-primary-50",
        isHovered && "bg-purple-light",
      )}
      style={depth ? calcPadding("li", depth) : undefined}
    >
      {depthIndicators}
      {type === 0 ? (
        <FolderItem isOpenDir={isOpenDir}>{children}</FolderItem>
      ) : (
        <FileItem
          isChecked={isChecked}
          isBookmarked={isBookmarked}
          isSuccessful={isSuccessful}
        >
          {children}
        </FileItem>
      )}
    </li>
  );
}

const FolderItem = memo(
  ({ isOpenDir, children }: FolderItemProps & PropsWithChildren) => {
    return (
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
    );
  },
);
FolderItem.displayName = "FolderItem";

const FileItem = memo(
  ({ isSuccessful, isBookmarked, isChecked, children }: FileItemProps) => {
    const statusIcon = useMemo(() => {
      if (isSuccessful) {
        return <IconDone className="ml-auto size-6 fill-accent-green" />;
      }
      if (isBookmarked) {
        return <IconStar className="ml-auto size-5 fill-primary-500" filled />;
      }
    }, [isSuccessful, isBookmarked]);

    return (
      <>
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
        {statusIcon}
      </>
    );
  },
);
FileItem.displayName = "FileItem";

export default memo(FileTreeItemDemo);
