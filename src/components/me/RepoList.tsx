"use client";

import Repo from "@/components/me/Repo";
import { ITEMS_PER_MY_PAGE, PAGES_PER_GROUP } from "@/lib/const";
import { RepoListData } from "@/types/repo";
import { useEffect, useMemo, useState } from "react";
import Dropdown from "../ui/Dropdown";
import Pagination from "../ui/Pagination";
import { useRepoListStore } from "@/stores/useRepoListStore";
import { getRepoListFromDB } from "@/lib/api/repositories";

export default function RepoList({
  initialRepos,
  username,
}: {
  initialRepos: RepoListData[];
  username: string;
}) {
  // 1. 북마크한 레파지토리만 보기
  const filterByBookmarked = useRepoListStore(
    (state) => state.filterByBookmarked,
  );
  // 2. 최근에 클릭한 레파지토리만 보기
  const filterByRecentClicked = useRepoListStore(
    (state) => state.filterByRecentClicked,
  );

  const [repos, setRepos] = useState<RepoListData[]>(initialRepos);

  useEffect(() => {
    const fetchRepos = async () => {
      const params = new URLSearchParams({ username });
      if (filterByBookmarked) {
        params.append("favorite", "true");
      }
      if (filterByRecentClicked) {
        params.append("clickedAt", "true");
      }
      const filteredRepos = await getRepoListFromDB(params);
      setRepos(filteredRepos);
    };

    fetchRepos();
  }, [filterByBookmarked, filterByRecentClicked, username, initialRepos]);

  // 3. 필터링 적용
  const [filterType, setFilterType] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");

  const filteredAndSortedRepos = useMemo(() => {
    let result = [...repos];

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
  }, [filterType, sortType, repos]);

  // 4. 페이징 적용
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
    <section className="mt-5 flex flex-col gap-y-12">
      <div className="inline-flex h-11 items-center justify-between">
        <h2 className="text-[2rem] font-medium -tracking-[0.01em] text-gray-dark">
          Library
        </h2>
        <div className="inline-flex gap-x-[0.563rem]">
          <Dropdown type="type" onSelectFilter={setFilterType} />
          <Dropdown type="sort" onSelectFilter={setSortType} />
        </div>
      </div>

      {initialRepos.length === 0 ? (
        <div className="flex-col-center-center w-full gap-y-[0.625rem] 1150:h-[30.75rem]">
          <p className="text-[2rem] font-semibold leading-[2.8rem] tracking-[0.015em] text-gray-dark">
            Github에 레포지토리가 존재하지 않습니다.
          </p>
          <p className="flex-col-center-center text-2xl font-normal leading-[2.1rem] text-gray-default">
            <span>새로운 프로젝트를 시작해보세요.</span>
          </p>
        </div>
      ) : currentRepos.length == 0 ? (
        <div className="flex-col-center-center w-full gap-y-[0.625rem] 1150:h-[30.75rem]">
          <p className="text-[2rem] font-semibold leading-[2.8rem] tracking-[0.015em] text-gray-dark">
            조건에 맞는 레포지토리가 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex-between-center relative grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-12 1150:grid-cols-4">
          {currentRepos.map((repo) => (
            <Repo key={repo.repositoryName} username={username} {...repo} />
          ))}
        </div>
      )}
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
