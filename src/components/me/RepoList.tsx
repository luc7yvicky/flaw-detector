"use client";

import Repo from "@/components/me/Repo";
import { getRepoListFromDB } from "@/lib/api/repositories";
import { useRepoListStore } from "@/stores/useRepoListStore";
import { RepoListData } from "@/types/repo";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Dropdown from "../ui/Dropdown";
import Pagination from "../ui/Pagination";
import ExceptionHandlingMessage from "../vulnerability-db/ExceptionHandlingMessage";
import RepoFilterButton from "./RepoFilterButton";
// import { RepoSkeleton } from "./RepoListSkeleton";

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
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // for Repo Skeleton
  // const opacityLevels = [0.75, 0.5, 0.2];

  const {
    data,
    // isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "repos",
      username,
      currPage,
      filterType,
      filterByBookmarked,
      filterByRecentClicked,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({ username });

      if (currPage) {
        params.append("page", currPage.toString());
      }

      if (filterType !== undefined) {
        params.append("filterType", filterType);
      }

      if (filterByBookmarked) {
        params.append("favorite", "true");
      }

      if (filterByRecentClicked) {
        params.append("clickedAt", "true");
      }

      const res = await getRepoListFromDB(params);
      return res;
    },
    enabled: false,
    initialData: { repos: initialRepos, totalPage },
  });

  useEffect(() => {
    if (data?.totalPage === 1) {
      setCurrPage(1);
    }
  }, [data?.totalPage]);

  useEffect(() => {
    if (!isFirstLoad) {
      refetch();
    } else {
      setIsFirstLoad(false);
    }
  }, [
    isFirstLoad,
    filterType,
    currPage,
    filterByBookmarked,
    filterByRecentClicked,
    refetch,
  ]);

  const sortedRepos = useMemo(() => {
    let result = [...(data?.repos || [])];

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
  }, [data?.repos, sortType]);

  if (isError && error) {
    return (
      <ExceptionHandlingMessage
        situation={error.toString()}
        solution="다시 시도해주세요."
      />
    );
  }

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
          <ExceptionHandlingMessage
            situation="Github에 레포지토리가 존재하지 않습니다."
            solution="새로운 프로젝트를 시작해보세요."
          />
        ) : sortedRepos.length == 0 ? (
          <ExceptionHandlingMessage
            situation="조건에 맞는 레포지토리가 없습니다."
            solution="다른 조건을 선택해주세요."
          />
        ) : (
          // isFetching ? (
          //   <div className="flex-between-center relative grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-12 1150:grid-cols-4">
          //     {Array.from({ length: 12 }).map((_, index) => (
          //       <RepoSkeleton
          //         key={index}
          //         style={{ opacity: opacityLevels[Math.floor(index / 4)] }}
          //       />
          //     ))}
          //   </div>
          // ) :
          <div className="flex-between-center relative grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-12 1150:grid-cols-4">
            {sortedRepos.map((repo) => (
              <Repo key={repo.repositoryName} username={username} {...repo} />
            ))}
          </div>
        )}

        {data?.totalPage > 0 && (
          <div className="flex-center-center w-full">
            <Pagination
              className="-translate-x-1/2 transform"
              currentPage={currPage}
              totalPages={totalPage}
              setCurrentPage={setCurrPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}
