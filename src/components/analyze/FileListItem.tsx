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
} from "../ui/Icons";
import FileList from "./FileList";

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
  const { name, type, expanded, items, path } = item;
  const fetchFileContent = useFileViewerStore(
    (state) => state.fetchFileContent,
  );
  const setCurrentFile = useFileViewerStore((state) => state.setCurrentFile);
  const currentFile = useFileViewerStore((state) => state.currentFile);

  const { toggleFileSelection, isFileSelected } = useFileSelectionStore();
  const { getFileStatus } = useFileProcessStore();
  const fileStatus = getFileStatus(item.path);

  const isImage = useMemo(() => getLanguage(name) === "image", [name]);

  const handleCheckboxChange = () => {
    if (!isImage) {
      toggleFileSelection(item.path, item.name);
    }
  };

  // const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   // TODO: 북마크 로직 구현
  //   console.log(`Bookmarked: ${name}`);
  // };

  const handleItemClick = useCallback(
    async (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      if (type === "dir") {
        onToggle(item);
      } else if (type === "file") {
        setCurrentFile(path);
        await fetchFileContent(username, repo, path);
      }
    },
    [item, onToggle, username, repo],
  );
  const statusIcon = useMemo(() => {
    switch (fileStatus) {
      case "onCheck":
        return <IconOnProcess className="animate-spin" />; // 처리 중임을 더 명확하게 표시
      case "onWait":
        return <IconOnWait color="fill-gray-default" />;
      case "error":
        return <IconError />;
      case "success":
        return <IconDone />;
      default:
        return null;
    }
  }, [fileStatus]);

  const showNestedList = useMemo(
    () => type === "dir" && expanded && items && items.length > 0,
    [type, expanded, items],
  );

  const isActive = type === "file" && path === currentFile;

  // 깊이에 따른 padding 및 indicator (동적생성 이슈로 인라인스타일 지정)
  const BASE_PADDING = 10;
  const PADDING_INCREMENT = 20;

  const depthIndicators = useMemo(() => {
    return Array(depth)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className="absolute bottom-0 top-0 inline-block h-full w-px bg-gray-300"
          style={{
            left: `${6 + BASE_PADDING + index * PADDING_INCREMENT}px`,
          }}
        />
      ));
  }, [depth]);

  return (
    <>
      <li
        title={name}
        className={cn(
          "group/item relative my-[-1px] flex w-full cursor-pointer border-y border-line-default p-2.5 last:border-b-0 hover:bg-purple-light",
          isActive && "bg-primary-50",
        )}
        style={{ paddingLeft: `${BASE_PADDING + depth * PADDING_INCREMENT}px` }}
        onClick={handleItemClick}
      >
        {depthIndicators}
        <div className="flex w-full justify-between">
          <div className="flex w-full">
            <div
              className="mr-2 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {type === "dir" ? (
                <IconCaretLeft
                  className={cn(
                    "inline-block size-4 rotate-180 fill-black",
                    expanded && "-rotate-90",
                  )}
                />
              ) : (
                <input
                  type="checkbox"
                  checked={isFileSelected(item.path)}
                  onChange={handleCheckboxChange}
                  disabled={isImage}
                  className={cn(
                    "size-4 accent-primary-500",
                    isImage && "cursor-not-allowed opacity-50",
                  )}
                />
              )}
            </div>
            <div className="mr-1 flex items-center">
              {type === "file" ? <IconDoc /> : <IconFolder />}
            </div>
            <div className="truncate">{name}</div>
          </div>
          {fileStatus && statusIcon}
        </div>
      </li>
      {showNestedList && items && (
        <FileList
          structure={items}
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
