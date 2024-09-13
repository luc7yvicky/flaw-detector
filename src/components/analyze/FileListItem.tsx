import { cn, getLanguage } from "@/lib/utils";
import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { RepoContentItem } from "@/types/repo";
import { memo, useCallback, useMemo } from "react";
import {
  IconCaretLeft,
  IconDoc,
  IconDone,
  IconError,
  IconFolder,
  IconOnProcess,
  IconOnWait,
  IconStar,
} from "../ui/Icons";
import FileList from "./FileList";
import { useBookmarkStore } from "@/stores/useBookMarkStore";

function FileListItem({
  item,
  onToggle,
  depth,
  username,
  repo,
}: {
  item: RepoContentItem;
  onToggle: (item: RepoContentItem) => void;
  depth: number;
  username: string;
  repo: string;
}) {
  const { name, type, path } = item;
  const { setCurrentFile, currentFile } = useFileViewerStore();

  const { toggleFileSelection, isFileSelected } = useFileSelectionStore();
  const { getFileStatus } = useFileProcessStore();
  const fileStatus = getFileStatus(item.path);
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const isItemBookmarked = isBookmarked(item.path);

  const isImage = useMemo(() => getLanguage(name) === "image", [name]);

  const handleCheckboxChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (type === "file" && !isImage) {
        toggleFileSelection(item.path, item.name);
      }
    },
    [type, isImage, item.path, item.name, toggleFileSelection],
  );

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleBookmark(item.path);
  };

  const handleItemClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      if (type === "dir") {
        onToggle(item);
        console.log(item.folderExpandStatus);
      } else if (type === "file") {
        setCurrentFile(path);
      }
    },
    [item, onToggle, setCurrentFile, path, type],
  );

  const statusIcon = useMemo(() => {
    switch (fileStatus) {
      case "onCheck":
        return <IconOnProcess className="animate-spin" />; // 처리 중임을 더 명확하게 표시
      case "onWait":
        return <IconOnWait className="fill-gray-default" />;
      case "error":
        return <IconError />;
      case "success":
        return <IconDone className="fill-accent-cyan" />;
      default:
        return null;
    }
  }, [fileStatus]);

  const showNestedList = useMemo(
    () =>
      type === "dir" &&
      item.folderExpandStatus === "expanded" &&
      item.items &&
      item.items.length > 0,
    [type, item],
  );

  // 깊이에 따른 padding 및 indicator (동적생성 이슈로 인라인스타일 지정)
  const BASE_PADDING = 8;
  const PADDING_INCREMENT = 16;

  const depthIndicators = useMemo(() => {
    return Array(depth)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className="absolute bottom-0 top-0 inline-block h-full w-px bg-gray-300"
          style={{
            left: `${BASE_PADDING * 2 + index * PADDING_INCREMENT}px`,
          }}
        />
      ));
  }, [depth]);

  return (
    <>
      <li
        title={name}
        className={cn(
          "group/item relative flex w-full cursor-pointer border-b border-line-default p-2.5 py-[-1px] hover:bg-purple-light",
          path === currentFile && "bg-primary-50",
        )}
        style={{ paddingLeft: `${BASE_PADDING + depth * PADDING_INCREMENT}px` }}
        onClick={handleItemClick}
      >
        {depthIndicators}
        <div className="flex w-full">
          <div
            className="mr-2 flex items-center"
            // onClick={(e) => e.stopPropagation()}
          >
            {type === "dir" ? (
              <IconCaretLeft
                className={cn(
                  "inline-block size-4 rotate-180 fill-black",
                  item.folderExpandStatus === "expanded" && "-rotate-90",
                )}
              />
            ) : (
              <div
                className="relative flex size-7 items-center justify-center"
                onClick={handleCheckboxChange}
              >
                <input
                  type="checkbox"
                  checked={isFileSelected(item.path)}
                  onChange={() => {}}
                  disabled={isImage}
                  className={cn(
                    "size-4 accent-primary-500",
                    isImage && "cursor-not-allowed opacity-50",
                  )}
                />
                <div className="absolute inset-0" />
              </div>
            )}
          </div>
          <div className="mr-1 flex items-center">
            {type === "file" ? <IconDoc /> : <IconFolder />}
          </div>
          <div className="shrink truncate">
            {name}
            {type === "dir" && item.folderExpandStatus === "expanding" && (
              <span className="ml-1">...</span>
            )}
          </div>
          <div
            className={cn(
              "flex-center-center invisible ml-auto",
              isItemBookmarked && "visible",
            )}
          >
            <button
              className="group-hover/item:visible"
              onClick={handleBookmark}
            >
              <IconStar
                filled={isItemBookmarked}
                className={
                  isItemBookmarked ? "text-primary-500" : "text-primary-300"
                }
              />
            </button>
          </div>
          {fileStatus && <div className="ml-auto flex pl-1"> {statusIcon}</div>}
        </div>
      </li>
      {showNestedList && type === "dir" && item.items && (
        <FileList
          structure={item.items}
          onToggle={onToggle}
          depth={depth + 1}
          username={username}
          repo={repo}
        />
      )}
    </>
  );
}

export default memo(FileListItem, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item &&
    prevProps.username === nextProps.username &&
    prevProps.repo === nextProps.repo
  );
});
