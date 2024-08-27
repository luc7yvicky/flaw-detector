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

export default function FileListItem({
  item,
  onToggle,
  isNested,
}: {
  item: RepoContentItem;
  onToggle: (item: RepoContentItem) => void;
  isNested: boolean;
}) {
  const { name, type, expanded, items, processStatus } = item;

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    if (type === "dir") {
      onToggle(item);
    } else if (type === "file") {
      // 선택된 파일의 path로 코드파일 읽어오기
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
        <FileList structure={items} onToggle={onToggle} isNested />
      )}
    </>
  );
}
