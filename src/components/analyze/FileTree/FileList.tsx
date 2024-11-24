"use client";

import { getRepoTree } from "@/lib/api/repositories";
import { useQuery } from "@tanstack/react-query";
import FileTree from "./FileTree";
import { useEffect, useRef, useState } from "react";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";
import { cn } from "@/lib/utils";
import IconMultiSelect from "@/components/ui/icons/IconMultiSelect";
import IconList from "@/components/ui/icons/IconList";

export default function FileList({
  repo,
  username,
}: {
  repo: string;
  username: string;
}) {
  const [isSortListOpen, setIsSortListOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("folder");

  const {
    data: RepoTree,
    refetch: refetchRepoTree,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["repoTree", username, repo],
    queryFn: () => getRepoTree(username, repo),
    enabled: false,
    retry: 1,
  });

  useEffect(() => {
    refetchRepoTree();
  }, [refetchRepoTree]);

  const clearSelection = useFileSelectionStore((state) => state.clearSelection);
  const toggleCheckboxVisibility = useFileSelectionStore(
    (state) => state.toggleCheckboxVisibility,
  );

  const handleToggleMultiSelection = () => {
    toggleCheckboxVisibility();
    clearSelection();
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setIsSortListOpen(false);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-line-default">
      <div className="flex items-center border-b border-line-default bg-purple-light px-3 py-5 text-xl">
        <div className="flex w-full items-center justify-between">
          <h3>Files</h3>
          <div className="flex gap-3.5">
            <button
              onClick={handleToggleMultiSelection}
              title="파일 다중 선택 활성화"
            >
              <IconMultiSelect width={20} />
            </button>
            <button className="relative" title="리스트 정렬 옵션">
              <IconList
                width={20}
                onClick={() => setIsSortListOpen(!isSortListOpen)}
              />
              {isSortListOpen && (
                <div className="absolute right-0 top-full z-50 mt-1">
                  <SortOptionList
                    selectedOption={sortOption}
                    onOptionSelect={handleSortChange}
                    onClose={() => setIsSortListOpen(false)}
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      {isLoading && <div className="px-4 py-2">Loading...</div>}
      {RepoTree && (
        <FileTree data={RepoTree} repo={repo} sortOption={sortOption} />
      )}
    </div>
  );
}

export type SortOption = "file" | "folder" | "bookmark" | undefined;

interface SortOptionListProps {
  selectedOption: SortOption;
  onOptionSelect: (option: SortOption) => void;
  onClose: () => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: "file", label: "파일순" },
  { value: "folder", label: "폴더순" },
  { value: "bookmark", label: "북마크순" },
];

function SortOptionList({
  selectedOption,
  onOptionSelect,
  onClose,
}: SortOptionListProps) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOptionSelect]);

  return (
    <ul
      ref={ref}
      className="z-100 w-[100px] overflow-hidden rounded-lg border border-line-default bg-white shadow-md"
    >
      {options.map((option) => (
        <li
          key={option.value}
          className={cn(
            "cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-purple-light",
            selectedOption === option.value && "bg-purple-50",
          )}
          onClick={() => {
            onOptionSelect(option.value); // 선택한 옵션을 상위로 전달
            onClose(); // 선택 후 리스트 닫기
          }}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
