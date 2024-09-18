import { auth } from "@/auth";
import ScrappedArticleList from "@/components/me/ScrappedArticleList";
import TitleBar from "@/components/ui/TitleBar";
import { BASE_URL } from "@/lib/const";
import { ArticleListItem } from "@/types/post";

export default async function ScrapsPage() {
  const session = await auth();
  let articles: ArticleListItem[] = [];
  let error = "";

  try {
    const res = await fetch(
      `${BASE_URL}/api/scraps?username=${session?.user?.username}`,
    );

    if (!res.ok) {
      error = "게시물을 가져오는 데 실패했습니다. 다시 시도해주세요.";
      throw new Error("Failed to fetch scrapped article data from server.");
    }

    const data = await res.json();

    if (data.status) {
      error = data.message;
    }

    articles = data;
  } catch (err) {
    error = "게시물을 가져오는 데 실패했습니다. 다시 시도해주세요.";
    throw new Error(`Failed to fetch scrapped article data ${err}`);
  }

  return (
    <div className="mb-[7.75rem] flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <TitleBar
        title="Clipping articles"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />
      {Array.isArray(articles) && articles.length !== 0 ? (
        <ScrappedArticleList initialArticles={articles} />
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
