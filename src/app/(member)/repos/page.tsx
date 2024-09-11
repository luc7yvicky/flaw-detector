import { auth } from "@/auth";
import BookmarkButton from "@/components/me/BookmarkButton";
import Profile from "@/components/me/Profile";
import RecentFilesButton from "@/components/me/RecentFilesButton";
import RepoList from "@/components/me/RepoList";
import { IconCaretLeft } from "@/components/ui/Icons";
import TitleBar from "@/components/ui/TitleBar";
import { getRepoListFromDB } from "@/lib/api/repositories";
import { RepoListData } from "@/types/repo";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function ReposPage() {
  const session = await auth();
  const username = session?.user?.username;

  const params = new URLSearchParams();
  if (username) {
    params.append("username", username);
  }
  const repos: RepoListData[] = await getRepoListFromDB(params);

  return (
    <div className="mb-[8.536rem] flex w-full min-w-[64rem] max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <Image
        src="/images/myReposBg.png"
        alt="my repos bg"
        width={1920}
        height={1272}
        priority
        className="absolute left-0 -z-10"
      />
      <div className="flex-col-center-center mt-[3.5rem] gap-y-5">
        <span className="text-[3.75rem] font-light leading-[1.2] -tracking-[0.01em] text-primary-500">
          containing code files
        </span>
        <TitleBar
          title="My Library"
          align="center"
          className="mb-0 h-full bg-white"
          h1ClassName="border-[0.25rem] px-10 py-[1.156rem] text-[3.75rem] leading-[1.1]"
          hasBackButton={false}
        />
      </div>

      <div className="flex flex-col gap-y-7">
        <section className="flex flex-col gap-y-20">
          <div className="flex-between-center h-fit gap-4 rounded-[2.625rem] bg-neutral-5 p-8">
            <Profile />
            <Link href="/me">
              <IconCaretLeft className="fill-[rgba(52, 51, 48, 1)] size-12 rotate-180" />
            </Link>
          </div>
        </section>

        <section className="flex-between-center gap-x-[1.313rem]">
          <RecentFilesButton />
          <BookmarkButton />
        </section>

        <Suspense fallback={<div>Loading repos...</div>}>
          <RepoList initialRepos={repos} username={username} />
        </Suspense>
      </div>
    </div>
  );
}
