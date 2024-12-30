import { auth } from "@/auth";
import InfoMessage from "@/components/ui/InfoMessage";
import ImageCardContainer from "@/components/vuldb/posts/ImageCardContainer";
import VulDBMainContent from "@/components/vuldb/posts/VulDBMainContent";
import { BASE_URL } from "@/lib/const";

async function fetchLatestPosts() {
  const res = await fetch(`${BASE_URL}/api/posts/latest`, {
    cache: "force-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch latest posts");
  }
  return res.json();
}

export default async function VulDBPage() {
  try {
    const response = await fetchLatestPosts();
    const latestPosts = response.results || [];

    const session = await auth();
    const userId = session?.user?.userId || null;

    return (
      <div className="relative mx-auto mt-[1.688rem] flex min-h-[147rem] w-full max-w-[82.063rem] flex-col gap-[4.75rem] overflow-hidden px-[1rem]">
        <ImageCardContainer posts={latestPosts} />
        <VulDBMainContent userId={userId} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <InfoMessage
        situation="게시글을 불러오는 중 오류가 발생했습니다."
        solution="새로고침하거나 잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요."
      />
    );
  }
}
