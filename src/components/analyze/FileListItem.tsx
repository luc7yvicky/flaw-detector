"use client";

import { useEffect, useState } from "react";
import { RepoItem } from "@/types/type";
import {
  IconDoc,
  IconDone,
  IconError,
  IconFolder,
  IconOnProcess,
  IconOnWait,
} from "../ui/Icons";
import FileList from "./FileList";
import { cn } from "@/lib/utils";

export default function FileListItem({
  item,
  onToggle,
  isNested,
}: {
  item: RepoItem;
  onToggle: (item: RepoItem) => void;
  isNested: boolean;
}) {
  const { name, type, path, expanded, items, status } = item;

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    if (type === "dir") {
      onToggle(item);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
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
            {status ? getStatusIcon() : null}
          </div>
        </div>
      </li>
      {type === "dir" && expanded && items && items.length > 0 && (
        <FileList structure={items} onToggle={onToggle} isNested />
      )}
    </>
  );
}
