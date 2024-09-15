import { auth } from "@/auth";
import { Floating } from "@/components/ui/Floating";
import ArticleDetail from "@/components/vulnerability-db/ArticleDetail";
import SimilarInfoPosts from "@/components/vulnerability-db/SimilarInfoPosts";
import { getAllPosts } from "@/lib/api/posts";
import { redirectIfNotLoggedIn } from "@/lib/redirect";

export default async function VulnerabilityDBDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await redirectIfNotLoggedIn("/vuldb/items");
  const session = await auth();

  const postId = params.id;
  const userId = session?.user.userId;

  return (
    <div className="relative mx-auto mb-[8.596rem] mt-[2.063rem] flex w-[120rem] flex-col items-center gap-[3.75rem] px-[1rem]">
      <ArticleDetail userId={userId} postId={postId} />
      <SimilarInfoPosts postId={postId} userId={userId} />
      <div className="width-[4.75rem] absolute right-[8.75rem] top-[46.313rem]">
        <Floating variant="chat" className="fixed top-[46.313rem]" />
      </div>
    </div>
  );
}
