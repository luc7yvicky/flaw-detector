import IconCaretLeft from "@/components/ui/icons/IconCaretLeft";
import IconCloseFolder from "@/components/ui/icons/IconCloseFolder";
import IconDoc from "@/components/ui/icons/IconDoc";
import IconOpenFolder from "@/components/ui/icons/IconOpenFolder";
import { RepoTreeItem } from "@/lib/api/repositories";
import { cn, getLanguage } from "@/lib/utils";
import { useFileBookmarkStore } from "@/stores/useFileBookmarkStore";
import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { FileStatus } from "@/types/file";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo, useState } from "react";
import Checkbox from "./Checkbox";

const IconStar = dynamic(() => import("@/components/ui/icons/IconStar"));
const IconOnProcess = dynamic(
  () => import("@/components/ui/icons/IconOnProcess"),
);
const IconOnWait = dynamic(() => import("@/components/ui/icons/IconOnWait"));
const IconError = dynamic(() => import("@/components/ui/icons/IconError"));
const IconDone = dynamic(() => import("@/components/ui/icons/IconDone"));

type FileTreeItemProps = {
  item: RepoTreeItem;
  level: number;
  allItems: RepoTreeItem[];
  repo: string;
};
function FileTreeItem({
  item: { name, path, type, size },
  level,
  allItems,
  repo,
}: FileTreeItemProps) {
  const [isFolderExpanded, setIsFolderExpanded] = useState(false);
  const isFolder = type === "dir";

  const setCurrentFile = useFileViewerStore((state) => state.setCurrentFile);

  const isCurrentFile = useFileViewerStore(
    (state) => state.currentFile === path,
  );

  const isCheckboxVisible = useFileSelectionStore(
    (state) => state.isCheckboxVisible,
  );

  const toggleFileSelection = useFileSelectionStore(
    (state) => state.toggleFileSelection,
  );
  const clearSelection = useFileSelectionStore((state) => state.clearSelection);

  const isFileBookmarked = useFileBookmarkStore(
    (state) => state.isFileBookmarked,
  );
  const toggleFileBookmark = useFileBookmarkStore(
    (state) => state.toggleFileBookmark,
  );

  const [isBookmarked, setIsBookmarked] = useState(() =>
    isFileBookmarked(repo, path),
  );

  const fileStatus = useFileProcessStore((state) => state.getFileStatus(path));

  const isImage = getLanguage(name) === "image";

  const toggleFolder = () => {
    if (isFolder) {
      setIsFolderExpanded((prev) => !prev);
    }
  };

  const handleItemClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      if (isFolder) {
        toggleFolder();
      } else if (type === "file") {
        if (isCurrentFile) {
          setCurrentFile(null);
        } else {
          setCurrentFile(path);
        }
        if (!isCheckboxVisible) {
          if (isCurrentFile) {
            // 현재 파일 선택 해제
            clearSelection();
          } else {
            // 새 파일 선택
            clearSelection();
            toggleFileSelection(path, name, size || 0);
          }
        }
      }
    },
    [isCurrentFile, path],
  );

  const handleBookmark = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      toggleFileBookmark(repo, path);
      setIsBookmarked((prev) => !prev); // 즉시 로컬 상태 업데이트
    },
    [toggleFileBookmark, repo, path],
  );

  const childItems = useMemo(() => {
    return allItems
      .sort((a, b) => {
        if (a.type === "dir" && b.type !== "dir") return -1;
        if (a.type !== "dir" && b.type === "dir") return 1;
        return a.name.localeCompare(b.name);
      })
      .filter(
        (childItem) =>
          childItem.path.startsWith(path + "/") &&
          childItem.path.split("/").length === path.split("/").length + 1,
      );
  }, [type]);

  const typeIcon =
    type === "file" ? (
      <IconDoc width={20} />
    ) : isFolderExpanded ? (
      <IconOpenFolder width={20} height={20} />
    ) : (
      <IconCloseFolder width={20} height={20} />
    );

  const getStatusIcon = (status: FileStatus | null) => {
    switch (status) {
      case "onCheck":
        return <IconOnProcess className="animate-spin" />;
      case "onWait":
        return <IconOnWait />;
      case "error":
        return <IconError />;
      case "success":
        return <IconDone className="fill-accent-green" />;
      default:
        return null;
    }
  };

  // 깊이에 따른 padding 및 indicator (동적생성 이슈로 인라인스타일 지정)
  const BASE_PADDING = 8;
  const PADDING_INCREMENT = 16;
  const depthIndicators = useMemo(() => {
    return Array.from({ length: level }).map((_, index) => (
      <span
        key={index}
        className="absolute bottom-0 top-0 inline-block h-full w-px bg-gray-300"
        style={{
          left: `${BASE_PADDING * 2 + index * PADDING_INCREMENT}px`,
        }}
      />
    ));
  }, [level]);

  return (
    <>
      <li
        title={name}
        className={cn(
          "group/item relative flex w-full cursor-pointer border-b border-line-default p-2.5 py-[-1px] hover:bg-purple-light",
          isCurrentFile && "bg-primary-50",
          level === 0 && "last:border-none",
        )}
        style={{ paddingLeft: `${BASE_PADDING + level * PADDING_INCREMENT}px` }}
        onClick={handleItemClick}
      >
        {depthIndicators}
        <div className="flex w-full">
          <div className="flex items-center">
            {type === "dir" ? (
              <IconCaretLeft
                className={cn(
                  "mr-1 inline-block size-4 rotate-180 fill-black",
                  isFolderExpanded && "-rotate-90",
                )}
              />
            ) : (
              <Checkbox
                path={path}
                name={name}
                size={size ? size : 0}
                isImage={isImage}
                isCheckboxShow={isCheckboxVisible}
              />
            )}

            <div className="mr-1 flex items-center">{typeIcon}</div>
          </div>
          <div className="shrink items-center truncate leading-8">{name}</div>
          {type === "file" && (
            <div
              className={cn(
                "flex-center-center invisible ml-auto",
                isBookmarked && "visible",
              )}
            >
              <button
                className="group-hover/item:visible"
                onClick={handleBookmark}
              >
                <IconStar
                  width={20}
                  filled={isBookmarked}
                  className={
                    isBookmarked ? "text-primary-500" : "text-primary-300"
                  }
                />
              </button>
            </div>
          )}
          {fileStatus && (
            <div className="flex-center-center pl-1">
              {getStatusIcon(fileStatus)}
            </div>
          )}
        </div>
      </li>
      {isFolder && isFolderExpanded && (
        <div>
          {childItems.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              allItems={allItems}
              repo={repo}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default React.memo(FileTreeItem);
