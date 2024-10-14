"use client";

import { fetchArticleList } from "@/app/(member)/me/scraps/page";
import { useSessionStore } from "@/context/SessionProvider";
import { ArticleListItem } from "@/types/post";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Dropdown from "../ui/Dropdown";
import Pagination from "../ui/Pagination";
import ScrappedArticleListItem from "./ScrappedArticleListItem";

export default function ScrappedArticleList({
  initialArticles,
  totalPage,
}: {
  initialArticles: ArticleListItem[];
  totalPage: number;
}) {
  const { user } = useSessionStore((store) => store);
  console.log(user);

  // 1. 필터링 적용
  const [labelType, setLabelType] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");
  // 2. 페이징 적용
  const [currPage, setCurrPage] = useState<number>(1);

  // const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["scrappedArticles", user.username, currPage, labelType],
    queryFn: async () =>
      await fetchArticleList(user.username, currPage, labelType),
    enabled: !!user.username,
    initialData: { posts: initialArticles, totalPage },
    placeholderData: keepPreviousData,
  });

  // 다음 페이지의 데이터를 미리 가져옴
  // useEffect(() => {
  //   if (currPage < totalPage) {
  //     queryClient.prefetchQuery({
  //       queryKey: ["scrappedArticles", user.username, currPage + 1, labelType],
  //       queryFn: async () =>
  //         await fetchArticleList(user.username, currPage + 1, labelType),
  //     });
  //   }
  // }, [currPage, totalPage, labelType, queryClient]);

  useEffect(() => {
    if (currPage > 1) {
      refetch();
    }
  }, [currPage, labelType]);

  const filteredArticles = useMemo(() => {
    let sortedArticles = [...(data?.posts || [])];

    // 정렬
    if (sortType) {
      sortedArticles.sort((a, b) => {
        switch (sortType) {
          case "latest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "name":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return sortedArticles;
  }, [data?.posts, sortType]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <section className="flex flex-col gap-y-12 last:gap-y-[7.75rem]">
      <div className="inline-flex h-11 items-center justify-between">
        <h2 className="text-[2rem] font-medium -tracking-[0.01em] text-gray-dark">
          Library
        </h2>
        <div className="inline-flex gap-x-[0.563rem]">
          <Dropdown type="label" onSelectFilter={setLabelType} />
          <Dropdown type="sort" onSelectFilter={setSortType} />
        </div>
      </div>

      <div className="flex-between-center relative grid grid-cols-3 gap-6">
        {filteredArticles?.map((article) => (
          <Link href={`/vuldb/items/${article.id}`} key={article.id}>
            <ScrappedArticleListItem {...article} />
          </Link>
        ))}
      </div>

      {!error && (
        <div className="flex-center-center w-full">
          <Pagination
            currentPage={currPage}
            totalPages={data?.totalPage || totalPage}
            setCurrentPage={setCurrPage}
          />
        </div>
      )}
    </section>
  );
}
