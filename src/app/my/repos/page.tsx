"use client";

import Image from "next/image";
import Dropdown from "@/components/ui/Dropdown";
import Repo from "@/components/analyze/Repo";
import { useEffect, useState } from "react";
import { IconCaretLeft } from "@/components/ui/Icons";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;
const dummyRepos = [
  { label: "label", repositoryName: "sfac-web-1", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-2", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-3", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-4", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-5", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-6", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-7", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-8", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-9", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-10", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-11", caption: "Caption" },
  { label: "label", repositoryName: "sfac-web-12", caption: "Caption" },
];

export default function Repos() {
  const [currPage, setCurrPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    setRepos(
      dummyRepos.slice(
        (currPage - 1) * ITEMS_PER_PAGE,
        currPage * ITEMS_PER_PAGE,
      ),
    );
    setTotalPages(Math.ceil(12 / ITEMS_PER_PAGE));
  }, [currPage]);

  return (
    <>
      <h1 className="flex-col-center-center gap-y-5 text-[3.75rem] leading-[1.2] -tracking-[0.01em] text-primary-500">
        <span className="font-light">containing code files</span>
        <span className="rounded-full border-[0.25rem] border-primary-500 px-10 py-[1.156rem] leading-[1.1]">
          My Library
        </span>
      </h1>

      <div className="flex flex-col gap-y-20">
        <section className="flex flex-col gap-y-20">
          <div className="flex-between-center h-[6.688rem] gap-4">
            {/* User */}
            <div className="inline-flex items-center gap-x-[2.75rem]">
              <Image
                src={"/images/gear.png"}
                alt="avatar"
                width={108}
                height={108}
                priority
                className="h-[6.688rem] w-[6.688rem] rounded-[50%]"
              />
              <div className="flex-col-start-center text-[2.5rem] font-medium leading-tight -tracking-[0.01em] text-gray-dark">
                <span>Hello,</span>
                <span>marry@gmail.com</span>
              </div>
            </div>

            {/* 임시, Button */}
            <Link href="/my/profile">
              <button className="flex-center-center rounded-lg border-2 border-primary-500 px-5 py-4 text-2xl font-medium text-primary-500">
                프로필 정보
              </button>
            </Link>
          </div>

          <hr className="h-[0.063rem] w-full border-[#BABABA]" />
        </section>

        <section className="flex flex-col gap-y-12">
          <div className="inline-flex h-11 items-center justify-between">
            <h2 className="text-[2rem] font-medium -tracking-[0.01em] text-gray-dark">
              Library
            </h2>
            <div className="inline-flex gap-x-[0.563rem]">
              <Dropdown type="type" />
              <Dropdown type="sort" />
            </div>
          </div>

          <div className="flex-between-center relative grid grid-cols-4 gap-x-6 gap-y-12">
            {repos.map((repo, index) => (
              <Repo key={index} {...repo} />
            ))}

            {/* 임시, Button */}
            {currPage > 1 && (
              <button
                className="flex-center-center absolute -left-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
                onClick={() => setCurrPage((prev) => Math.max(prev - 1, 0))}
              >
                <IconCaretLeft className="fill-#343330" />
              </button>
            )}
            {currPage < totalPages - 1 && (
              <button
                className="flex-center-center absolute -right-6 bottom-[47%] h-[3.25rem] w-[3.25rem] rounded-[50%] border border-gray-dark bg-white"
                onClick={() =>
                  setCurrPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
              >
                <IconCaretLeft className="fill-#343330 rotate-180" />
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
