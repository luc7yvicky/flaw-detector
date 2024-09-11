"use client";

import Repo from "@/components/me/Repo";
import { ITEMS_PER_MY_PAGE, PAGES_PER_GROUP } from "@/lib/const";
import { RepoListData } from "@/types/repo";
import { useMemo, useState } from "react";
import Dropdown from "../ui/Dropdown";
import Pagination from "../ui/Pagination";

export default function RepoList({
  initialRepos,
}: {
  initialRepos: RepoListData[];
}) {
  // 1. 필터링 적용
  const [filterType, setFilterType] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");

  const filteredAndSortedRepos = useMemo(() => {
    let result = [...initialRepos];

    // 검사 여부 필터링
    if (filterType && filterType !== "-1") {
      result = result.filter((repo) => repo.detectedStatus === filterType);
    }

    // 정렬
    if (sortType) {
      result.sort((a, b) => {
        switch (sortType) {
          case "latest":
            return (
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt || "").getTime() -
              new Date(b.createdAt || "").getTime()
            );
          case "name":
            return a.repositoryName.localeCompare(b.repositoryName);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [filterType, sortType, initialRepos]);

  // 2. 페이징 적용
  const [currPage, setCurrPage] = useState(1);
  const totalPages = Math.ceil(
    filteredAndSortedRepos?.length / ITEMS_PER_MY_PAGE,
  );
  const currentGroup = Math.ceil(currPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  const startIndex = (currPage - 1) * ITEMS_PER_MY_PAGE;
  const endIndex = startIndex + ITEMS_PER_MY_PAGE;
  const currentRepos = filteredAndSortedRepos?.slice(startIndex, endIndex);

  return (
    <section className="flex flex-col gap-y-12">
      <div className="inline-flex h-11 items-center justify-between">
        <h2 className="text-[2rem] font-medium -tracking-[0.01em] text-gray-dark">
          Library
        </h2>
        <div className="inline-flex gap-x-[0.563rem]">
          <Dropdown type="type" onSelectFilter={setFilterType} />
          <Dropdown type="sort" onSelectFilter={setSortType} />
        </div>
      </div>
      <div className="flex-between-center relative grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-12 1150:grid-cols-4">
        {currentRepos.map((repo) => (
          <Repo key={repo.repositoryName} {...repo} />
        ))}
      </div>

      <div className="flex-center-center w-full">
        <Pagination
          currentPage={currPage}
          totalPages={totalPages}
          startPage={startPage}
          endPage={endPage}
          setCurrentPage={setCurrPage}
        />
      </div>
    </section>
  );
}
