"use client";

import { useCallback, useEffect, useState } from "react";

import FileList from "./FileList";
import { RepoContentItem } from "@/types/type";
import { expandFolder } from "@/lib/api/repositories";
import { useFileViewerStore } from "@/stores/store";

export default function FileExplorer({
  initialStructure,
  username,
  repo,
}: {
  initialStructure: RepoContentItem[];
  username: string;
  repo: string;
}) {
  const [structure, setStructure] =
    useState<RepoContentItem[]>(initialStructure);

  const resetFileViewer = useFileViewerStore((state) => state.resetFileViewer);

  useEffect(() => {
    resetFileViewer();
  }, [resetFileViewer, repo]);

  const updateNestedStructure = useCallback(
    (
      items: RepoContentItem[],
      updatedItem: RepoContentItem,
    ): RepoContentItem[] => {
      return items.map((item) => {
        if (item.path === updatedItem.path) {
          return updatedItem;
        }
        if (item.type === "dir" && item.items) {
          return {
            ...item,
            items: updateNestedStructure(item.items, updatedItem),
          };
        }
        return item;
      });
    },
    [],
  );

  const handleToggle = useCallback(
    async (item: RepoContentItem) => {
      if (item.type !== "dir") return;
      if (item.loadingStatus !== "loaded") {
        try {
          setStructure((prevStructure) =>
            updateNestedStructure(prevStructure, {
              ...item,
              loadingStatus: "loading",
            }),
          );
          const expandedFolder = await expandFolder(username, repo, item);
          setStructure((prevStructure) =>
            updateNestedStructure(prevStructure, {
              ...expandedFolder,
              expanded: true,
              loadingStatus: "loaded",
            }),
          );
        } catch (error) {
          console.error("하위 콘텐츠를 읽어오는 데 실패했습니다:", error);
          setStructure((prevStructure) =>
            updateNestedStructure(prevStructure, {
              ...item,
              loadingStatus: "error",
              error:
                error instanceof Error
                  ? error.message
                  : "알 수 없는 에러가 발생했습니다.",
            }),
          );
        }
      } else {
        setStructure((prevStructure) =>
          updateNestedStructure(prevStructure, {
            ...item,
            expanded: !item.expanded,
          }),
        );
      }
    },
    [username, repo, updateNestedStructure],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line-default">
      <div className="flex items-center border-b border-line-default bg-purple-light p-5 text-xl">
        Files
      </div>
      <FileList
        structure={structure}
        onToggle={handleToggle}
        isNested={false}
        username={username}
        repo={repo}
      />
    </div>
  );
}
