"use client";

import { useExpandFolder } from "@/lib/queries/useExpandFolder";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { FolderItem, RepoContentItem } from "@/types/repo";
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
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const { data, isLoading, error } = useExpandFolder(
    username,
    repo,
    currentFolder,
  );
  const resetFileViewer = useFileViewerStore((state) => state.resetFileViewer);
  const setCurrentRepo = useFileViewerStore((state) => state.setCurrentRepo);
  const resetFileSelection = useFileSelectionStore(
    (state) => state.resetFileSelection,
  );

  const [structure, setStructure] =
    useState<RepoContentItem[]>(initialStructure);

  useEffect(() => {
    const getResults = async () => {
      try {
        const { status, filePaths } = await getDetectedResultsByRepo(
          username,
          repo,
        );
        if (status && filePaths) {
          filePaths.forEach((filePath) => {
            setStatus(filePath, status);
          });
        }
      } catch (err) {
        console.error("Error fetching detected results:", err);
      }
    };

    getResults();
  }, []);

  // 레포 이동시 초기화
  useEffect(() => {
    resetFileViewer();
    setCurrentRepo(repo);
    resetFileSelection(); // 파일 선택 상태 리셋
    setStructure(initialStructure); // 구조 초기화
    setCurrentFolder(null); // 현재 폴더 초기화
  }, [
    resetFileViewer,
    setCurrentRepo,
    resetFileSelection,
    repo,
    initialStructure,
  ]);

  useEffect(() => {
    if (data && data.type === "dir") {
      setStructure((prevStructure) =>
        updateNestedStructure(prevStructure, data),
      );
      setCurrentFolder(null);
    }
  }, [data]);

  const updateNestedStructure = useCallback(
    (items: RepoContentItem[], updatedItem: FolderItem): RepoContentItem[] => {
      return items.map((item) => {
        if (item.path === updatedItem.path && item.type === "dir") {
          return { ...item, ...updatedItem };
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
    (item: RepoContentItem) => {
      if (item.type !== "dir") return;

      setStructure((prevStructure) =>
        updateNestedStructure(prevStructure, {
          ...item,
          folderExpandStatus:
            item.folderExpandStatus === "expanded" ? "initial" : "expanding",
          items: item.folderExpandStatus === "expanded" ? [] : item.items,
        }),
      );

      if (item.folderExpandStatus !== "expanded") {
        setCurrentFolder(item);
      }
    },
    [updateNestedStructure],
  );

  const getAllFiles = useCallback(
    (items: RepoContentItem[]): RepoContentItem[] => {
      return items.reduce((allFiles, item) => {
        if (item.type === "file") {
          allFiles.push(item);
        } else if (item.type === "dir" && item.items) {
          allFiles.push(...getAllFiles(item.items));
        }
        return allFiles;
      }, [] as RepoContentItem[]);
    },
    [],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line-default">
      <div className="flex items-center border-b border-line-default bg-purple-light px-3 py-5 text-xl">
        <div className="flex items-center">
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
