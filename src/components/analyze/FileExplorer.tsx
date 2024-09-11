"use client";

import { getDetectedResultsByRepo } from "@/lib/api/repositories";
import { useExpandFolder } from "@/lib/queries/useExpandFolder";
import { cn } from "@/lib/utils";
import { useBookmarkStore } from "@/stores/useBookMarkStore";
import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { useFileViewerStore } from "@/stores/useFileViewerStore";
import { FolderItem, RepoContentItem } from "@/types/repo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconList } from "../ui/Icons";
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
  const setStatus = useFileProcessStore((state) => state.setFileStatus);

  const sortListRef = useRef<HTMLDivElement>(null);
  const { isBookmarked, bookmarks } = useBookmarkStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortListRef.current &&
        !sortListRef.current.contains(event.target as Node)
      ) {
        setIsSortListOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 해당 레파지토리의 검사 결과 여부 조회
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

  useEffect(() => {
    if (sortOption === "bookmark") {
      setStructure((prevStructure) => [...prevStructure]); // 새로운 배열을 생성하여 리렌더링 트리거
    }
  }, [bookmarks, sortOption]);

  const sortItems = useCallback(
    (items: RepoContentItem[], option: SortOption) => {
      return [...items].sort((a, b) => {
        if (option === "folder") {
          if (a.type === "dir" && b.type !== "dir") return -1;
          if (a.type !== "dir" && b.type === "dir") return 1;
        }
        if (option === "file") {
          if (a.type === "file" && b.type !== "file") return -1;
          if (a.type !== "file" && b.type === "file") return 1;
        }
        if (option === "bookmark") {
          const isABookmarked = useBookmarkStore
            .getState()
            .isBookmarked(a.path);
          const isBBookmarked = useBookmarkStore
            .getState()
            .isBookmarked(b.path);
          if (isABookmarked && !isBBookmarked) return -1;
          if (!isABookmarked && isBBookmarked) return 1;
        }
        return a.name.localeCompare(b.name);
      });
    },
    [],
  );

  const sortedStructure = useMemo(
    () => sortItems(structure, sortOption),
    [structure, sortOption, sortItems, bookmarks],
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
        structure={sortedStructure}
        onToggle={handleToggle}
        depth={0}
        username={username}
        repo={repo}
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
