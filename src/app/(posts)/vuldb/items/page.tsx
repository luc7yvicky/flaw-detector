import VulDBDashboard from "@/components/vulnerability-db/VulDBDashboard";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { getAllPosts } from "@/lib/api/posts";
import { VulDBPost, VulDBPostWithChip } from "@/types/post";
import { Timestamp } from "firebase/firestore";

/** Hot chip 또는 New chip을 적용하는 함수 */
const applyChips = (posts: VulDBPost[]): VulDBPostWithChip[] => {
  const now = new Date();

  // 조회수 기준으로 상위 10개의 hot 게시글 선정
  const hotPosts = posts
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return posts.map((post) => {
    const postDate = new Timestamp(
      post.created_at.seconds,
      post.created_at.nanoseconds,
    ).toDate();
    const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

    // 48시간 이내에 생성된 게시글은 "new" chip을 받음
    const isNew = diffInHours <= 48;

    // 조회수 상위 10개에 포함된 게시글은 "hot" chip을 받음
    const isHot = hotPosts.some((hotPost) => hotPost.id === post.id);

    // new지만 hot에 포함된 경우 "hot"으로 처리
    const chip: "hot" | "new" | "" = isHot ? "hot" : isNew ? "new" : "";

    return {
      ...post,
      chip,
    };
  });
};

export default async function VulDBPage() {
  try {
    const posts = (await getAllPosts()) || [];

    if (posts.length === 0) {
      return (
        <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
          현재 이용 가능한 게시글이 없습니다.
        </p>
      );
    }

    const postsWithChips = applyChips(posts);

    return (
      <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
        <VulDBImageCardContainer posts={posts} />
        <VulDBDashboard posts={postsWithChips} />
        {/* 취약점 DB & 실시간 Topic */}
      </div>
    );
  } catch (error) {
    return (
      <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
        게시글을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </p>
    );
  }
}
