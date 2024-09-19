import { auth } from "@/auth";
import Search from "@/components/vulnerability-db/Search";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { getAllPosts } from "@/lib/api/posts";
import { getUserPinnedPosts } from "@/lib/api/users";
import { VulDBPost, VulDBPostWithChip } from "@/types/post";
import { Timestamp } from "firebase/firestore";

const applyChips = (posts: VulDBPost[]): VulDBPostWithChip[] => {
  const now = new Date();

  try {
    // 조회수 기준으로 상위 10개의 hot 게시글 선정
    const hotPosts = posts
      .filter((post) => post.views && post.views > 0)
      .slice()
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return posts.map((post) => {
      const postDate = post.created_at
        ? new Timestamp(
            post.created_at.seconds,
            post.created_at.nanoseconds,
          ).toDate()
        : new Date(0);

      const diffInHours =
        (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

      // 48시간 이내에 생성된 게시글은 "new" chip을 받음
      const isNew = diffInHours <= 48;

      // 조회수 상위 10개에 포함된 게시글은 "hot" chip을 받음
      const isHot = hotPosts.some((hotPost) => hotPost.id === post.id);

      // new지만 hot에 포함된 경우 "hot"으로 처리
      const chip: "hot" | "new" | "" = isHot ? "hot" : isNew ? "new" : "";

      return {
        ...post,
        chip,
        isScrapped: false,
      };
    });
  } catch (error) {
    console.error("applyChips 함수에서 오류 발생: ", error);
    return [];
  }
};

export default async function VulDBPage() {
  try {
    const posts = (await getAllPosts()) || [];
    const session = await auth();
    const userId = session?.user?.userId;

    const postsWithScrap = await getUserPinnedPosts(userId);

    if (posts.length === 0) {
      return (
        <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
          현재 이용 가능한 게시글이 없습니다.
        </p>
      );
    }

    const postsWithChips = applyChips(posts);
    // 최신 게시물을 created_at 기준으로 정렬 + 동일한 created_at일 경우 id 기준 정렬
    const sortedPostsByDate = postsWithChips.sort((a, b) => {
      const dateA = a.created_at
        ? new Timestamp(a.created_at.seconds, a.created_at.nanoseconds).toDate()
        : new Date(0);

      const dateB = b.created_at
        ? new Timestamp(b.created_at.seconds, b.created_at.nanoseconds).toDate()
        : new Date(0);

      return dateB.getTime() === dateA.getTime()
        ? a.id.localeCompare(b.id)
        : dateB.getTime() - dateA.getTime();
    });

    const top3RecentPosts = sortedPostsByDate.slice(0, 3);

    return (
      <div className="relative mx-auto mb-[1.188rem] mt-[1.688rem] flex min-h-[2445px] w-[82.063rem] flex-col gap-[4.75rem] px-[1rem]">
        <VulDBImageCardContainer posts={top3RecentPosts} />
        <Search initialPosts={postsWithChips} postsWithScrap={postsWithScrap} />
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
