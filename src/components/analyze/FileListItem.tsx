import { useEffect, useState } from "react";
import { IconDoc, IconDone, IconError, IconFolder, IconOnProcess, IconOnWait } from "../ui/Icons";

interface FileListItemProps {
  id: string;
  type: "file" | "folder";
  name: string;
  status?: "done" | "onProgress" | "onWait" | "error";
  isSelected: boolean;
  onSelect: () => void;
}
export default function FileListItem({
  id,
  type,
  name,
  status,
  isSelected,
  onSelect,
}: FileListItemProps) {
  const [statusIcon, setStatusIcon] = useState<React.ReactNode | null>(null);

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    // console.log("file clicked", id);
  };

  useEffect(() => {
    switch (status) {
      case "done":
        setStatusIcon(<IconDone />);
        break;
      case "onProgress":
        setStatusIcon(<IconOnProcess />);
        break;
      case "onWait":
        setStatusIcon(<IconOnWait color="fill-gray-default"/>);
        break;
      case "error":
        setStatusIcon(<IconError />);
        break;
      default:
        setStatusIcon(null);
    }
  }, [status]);

  return (
    <li
      className="border-line-light -mt-[1px] flex cursor-pointer border-t px-3 py-2"
      onClick={handleItemClick}
    >
      <div
        className="mr-2 flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="mr-2"
        />
      </div>
      <div className="mr-1 flex items-center">
        {type === "file" ? <IconDoc /> : <IconFolder />}
      </div>
      <span className="w-full">{name}</span>
      <div className="justify-self-end">{status ? statusIcon : null}</div>
    </li>
  );
}
