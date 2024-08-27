"use client";

import { useState } from "react";

import FileList from "./FileList";
import { RepoItem } from "@/types/type";
import { expandFolder } from "@/lib/repositories";

export default function FileExplorer({
  initialStructure,
  username,
  repo,
}: {
  initialStructure: RepoItem[];
  username: string;
  repo: string;
}) {
  const [structure, setStructure] = useState<RepoItem[]>(initialStructure);

  const handleToggle = async (item: RepoItem) => {
    if (item.type === "dir") {
      if (!item.loaded) {
        try {
          setStructure((prevStructure) =>
            updateStructureRecursively(prevStructure, {
              ...item,
              status: "onProgress",
            }),
          );
          const expandedFolder = await expandFolder(username, repo, item);
          setStructure((prevStructure) =>
            updateStructureRecursively(prevStructure, {
              ...expandedFolder,
              expanded: true,
              status: "done",
            }),
          );
        } catch (error) {
          console.error("Error expanding folder:", error);
          setStructure((prevStructure) =>
            updateStructureRecursively(prevStructure, {
              ...item,
              status: "error",
            }),
          );
        }
      } else {
        setStructure((prevStructure) =>
          updateStructureRecursively(prevStructure, {
            ...item,
            expanded: !item.expanded,
          }),
        );
      }
    }
  };

  const updateStructureRecursively = (
    items: RepoItem[],
    updatedItem: RepoItem,
  ): RepoItem[] => {
    return items.map((item) => {
      if (item.path === updatedItem.path) {
        return updatedItem;
      }
      if (item.type === "dir" && item.items) {
        return {
          ...item,
          items: updateStructureRecursively(item.items, updatedItem),
        };
      }
      return item;
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-line-default">
      <div className="mb-4 flex items-center">
        <span>전체선택</span>
      </div>
      <FileList
        structure={structure}
        onToggle={handleToggle}
        isNested={false}
      />
    </div>
  );
}
