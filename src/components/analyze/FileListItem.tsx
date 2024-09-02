import { cn } from "@/lib/utils";
import { RepoContentItem } from "@/types/type";
import {
  IconDoc,
  IconDone,
  IconError,
  IconFolder,
  IconOnProcess,
  IconOnWait,
} from "../ui/Icons";
import FileList from "./FileList";
import { useFileViewerStore } from "@/stores/store";

export default function FileListItem({
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
  const { name, type, expanded, items, processStatus, path } = item;
  const fetchFileContent = useFileViewerStore(
    (state) => state.fetchFileContent,
  );
  const setCurrentFile = useFileViewerStore((state) => state.setCurrentFile);

  const handleItemClick = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    if (type === "dir") {
      onToggle(item);
    } else if (type === "file") {
      // 선택된 파일의 path로 코드파일 읽어오기
      setCurrentFile(name);
      await fetchFileContent(username, repo, path);
    }
  };

  const getStatusIcon = () => {
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
  };

  return (
    <>
      <li
        className={cn(
          "flex cursor-pointer border-t border-line-default px-3 py-2 hover:bg-purple-light",
          isNested && "pl-6",
          expanded && "bg-purple-50",
        )}
        onClick={handleItemClick}
      >
        <div className="flex">
          <div
            className="mr-2 flex items-center"
            onClick={(e) => e.stopPropagation()}
          ></div>
          <div className="mr-1 flex items-center">
            {type === "file" ? <IconDoc /> : <IconFolder />}
          </div>
          <span className="w-full">{name}</span>
          <div className="justify-self-end">
            {processStatus && getStatusIcon()}
          </div>
        </div>
      </li>
      {type === "dir" && expanded && items && items.length > 0 && (
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
