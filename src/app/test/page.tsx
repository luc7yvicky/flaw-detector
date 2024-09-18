import { Suspense } from "react";
import RealTimeTopic from "@/components/vulnerability-db/RealTimeTopic";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { getAllPosts } from "@/lib/api/posts";
import SearchBar from "./_components/SearchBar";
// import SearchResult from "./_components/SearchResult";
import { applyChips } from "../(posts)/vuldb/items/page";
import { Timestamp } from "firebase/firestore";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import Search from "@/components/vulnerability-db/Search";
import VulDBDashboard from "@/components/vulnerability-db/VulDBDashboard";

// SearchResult 컴포넌트를 동적으로 로드하여 클라이언트 전용으로 만듭니다.
const SearchResult = dynamic(() => import("./_components/SearchResult"), {
  ssr: false,
});

export default async function VulDBPage() {
  try {
    const posts = (await getAllPosts()) || [];
    console.log("Posts fetched:", posts);

    if (posts.length === 0) {
      return (
        <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
          현재 이용 가능한 게시글이 없습니다.
        </p>
      );
    }

    const postsWithChips = applyChips(posts);
    const sortedPostsByDate = postsWithChips.sort((a, b) => {
      const dateA = new Timestamp(
        a.created_at.seconds,
        a.created_at.nanoseconds,
      ).toDate();
      const dateB = new Timestamp(
        b.created_at.seconds,
        b.created_at.nanoseconds,
      ).toDate();

      return dateB.getTime() === dateA.getTime()
        ? a.id.localeCompare(b.id)
        : dateB.getTime() - dateA.getTime();
    });

    const top3RecentPosts = sortedPostsByDate.slice(0, 3);

    return (
      <div className="relative mx-auto mb-[1.188rem] mt-[1.688rem] flex min-h-[2445px] w-[82.063rem] flex-col gap-[4.75rem] px-[1rem]">
        <VulDBImageCardContainer posts={top3RecentPosts} />
        <Suspense fallback={<div>로딩 중...</div>}>
          <SearchBar />
        </Suspense>
        <div className="flex justify-between">
          <VulDBDashboard posts={sortedPostsByDate} />
          <RealTimeTopic />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
        게시글을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </p>
    );
  }
}
