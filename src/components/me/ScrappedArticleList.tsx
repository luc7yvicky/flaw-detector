"use client";

import { ITEMS_PER_MY_PAGE, PAGES_PER_GROUP } from "@/lib/const";
import { ArticleListItem } from "@/types/post";
import Link from "next/link";
import { useMemo, useState } from "react";
import Dropdown from "../ui/Dropdown";
import Pagination from "../ui/Pagination";
import ScrappedArticleListItem from "./ScrappedArticleListItem";

export default function ScrappedArticleList({
  initialArticles,
}: {
  initialArticles: ArticleListItem[];
}) {
  // 1. 필터링 적용
  const [labelType, setLabelType] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");

  const articles = useMemo(() => {
    let sortedArticles = [...initialArticles];

    // 라벨 필터링
    if (labelType && labelType !== "-1") {
      sortedArticles = sortedArticles.filter(
        (article) => article.label === labelType,
      );
    }

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
  }, [labelType, sortType, initialArticles]);

  // 2. 페이징 적용
  const [currPage, setCurrPage] = useState<number>(1);
  const totalPages = Math.ceil(articles.length / ITEMS_PER_MY_PAGE);
  const currentGroup = Math.ceil(currPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  const startIndex = (currPage - 1) * ITEMS_PER_MY_PAGE;
  const endIndex = startIndex + ITEMS_PER_MY_PAGE;
  const currentArticles = articles.slice(startIndex, endIndex);

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
        {currentArticles?.map((article) => (
          <Link href={`/vuldb/items/${article.id}`} key={article.id}>
            <ScrappedArticleListItem {...article} />
          </Link>
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
