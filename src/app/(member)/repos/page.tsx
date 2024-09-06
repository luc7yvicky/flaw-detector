import { auth } from "@/auth";
import Profile from "@/components/me/Profile";
import RepoList from "@/components/me/RepoList";
import { IconCaretLeft } from "@/components/ui/Icons";
import TitleBar from "@/components/ui/TitleBar";
import { getRepoLists } from "@/lib/api/repositories";
import { RepoListData } from "@/types/repo";
import Link from "next/link";
import { Suspense } from "react";

export default async function ReposPage() {
  const session = await auth();
  const repos: RepoListData[] = await getRepoLists(session?.user?.username);

  return (
    <div className="flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
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
          <div className="flex-between-center h-fit gap-4 rounded-[2.625rem] bg-neutral-5 p-8">
            <Profile />
            <Link href="/me">
              <IconCaretLeft className="fill-[rgba(52, 51, 48, 1)] size-12 rotate-180" />
            </Link>
          </div>
          <hr />
        </section>

        <Suspense fallback={<div>Loading repos...</div>}>
          <RepoList initialRepos={repos} />
        </Suspense>
      </div>
    </div>
  );
}
