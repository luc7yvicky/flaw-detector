"use client";

import ExceptionHandlingMessage from "@/components/vulnerability-db/ExceptionHandlingMessage";
import RealTimeTopic from "@/components/vulnerability-db/RealTimeTopic";
import Search from "@/components/vulnerability-db/Search";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import VulDBNoPosts from "@/components/vulnerability-db/VulDBNoPosts";
import {
  VulDBDashboardSkeleton,
  VulDBImageCardContainerSkeleton,
} from "@/components/vulnerability-db/VulDBSkeleton";
import { ITEMS_PER_DB_PAGE } from "@/lib/const";
import { useVulDBPosts } from "@/lib/queries/useVulDBPosts";
import { useState } from "react";
import { useSessionStore } from "@/context/SessionProvider";

export default function VulDBPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChip, setSelectedChip] = useState<"hot" | "new" | "">("");
  const [searchTerm, setSearchTerm] = useState<string[]>([]);
  const { user } = useSessionStore((state) => state);
  const userId = user?.userId;
  const { posts, totalPages, postsLoading, latestPosts, prefetchPage } =
    useVulDBPosts(
      userId,
      currentPage,
      ITEMS_PER_DB_PAGE,
      selectedChip,
      searchTerm,
    );

  try {
    if (postsLoading) {
      return (
        <div className="relative mx-auto mt-[1.688rem] flex min-h-[147rem] w-full max-w-[82.063rem] flex-col gap-[4.75rem] overflow-hidden px-[1rem]">
          <VulDBImageCardContainerSkeleton />
          <div className="mt-[4.75rem] grid grid-cols-[1fr_22rem] gap-5">
            <VulDBDashboardSkeleton />
            <RealTimeTopic />
          </div>
        </div>
      );
    }

    // if (posts.length === 0 && userId && selectedChip === "") {
    //   return <VulDBNoPosts />;
    // }

    return (
      <div className="relative mx-auto mt-[1.688rem] flex min-h-[147rem] w-full max-w-[82.063rem] flex-col gap-[4.75rem] overflow-hidden px-[1rem]">
        <VulDBImageCardContainer posts={latestPosts} />
        <Search
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          setSelectedChip={setSelectedChip}
          selectedChip={selectedChip}
          userId={userId}
          prefetchPage={prefetchPage}
          setSearchTerm={setSearchTerm}
        />
      </div>
    );
  } catch (error) {
    return (
      <ExceptionHandlingMessage
        situation="게시글을 불러오는 중 오류가 발생했습니다!"
        solution="잠시 후 다시 시도해주세요."
      />
    );
  }
}
