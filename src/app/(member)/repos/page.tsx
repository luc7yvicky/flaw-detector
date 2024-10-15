import { auth } from "@/auth";
import Profile from "@/components/me/Profile";
import RepoFilterButton from "@/components/me/RepoFilterButton";
import RepoList from "@/components/me/RepoList";
import { IconCaretLeft } from "@/components/ui/Icons";
import TitleBar from "@/components/ui/TitleBar";
import { getRepoListFromDB, getRepoLists } from "@/lib/api/repositories";
import { RepoListData } from "@/types/repo";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

/**
 * 깃허브 레포지토리 리스트 불러오기
 *
 * @param username
 * @returns {Promise<any>}
 */
const fetchRepoList = async (username: string): Promise<any> => {
  // 1. 깃허브에서 레포지토리 리스트 불러와서 저장
  await getRepoLists(username);

  // 2. DB에서 레포지토리 리스트 불러오기
  const params = new URLSearchParams();
  params.append("username", username);
  return await getRepoListFromDB(params);
};

export default async function ReposPage() {
  const session = await auth();
  const username = session?.user?.username;

  if (!username) {
    throw new Error("잘못된 접근입니다.");
  }

  const repos: RepoListData[] = await fetchRepoList(username);

  return (
    <div className="mb-[8.536rem] flex w-full min-w-[64rem] max-w-[82.125rem] flex-col gap-y-[7.75rem] px-[1rem]">
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
          <Link href="/me" className="pointer-events-none">
            <div className="flex-between-center pointer-events-auto h-fit gap-4 rounded-[2.625rem] bg-neutral-5 p-8 hover:bg-[#ededed]">
              <Profile />
              <IconCaretLeft className="fill-[rgba(52, 51, 48, 1)] size-12 rotate-180" />
            </div>
          </Link>
        </section>

        <section className="flex-between-center gap-x-[1.313rem]">
          <RepoFilterButton type="recent-files" />
          <RepoFilterButton type="bookmark" />
        </section>

        <Suspense fallback={<div>Loading repos...</div>}>
          <RepoList initialRepos={repos} username={username} />
        </Suspense>
      </div>
    </div>
  );
}
