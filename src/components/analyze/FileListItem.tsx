import { cn, getLanguage } from "@/lib/utils";
import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { RepoContentItem } from "@/types/repo";
import { memo, useCallback, useMemo } from "react";
import {
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
  isNested,
  username,
  repo,
}: {
  item: RepoContentItem;
  onToggle: (item: RepoContentItem) => void;
  isNested: boolean;
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

  return (
    <>
      <li
        className={cn(
          "group/item flex cursor-pointer border-t border-line-default px-3 py-2 hover:bg-purple-light",
          isNested && "pl-6",
          // expanded && type === "dir" && "bg-purple-50",
          isActive && "bg-primary-50",
        )}
        onClick={handleItemClick}
      >
        <div className="flex w-full justify-between">
          <div className="flex w-full">
            <div
              className="mr-2 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={isFileSelected(item.path)}
                onChange={handleCheckboxChange}
                disabled={isImage}
                className={cn(
                  "size-4 accent-primary-500",
                  // type === "dir" && "invisible",
                )}
              />
            </div>
            <div className="mr-1 flex items-center">
              {type === "file" ? <IconDoc /> : <IconFolder />}
            </div>
            <span>{name}</span>
          </div>
          {/* <div className="flex-center-center invisible">
            <button
              className="group-hover/item:visible"
              onClick={handleBookmark}
            >
              <IconStar className="fill-primary-300" />
            </button>
          </div> */}
          {fileStatus && statusIcon}
        </div>
      </li>
      {showNestedList && items && (
        <FileList
          structure={items}
          onToggle={onToggle}
          isNested
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
