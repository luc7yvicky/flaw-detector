"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { IconCaretLeft } from "@/components/ui/Icons";
import TitleBar from "@/components/ui/TitleBar";
import Profile from "@/components/my/Profile";
import Repo from "@/components/my/Repo";

const ITEMS_PER_PAGE = 12;
const dummyRepos = [
  { id: "1", label: "label", repositoryName: "sfac-web-1", caption: "Caption" },
  { id: "2", label: "label", repositoryName: "sfac-web-2", caption: "Caption" },
  { id: "3", label: "label", repositoryName: "sfac-web-3", caption: "Caption" },
  { id: "4", label: "label", repositoryName: "sfac-web-4", caption: "Caption" },
  { id: "5", label: "label", repositoryName: "sfac-web-5", caption: "Caption" },
  { id: "6", label: "label", repositoryName: "sfac-web-6", caption: "Caption" },
  { id: "7", label: "label", repositoryName: "sfac-web-7", caption: "Caption" },
  { id: "8", label: "label", repositoryName: "sfac-web-8", caption: "Caption" },
  { id: "9", label: "label", repositoryName: "sfac-web-9", caption: "Caption" },
  {
    id: "10",
    label: "label",
    repositoryName: "sfac-web-10",
    caption: "Caption",
  },
  {
    id: "11",
    label: "label",
    repositoryName: "sfac-web-11",
    caption: "Caption",
  },
  {
    id: "12",
    label: "label",
    repositoryName: "sfac-web-12",
    caption: "Caption",
  },
  {
    id: "13",
    label: "label",
    repositoryName: "sfac-web-13",
    caption: "Caption",
  },
];

export default function ReposPage() {
  const [currPage, setCurrPage] = useState<number>(1);
  const [lastPageIndex] = useState<number>(
    Math.ceil(dummyRepos.length / ITEMS_PER_PAGE),
  );
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    setRepos(
      dummyRepos.slice(
        (currPage - 1) * ITEMS_PER_PAGE,
        currPage * ITEMS_PER_PAGE,
      ),
    );
    // setLastPageIndex(Math.ceil(dummyRepos.length / ITEMS_PER_PAGE));
  }, [currPage]);

  return (
    <>
      <div className="flex-col-center-center mt-[3.5rem] gap-y-5">
        <span className="text-[3.75rem] font-light leading-[1.2] -tracking-[0.01em] text-primary-500">
          containing code files
        </span>
        <TitleBar
          title="My Library"
          align="center"
          className="mb-0 h-full"
          h1ClassName="border-[0.25rem] px-10 py-[1.156rem] text-[3.75rem] leading-[1.1]"
          hasBackButton={false}
        />
      </div>

      <div className="flex flex-col gap-y-20">
        <section className="flex flex-col gap-y-20">
          <div className="flex-between-center h-[6.688rem] gap-4">
            <Profile avatar="/images/user.png" email="marry@gmail.com" />
            <Link href="/my/profile">
              <Button
                variant="outlined"
                className="flex-center-center px-5 py-4 text-2xl font-medium"
              >
                프로필 정보
              </Button>
            </Link>
          </div>
          <hr />
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

          <div className="relative grid grid-cols-4 grid-rows-3 gap-x-6 gap-y-12">
            {repos &&
              repos.map((repo) => (
                <Link
                  href={repo.id ? `/analyze/${repo.id}` : "#"}
                  key={repo.id}
                >
                  <Repo {...repo} />
                </Link>
              ))}

            {currPage > 1 && (
              <Button
                variant="navigation"
                shape="pill"
                className="-left-6"
                onClick={() => setCurrPage((prev) => Math.max(prev - 1, 0))}
                aria-label="Previous Page"
              >
                <IconCaretLeft className="fill-#343330" />
              </Button>
            )}

            {currPage < lastPageIndex && (
              <Button
                variant="navigation"
                shape="pill"
                className="-right-6"
                onClick={() =>
                  setCurrPage((prev) => Math.min(prev + 1, lastPageIndex))
                }
                aria-label="Next Page"
              >
                <IconCaretLeft className="fill-#343330 rotate-180" />
              </Button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
