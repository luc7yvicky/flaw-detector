"use client";

import { expandFolder } from "@/lib/api/repositories";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { RepoContentItem } from "@/types/repo";
import { useCallback, useEffect, useState } from "react";
import FileList from "./FileList";
import { useExpandFolder } from "@/lib/queries/useExpandFolder";

export default function FileExplorer({
  initialStructure,
  username,
  repo,
}: {
  initialStructure: RepoContentItem[];
  username: string;
  repo: string;
}) {
  const [currentFolder, setCurrentFolder] = useState<RepoContentItem | null>(
    null,
  );
  const { data, isLoading, error } = useExpandFolder(
    username,
    repo,
    currentFolder,
  );
  const resetFileViewer = useFileViewerStore((state) => state.resetFileViewer);
  const setCurrentRepo = useFileViewerStore((state) => state.setCurrentRepo);
  const { selectAllFiles, deselectAllFiles, getSelectedFilesCount } =
    useFileSelectionStore();

  const [structure, setStructure] =
    useState<RepoContentItem[]>(initialStructure);

  // 레포 이동시 초기화
  // useEffect(() => {
  //   resetFileViewer();
  //   setCurrentRepo(repo);
  //   deselectAllFiles();
  // }, [resetFileViewer, repo]);

  useEffect(() => {
    if (data) {
      setStructure((prevStructure) =>
        updateNestedStructure(prevStructure, {
          ...data,
          expanded: true, 
        }),
      );
      setCurrentFolder(null); 
    }
  }, [data]);

  const updateNestedStructure = useCallback(
    (
      items: RepoContentItem[],
      updatedItem: RepoContentItem,
    ): RepoContentItem[] => {
      return items.map((item) => {
        if (item.path === updatedItem.path) {
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

  const handleToggle = useCallback((item: RepoContentItem) => {
    if (item.type !== "dir") return;

    if (item.loadingStatus !== "loaded") {
      setCurrentFolder(item);
      setStructure((prevStructure) =>
        updateNestedStructure(prevStructure, {
          ...item,
          loadingStatus: "loading",
        }),
      );
    } else {
      setStructure((prevStructure) =>
        updateNestedStructure(prevStructure, {
          ...item,
          expanded: !item.expanded,
        }),
      );
    }
  }, []);

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
