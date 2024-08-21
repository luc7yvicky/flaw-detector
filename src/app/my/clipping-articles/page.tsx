"use client";

import { useEffect, useState } from "react";
import ClippingArticle from "@/components/my/ClippingArticle";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import { IconPlus } from "@/components/ui/Icons";
import TitleBar from "@/components/ui/TitleBar";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;
const dummyClippingArticles = [
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

export default function ClippingArticlesPage() {
  const [currPage, setCurrPage] = useState<number>(1);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(dummyClippingArticles.slice(0, currPage * ITEMS_PER_PAGE));
    }, 500);

    return () => clearTimeout(timer);
  }, [currPage]);

  return (
    <>
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
            <Dropdown type="type" />
            <Dropdown type="sort" />
          </div>
        </div>

        <div className="flex-between-center relative grid grid-cols-3 gap-6">
          {articles &&
            articles.map((article) => (
              <Link href={`/vulnerability-db/${article.id}`} key={article.id}>
                <ClippingArticle {...article} />
              </Link>
            ))}
        </div>

        {dummyClippingArticles.length > currPage * ITEMS_PER_PAGE && (
          <div className="flex-center-center">
            <Button
              variant="outlined"
              shape="rounded"
              className="flex-center-center w-[7.688rem] gap-x-1 border py-5 text-xl font-normal"
              onClick={() => setCurrPage((prev) => prev + 1)}
            >
              <span>더보기</span>
              <IconPlus />
            </Button>
          </div>
        )}
      </article>
    </>
  );
}
