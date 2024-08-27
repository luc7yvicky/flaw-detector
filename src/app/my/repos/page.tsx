import Profile from "@/components/my/Profile";
import RepoList from "@/components/my/RepoList";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import TitleBar from "@/components/ui/TitleBar";
import { getRepoLists } from "@/lib/repositories";
import { RepoListData } from "@/types/type";
import Link from "next/link";
import { Suspense } from "react";

export default async function ReposPage() {
  const repos: RepoListData[] = await getRepoLists();
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
          <Suspense fallback={<div>Loading repos...</div>}>
            <RepoList initialRepos={repos} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
