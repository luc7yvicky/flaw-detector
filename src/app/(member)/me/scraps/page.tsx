"use client";

import ClippingArticle from "@/components/me/ClippingArticle";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";
import TitleBar from "@/components/ui/TitleBar";
import { ITEMS_PER_MY_PAGE, PAGES_PER_GROUP } from "@/lib/const";
import { ArticleDetailProps } from "@/types/post";
import Link from "next/link";
import { useMemo, useState } from "react";

const dummyClippingArticles: ArticleDetailProps[] = [
  {
    id: "1",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서1",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.01 12:00:00",
  },
  {
    id: "2",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서2",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.02 13:00:00",
  },
  {
    id: "3",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서3",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.03 14:00:00",
  },
  {
    id: "4",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서4",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.04 15:00:00",
  },
  {
    id: "5",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서5",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.05 16:00:00",
  },
  {
    id: "6",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서6",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.06 17:00:00",
  },
  {
    id: "7",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서7",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.07 18:00:00",
  },
  {
    id: "8",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서8",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.08 19:00:00",
  },
  {
    id: "9",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서9",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.09 20:00:00",
  },
  {
    id: "10",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서10",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.10 21:00:00",
  },
  {
    id: "11",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서11",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.11 22:00:00",
  },
  {
    id: "12",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서12",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.12 23:00:00",
  },
  {
    id: "13",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서1",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.01 12:00:00",
  },
  {
    id: "14",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서2",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.02 13:00:00",
  },
  {
    id: "15",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서3",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.03 14:00:00",
  },
  {
    id: "16",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서4",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.04 15:00:00",
  },
  {
    id: "17",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서5",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.05 16:00:00",
  },
  {
    id: "18",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서6",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.06 17:00:00",
  },
  {
    id: "19",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서7",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.07 18:00:00",
  },
  {
    id: "20",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서8",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.08 19:00:00",
  },
  {
    id: "21",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서9",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.09 20:00:00",
  },
  {
    id: "22",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서10",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.10 21:00:00",
  },
  {
    id: "23",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서11",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.11 22:00:00",
  },
  {
    id: "24",
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서12",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.12 23:00:00",
  },
];

export default function ScrapsPage() {
  // 1. 필터링 적용
  // const [filterType, setFilterType] = useState<string>(""); // 구현 예정
  const [sortType, setSortType] = useState<string>("");

  const articles = useMemo(() => {
    let initialArticles = [...dummyClippingArticles];

    // 정렬
    if (sortType) {
      initialArticles.sort((a, b) => {
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
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return initialArticles;
  }, [sortType]);

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
    <div className="flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <TitleBar
        title="Clipping articles"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />

      <article className="flex flex-col gap-y-12 last:gap-y-[7.75rem]">
        <div className="inline-flex h-11 items-center justify-between">
          <h2 className="text-[2rem] font-medium -tracking-[0.01em] text-gray-dark">
            Library
          </h2>
          <div className="inline-flex gap-x-[0.563rem]">
            {/* <Dropdown type="type" onSelectFilter={setFilterType} /> */}
            <Dropdown type="sort" onSelectFilter={setSortType} />
          </div>
        </div>

        <div className="flex-between-center relative grid grid-cols-3 gap-6">
          {currentArticles?.map((article) => (
            <Link href={`/vuldb/items/${article.id}`} key={article.id}>
              <ClippingArticle {...article} />
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
      </article>
    </div>
  );
}
