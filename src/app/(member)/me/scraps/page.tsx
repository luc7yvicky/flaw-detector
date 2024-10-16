import { auth } from "@/auth";
import ScrappedArticleListSkeleton from "@/components/me/ScrappedArticleListSkeleton";
import TitleBar from "@/components/ui/TitleBar";
import ExceptionHandlingMessage from "@/components/vulnerability-db/ExceptionHandlingMessage";
import { fetchArticleList } from "@/lib/api/users";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const ScrappedArticleList = dynamic(
  () => import("@/components/me/ScrappedArticleList"),
  {
    // ssr: false,
    loading: () => <ScrappedArticleListSkeleton />,
  },
);

export default async function ScrapsPage() {
  const session = await auth();

  if (!session?.user?.username) {
    redirect("/login");
  }

  const result = await fetchArticleList(session?.user.username);

  return (
    <div className="mb-[7.75rem] flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <TitleBar
        title="Clipping articles"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />
      {result.status === 200 ? (
        <ScrappedArticleList
          initialArticles={result.posts}
          totalPage={result.totalPage}
        />
      ) : (
        <div className="flex-col-center-center w-full gap-y-[0.625rem] 1150:h-[30.75rem]">
          <ExceptionHandlingMessage
            situation={
              result.situation || result.error || "게시물을 찾을 수 없습니다."
            }
            solution={result.solution || "다시 시도해주세요."}
          />
        </div>
      )}
    </div>
  );
}
