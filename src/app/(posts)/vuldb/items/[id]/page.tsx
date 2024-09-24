import { auth } from "@/auth";
import { Floating } from "@/components/ui/Floating";
import ArticleDetail from "@/components/vulnerability-db/ArticleDetail";
import SimilarInfoPosts from "@/components/vulnerability-db/SimilarInfoPosts";
import { redirectIfNotLoggedIn } from "@/lib/redirect";
import { redirect } from "next/navigation";

export default async function VulnerabilityDBDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    await redirectIfNotLoggedIn("/vuldb/items");

    const session = await auth();
    if (!session || !session.user) {
      throw new Error("로그인 정보가 유효하지 않습니다.");
    }

    const postId = params?.id;
    if (!postId) {
      throw new Error("게시물 ID가 유효하지 않습니다.");
    }

    const userId = session?.user.userId;
    if (!userId) {
      throw new Error("사용자 정보가 유효하지 않습니다.");
    }

    return (
      <div className="relative mx-auto mb-[8.596rem] mt-[2.063rem] flex w-full max-w-[120rem] flex-col items-center gap-[3.75rem] overflow-hidden px-[1rem]">
        <ArticleDetail userId={userId} postId={postId} />
        <SimilarInfoPosts postId={postId} userId={userId} />
        <div className="width-[4.75rem] absolute right-[8.75rem] top-[46.313rem]">
          <Floating variant="chat" className="fixed top-[46.313rem]" />
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);

    redirect("/vuldb/items");
    return (
      <p className="text-center text-xl text-red-500">
        페이지를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
      </p>
    );
  }
}
