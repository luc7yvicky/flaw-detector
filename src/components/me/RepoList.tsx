"use client";

import Repo from "@/components/me/Repo";
import { ITEMS_PER_MY_PAGE } from "@/lib/const";
import { RepoListData } from "@/types/type";
import { useEffect, useState } from "react";
import Dropdown from "../ui/Dropdown";
import { IconCaretLeft } from "../ui/Icons";

export default function RepoList({
  initialRepos,
}: {
  initialRepos: RepoListData[];
}) {
  const [repos, setRepos] = useState<RepoListData[]>(initialRepos);

  // 1. 필터링 적용
  const [filterType, setFilterType] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");

  useEffect(() => {
    let filteredRepos = [...initialRepos];

    // 검사 여부 필터링
    if (filterType && filterType !== "-1") {
      filteredRepos = filteredRepos.filter(
        (repo) => repo.detectedStatus === filterType,
      );
    }

    // 정렬
    if (sortType) {
      filteredRepos.sort((a, b) => {
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

    setRepos(filteredRepos);
  }, [filterType, sortType, initialRepos]);

  // 2. 페이징 적용
  const [currPage, setCurrPage] = useState(1);
  const totalPages = Math.ceil(repos.length / ITEMS_PER_MY_PAGE);
  const startIndex = (currPage - 1) * ITEMS_PER_MY_PAGE;
  const endIndex = startIndex + ITEMS_PER_MY_PAGE;
  const currentRepos = repos.slice(startIndex, endIndex);

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

      <div className="flex-between-center relative grid grid-cols-4 grid-rows-3 gap-x-6 gap-y-12">
        {currentRepos.map((repo) => (
          <Repo key={repo.repositoryName} {...repo} />
        ))}

        {currPage > 1 && (
          <button
            className="flex-center-center absolute -left-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
            onClick={() => setCurrPage((prev) => Math.max(prev - 1, 1))}
          >
            <IconCaretLeft className="fill-#343330" />
          </button>
        )}
        {currPage < totalPages && (
          <button
            className="flex-center-center absolute -right-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
            onClick={() =>
              setCurrPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <IconCaretLeft className="fill-#343330 rotate-180" />
          </button>
        )}
      </div>

      {/* <div className="flex-center-center w-full">
        <Pagination
          currentPage={currPage}
          totalPages={totalPages}
          setCurrentPage={setCurrPage}
        />
      </div> */}
    </section>
  );
}
