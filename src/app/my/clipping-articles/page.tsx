"use client";

import { useEffect, useState } from "react";
import ClippingArticle from "@/components/analyze/ClippingArticle";
import Dropdown from "@/components/ui/Dropdown";
import { IconPlus } from "@/components/ui/Icons";

const ITEMS_PER_PAGE = 12;
const dummyclippingArticles = [
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서1",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.01 12:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서2",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.02 13:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서3",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.03 14:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서4",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.04 15:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서5",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.05 16:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서6",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.06 17:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서7",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.07 18:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서8",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.08 19:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서9",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.09 20:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서10",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.10 21:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서11",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.11 22:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서12",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.12 23:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서1",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.01 12:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서2",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.02 13:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서3",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.03 14:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서4",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.04 15:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서5",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.05 16:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서6",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.06 17:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서7",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.07 18:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서8",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.08 19:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서9",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.09 20:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서10",
    labelVariant: "clipping",
    labelText: "취약성 보고서",
    createdAt: "2023.10.10 21:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서11",
    labelVariant: "clipping-notify",
    labelText: "취약성 알림",
    createdAt: "2023.10.11 22:00:00",
  },
  {
    title: "Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서12",
    labelVariant: "clipping-warning",
    labelText: "취약성 경고",
    createdAt: "2023.10.12 23:00:00",
  },
];

export default function ClippingArticles() {
  const [currPage, setCurrPage] = useState<number>(1);
  const [clippingArticles, setClippingArticles] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClippingArticles(
        dummyclippingArticles.slice(0, currPage * ITEMS_PER_PAGE),
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [currPage]);

  return (
    <>
      <h1 className="flex-col-center-center mt-[4.5rem] gap-y-5 text-[2.5rem] font-normal leading-[3.026rem] -tracking-[0.01em] text-primary-500">
        <span className="rounded-full border-[0.25rem] border-primary-500 px-[1.25rem] py-[0.969rem]">
          Clipping articles
        </span>
      </h1>

      <section className="flex flex-col gap-y-12 last:gap-y-[7.75rem]">
        <div className="inline-flex h-11 items-center justify-between">
          <h2 className="text-[2rem] font-medium -tracking-[0.01em] text-gray-dark">
            Library
          </h2>
          <div className="inline-flex gap-x-[0.563rem]">
            <Dropdown type="type" />
            <Dropdown type="sort" />
          </div>
        </div>

        <div className="flex-between-center relative grid grid-cols-3 gap-x-6 gap-y-12">
          {clippingArticles.map((article, index) => (
            <ClippingArticle key={index} {...article} />
          ))}
        </div>

        {dummyclippingArticles.length > currPage * ITEMS_PER_PAGE && (
          <div className="flex-center-center">
            <button
              className="flex-center-center w-[7.688rem] gap-x-1 rounded-lg border border-primary-500 py-5 text-xl font-normal -tracking-[0.01em] text-primary-500"
              onClick={() => setCurrPage((prev) => prev + 1)}
            >
              <span>더보기</span>
              <IconPlus />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
