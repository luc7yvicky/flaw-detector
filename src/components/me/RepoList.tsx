"use client";

import Repo from "@/components/me/Repo";
import { getRepoListFromDB } from "@/lib/api/repositories";
import { useRepoListStore } from "@/stores/useRepoListStore";
import { RepoListData } from "@/types/repo";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Dropdown from "../ui/Dropdown";
import Pagination from "../ui/Pagination";
import RepoFilterButton from "./RepoFilterButton";
import { useQuery } from "@tanstack/react-query";

export default function RepoList({
  initialRepos,
  totalPage = 1,
  username,
}: {
  initialRepos: RepoListData[];
  totalPage: number;
  username: string;
}) {
  // 1. 필터링 적용 (1) 북마크, (2) 최근 클릭
  const { filterByBookmarked, filterByRecentClicked } = useRepoListStore(
    useShallow((state) => ({
      filterByBookmarked: state.filterByBookmarked,
      filterByRecentClicked: state.filterByRecentClicked,
    })),
  );
  // 2. 필터링 적용 (1) 검사 상태, (2) 정렬
  const [filterType, setFilterType] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");
  // 3. 페이지네이션 적용
  const [currPage, setCurrPage] = useState(1);
  // const [repos, setRepos] = useState<RepoListData[]>(initialRepos);

  const {
    data: repos,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["repoList", username, filterByBookmarked, filterByRecentClicked],
    queryFn: async () => {
      const params = new URLSearchParams({ username });
      if (filterByBookmarked) {
        params.append("favorite", "true");
      }
      if (filterByRecentClicked) {
        params.append("clickedAt", "true");
      }

      const { repos } = await getRepoListFromDB(params);
      return repos;
    },
    enabled: false,
    initialData: initialRepos,
  });

  useEffect(() => {
    if (filterByBookmarked || filterByRecentClicked) {
      refetch();
    }
  }, [filterByBookmarked, filterByRecentClicked]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

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

  return (
    <section>
      <div className="flex-between-center gap-x-[1.313rem]">
        <RepoFilterButton type="recent-files" />
        <RepoFilterButton type="bookmark" />
      </div>

      <div className="mt-5 flex flex-col gap-y-12">
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
              새로운 프로젝트를 시작해보세요.
            </p>
          </div>
        ) : filteredAndSortedRepos.length == 0 ? (
          <div className="flex-col-center-center w-full gap-y-[0.625rem] 1150:h-[30.75rem]">
            <p className="text-[2rem] font-semibold leading-[2.8rem] tracking-[0.015em] text-gray-dark">
              조건에 맞는 레포지토리가 없습니다.
            </p>
          </div>
        ) : (
          <div className="flex-between-center relative grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-12 1150:grid-cols-4">
            {filteredAndSortedRepos.map((repo) => (
              <Repo key={repo.repositoryName} username={username} {...repo} />
            ))}
          </div>
        )}
        <div className="flex-center-center w-full">
          <Pagination
            className="-translate-x-1/2 transform"
            currentPage={currPage}
            totalPages={totalPage}
            setCurrentPage={setCurrPage}
          />
        </div>
      </div>
    </section>
  );
}
