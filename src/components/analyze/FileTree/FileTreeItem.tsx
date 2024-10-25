import {
  IconCaretLeft,
  IconDoc,
  IconDone,
  IconError,
  IconFolder,
  IconOnProcess,
  IconOnWait,
  IconStar,
} from "@/components/ui/Icons";
import { RepoTreeItem } from "@/lib/api/repositories";
import { cn, getLanguage } from "@/lib/utils";
import { useFileBookmarkStore } from "@/stores/useFileBookmarkStore";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import React, { useCallback, useMemo, useState } from "react";
import Checkbox from "./Checkbox";
import { useFileProcessStore } from "@/stores/useFileProcessStore";

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
    useCallback((state) => state.currentFile === path, [path]),
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

  const getFileStatus = useFileProcessStore((state) => state.getFileStatus);

  const fileStatus = getFileStatus(path);

  const isImage = useMemo(() => getLanguage(name) === "image", [name]);

  const toggleFolder = useCallback(() => {
    if (isFolder) {
      setIsFolderExpanded((prev) => !prev);
    }
  }, [isFolder]);

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

  const childItems = allItems.filter(
    (childItem) =>
      childItem.path.startsWith(path + "/") &&
      childItem.path.split("/").length === path.split("/").length + 1,
  );

  const typeIcon = useMemo(() => {
    if (type === "file") {
      return <IconDoc />;
    } else {
      return <IconFolder />;
    }
  }, []);

  const statusIcon = useMemo(() => {
    switch (fileStatus) {
      case "onCheck":
        return <IconOnProcess className="animate-spin" />; // 처리 중임을 더 명확하게 표시
      case "onWait":
        return <IconOnWait className="text-gray-default" />;
      case "error":
        return <IconError />;
      case "success":
        return <IconDone className="fill-accent-green" />;
      default:
        return null;
    }
  }, [fileStatus]);

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
                  "inline-block size-4 rotate-180 fill-black mr-1",
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
                  filled={isBookmarked}
                  className={
                    isBookmarked ? "text-primary-500" : "text-primary-300"
                  }
                />
              </button>
            </div>
          )}
          {fileStatus && (
            <div className="flex-center-center pl-1"> {statusIcon}</div>
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

export default React.memo(FileTreeItem, (prevProps, nextProps) => {
  return (
    prevProps.item.path === nextProps.item.path &&
    prevProps.level === nextProps.level &&
    prevProps.repo === nextProps.repo
  );
});
