import ArticleDetail from "@/components/vulnerability-db/ArticleDetail";
import SimilarInfoPosts from "@/components/vulnerability-db/SimilarInfoPosts";
import { getPostById, increasePostViews } from "@/lib/api/posts";
import { redirectIfNotLoggedIn } from "@/lib/redirect";
import { VulDBPost } from "@/types/post";

export default async function VulnerabilityDBDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await redirectIfNotLoggedIn("/vuldb/items");

  const postId = params.id;
  await increasePostViews(postId);
  const post = (await getPostById(postId)) as VulDBPost;

  return (
    <>
      <div className="mb-[8.596rem] grid place-items-center">
        <ArticleDetail post={post} />
        {/* <VulnerabilityGrid /> */}
        <SimilarInfoPosts currentPostId={postId} />
      </div>
    </>
  );
}
