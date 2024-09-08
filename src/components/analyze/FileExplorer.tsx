"use client";

import { expandFolder } from "@/lib/api/repositories";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { RepoContentItem } from "@/types/repo";
import { useCallback, useEffect, useState } from "react";
import FileList from "./FileList";

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
  const setCurrentRepo = useFileViewerStore((state) => state.setCurrentRepo);
  const { selectAllFiles, deselectAllFiles, getSelectedFilesCount } =
    useFileSelectionStore();

  // 레포 이동시 초기화
  useEffect(() => {
    resetFileViewer();
    setCurrentRepo(repo);
    deselectAllFiles();
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

  const getAllFiles = useCallback(
    (items: RepoContentItem[]): RepoContentItem[] => {
      return items.reduce((allFiles, item) => {
        allFiles.push(item);
        if (item.type === "dir" && item.items) {
          allFiles.push(...getAllFiles(item.items));
        }
        return allFiles;
      }, [] as RepoContentItem[]);
    },
    [],
  );

  const handleSelectAll = useCallback(() => {
    const allFiles = getAllFiles(structure);
    if (getSelectedFilesCount() === allFiles.length) {
      deselectAllFiles();
    } else {
      selectAllFiles(allFiles);
    }
  }, [
    structure,
    selectAllFiles,
    deselectAllFiles,
    getSelectedFilesCount,
    getAllFiles,
  ]);

  const isAllSelected = useCallback(() => {
    const allFiles = getAllFiles(structure);
    return getSelectedFilesCount() === allFiles.length;
  }, [structure, getSelectedFilesCount, getAllFiles]);

  return (
    <div className="overflow-hidden rounded-lg border border-line-default">
      <div className="flex items-center border-b border-line-default bg-purple-light px-3 py-5 text-xl">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isAllSelected()}
            onChange={handleSelectAll}
            className="mr-2 size-4 accent-primary-500"
          />
          <span>Files</span>
        </div>
      </div>
      <FileList
        structure={structure}
        onToggle={handleToggle}
        depth={0}
        username={username}
        repo={repo}
      />
    </div>
  );
}
