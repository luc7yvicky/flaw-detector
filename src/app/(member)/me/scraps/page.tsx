import { auth } from "@/auth";
import ScrappedArticleList from "@/components/me/ScrappedArticleList";
import TitleBar from "@/components/ui/TitleBar";
import { BASE_URL } from "@/lib/const";
import { ArticleListItem } from "@/types/post";

export const fetchArticleList = async (
  username: string,
  currPage: number = 1,
  labelType: string = "",
) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("page", currPage.toString());
  params.append("label", labelType);

  try {
    const res = await fetch(`${BASE_URL}/api/scraps?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      return {
        error:
          data.message ||
          "게시물을 가져오는 데 실패했습니다. 다시 시도해주세요.",
      };
    }

    return data;
  } catch (err) {
    return { error: "게시물을 가져오는 데 실패했습니다. 다시 시도해주세요." };
  }
};

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
      {posts && Array.isArray(posts) && posts?.length !== 0 ? (
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
