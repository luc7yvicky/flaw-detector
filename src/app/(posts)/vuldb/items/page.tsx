import VulDBDashboard from "@/components/vulnerability-db/VulDBDashboard";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { getAllPosts } from "@/lib/api/posts";

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

    return (
      <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
        <VulDBImageCardContainer posts={posts} />
        <VulDBDashboard posts={posts} /> {/* 취약점 DB & 실시간 Topic */}
      </div>
    );
  } catch (error) {
    return (
      <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
        게시물을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </p>
    );
  }
}
