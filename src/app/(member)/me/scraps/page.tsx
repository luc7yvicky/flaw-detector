import { auth } from "@/auth";
import ScrappedArticleListSkeleton from "@/components/me/ScrappedArticleListSkeleton";
import TitleBar from "@/components/ui/TitleBar";
import { fetchArticleList } from "@/lib/api/users";
import { ArticleListItem } from "@/types/post";
import dynamic from "next/dynamic";

const ScrappedArticleList = dynamic(
  () => import("@/components/me/ScrappedArticleList"),
  {
    ssr: false,
    loading: () => <ScrappedArticleListSkeleton />,
  },
);

export default async function ScrapsPage() {
  const session = await auth();
  let error = "";

  if (!session?.user?.username) {
    error = "사용자 정보를 가져오는 데 실패했습니다.";
  }

  const result = await fetchArticleList(session?.user.username);

  if (result.message) {
    error = result.message || "게시물을 찾을 수 없습니다.";
  }

  const { posts, totalPage }: { posts: ArticleListItem[]; totalPage: number } =
    result;

  return (
    <div className="mb-[7.75rem] flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <TitleBar
        title="Clipping articles"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />
      {posts && Array.isArray(posts) ? (
        <ScrappedArticleList initialArticles={posts} totalPage={totalPage} />
      ) : (
        <div className="flex-col-center-center w-full gap-y-[0.625rem] 1150:h-[30.75rem]">
          <p className="text-[2rem] font-semibold leading-[2.8rem] tracking-[0.015em] text-gray-dark">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
