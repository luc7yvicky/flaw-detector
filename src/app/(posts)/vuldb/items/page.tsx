import VulDBDashboard from "@/components/vulnerability-db/VulDBDashboard";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { getAllPosts } from "@/lib/api/posts";

export default async function VulDBPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
      <VulDBImageCardContainer posts={posts} />
      <VulDBDashboard posts={posts} /> {/* 취약점 DB & 실시간 Topic */}
    </div>
  );
}
