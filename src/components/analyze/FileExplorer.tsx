"use client";

import { useExpandFolder } from "@/lib/queries/useExpandFolder";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { FolderItem, RepoContentItem } from "@/types/repo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FileList from "./FileList";
import { IconList } from "../ui/Icons";
import { cn } from "@/lib/utils";
import { useFileBookmarkStore } from "@/stores/useFileBookmarkStore.ts";

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
  const [sortOption, setSortOption] = useState<SortOption>("folder");
  const [isSortListOpen, setIsSortListOpen] = useState(false);

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

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setIsSortListOpen(false);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-line-default">
      <div className="flex items-center border-b border-line-default bg-purple-light px-3 py-5 text-xl">
        <div className="flex w-full items-center justify-between">
          <h3>Files</h3>
          <div className="relative">
            <IconList
              className="cursor-pointer"
              onClick={() => setIsSortListOpen(!isSortListOpen)}
            />
            {isSortListOpen && (
              <div className="absolute right-0 top-full z-50 mt-1">
                <SortOptionList
                  selectedOption={sortOption}
                  onOptionSelect={handleSortChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <FileList
        structure={structure}
        onToggle={handleToggle}
        depth={0}
        username={username}
        repo={repo}
        sortOption={sortOption}
      />
    </div>
  );
}

export type SortOption = "file" | "folder" | "bookmark";

interface SortOptionListProps {
  selectedOption: SortOption;
  onOptionSelect: (option: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: "file", label: "파일순" },
  { value: "folder", label: "폴더순" },
  { value: "bookmark", label: "북마크순" },
];

function SortOptionList({
  selectedOption,
  onOptionSelect,
}: SortOptionListProps) {
  return (
    <ul className="z-100 w-[100px] overflow-hidden rounded-lg border border-line-default bg-white shadow-md">
      {options.map((option) => (
        <li
          key={option.value}
          className={cn(
            "cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-purple-light",
            selectedOption === option.value && "bg-purple-50",
          )}
          onClick={() => onOptionSelect(option.value)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
