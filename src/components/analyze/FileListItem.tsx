import { cn } from "@/lib/utils";
import { RepoContentItem } from "@/types/type";
import {
  IconDoc,
  IconDone,
  IconError,
  IconFolder,
  IconOnProcess,
  IconOnWait,
  IconStar,
} from "../ui/Icons";
import FileList from "./FileList";
import { useFileViewerStore } from "@/stores/store";
import { memo, useMemo, useState } from "react";

function FileListItem({
  item,
  onToggle,
  isNested,
  username,
  repo,
  isActive,
  onActivate,
}: {
  item: RepoContentItem;
  onToggle: (item: RepoContentItem) => void;
  isNested: boolean;
  username: string;
  repo: string;
  isActive: boolean;
  onActivate: (path: string) => void;
}) {
  const { name, type, expanded, items, processStatus, path } = item;
  const fetchFileContent = useFileViewerStore(
    (state) => state.fetchFileContent,
  );
  const setCurrentFile = useFileViewerStore((state) => state.setCurrentFile);

  const [isSelected, setIsSelected] = useState(false);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // TODO: 북마크 로직 구현
    console.log(`Bookmarked: ${name}`);
  };

  const handleItemClick = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    if (type === "dir") {
      onToggle(item);
    } else if (type === "file") {
      onActivate(path);
      // 선택된 파일의 path로 코드파일 읽어오기
      setCurrentFile(name);
      await fetchFileContent(username, repo, path);
    }
  };

  const statusIcon = useMemo(() => {
    switch (processStatus) {
      case "done":
        return <IconDone />;
      case "onProgress":
        return <IconOnProcess />;
      case "onWait":
        return <IconOnWait color="fill-gray-default" />;
      case "error":
        return <IconError />;
      default:
        return null;
    }
  }, [processStatus]);

  const showNestedList = useMemo(
    () => type === "dir" && expanded && items && items.length > 0,
    [type, expanded, items],
  );

  return (
    <>
      <li
        className={cn(
          "group/item flex cursor-pointer border-t border-line-default px-3 py-2 hover:bg-purple-light",
          isNested && "pl-6",
          isActive && "bg-primary-50",
          expanded && "bg-purple-50",
        )}
        onClick={handleItemClick}
      >
        <div className="flex w-full justify-between">
          <div className="flex w-full">
            <div
              className="mr-2 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <input type="checkbox" />
            </div>
            <div className="mr-1 flex items-center">
              {type === "file" ? <IconDoc /> : <IconFolder />}
            </div>
            <span>{name}</span>
          </div>
          <div className="flex-center-center invisible">
            <button
              className="group-hover/item:visible"
              onClick={handleBookmark}
            >
              <IconStar className="fill-primary-300" />
            </button>
            {processStatus && statusIcon}
          </div>
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

export default memo(FileListItem);
