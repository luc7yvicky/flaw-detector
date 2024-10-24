import { auth } from "@/auth";
import Profile from "@/components/me/Profile";
import { RepoHeader } from "@/components/me/RepoHeader";
import { RepoListSkeleton } from "@/components/me/RepoListSkeleton";
import { IconCaretLeft } from "@/components/ui/Icons";
import { getRepoListFromDB, getRepoLists } from "@/lib/api/repositories";
import { RepoListData } from "@/types/repo";
import dynamic from "next/dynamic";
import Link from "next/link";

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

const RepoList = dynamic(() => import("@/components/me/RepoList"), {
  // ssr: false,
  loading: () => <RepoListSkeleton />,
});

export default async function ReposPage() {
  const session = await auth();
  const username = session?.user?.username;

  if (!username) {
    throw new Error("잘못된 접근입니다.");
  }

  const { repos, totalPage }: { repos: RepoListData[]; totalPage: number } =
    await fetchRepoList(username);

  return (
    <div className="mb-[8.536rem] flex w-full min-w-[64rem] max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <RepoHeader />

      <div className="flex flex-col gap-y-7">
        <section className="flex flex-col gap-y-20">
          <Link href="/me" className="pointer-events-none">
            <div className="flex-between-center pointer-events-auto h-fit gap-4 rounded-[2.625rem] bg-neutral-5 p-8 hover:bg-[#ededed]">
              <Profile />
              <IconCaretLeft className="fill-[rgba(52, 51, 48, 1)] size-12 rotate-180" />
            </div>
          </Link>
        </section>

        <RepoList
          initialRepos={repos}
          totalPage={totalPage}
          username={username}
        />
      </div>
    </div>
  );
}
