import Image from "next/image";
import Link from "next/link";
import Dropdown from "@/components/ui/Dropdown";
import { Suspense } from "react";
import { getRepoLists } from "@/lib/repositories";
import RepoList from "@/components/my/RepoList";
import { RepoListData } from "@/types/type";

export default async function Repos() {
  const repos: RepoListData[] = await getRepoLists();
  return (
    <>
      <h1 className="flex-col-center-center mt-[3.5rem] gap-y-5 text-[3.75rem] leading-[1.2] -tracking-[0.01em] text-primary-500">
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

          <Suspense fallback={<div>Loading repos...</div>}>
            <RepoList initialRepos={repos} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
