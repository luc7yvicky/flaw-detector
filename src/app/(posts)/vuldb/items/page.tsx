"use client";

import RealTimeTopic from "@/components/vulnerability-db/RealTimeTopic";
import Search from "@/components/vulnerability-db/Search";
import VulDBDashboard from "@/components/vulnerability-db/VulDBDashboard";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import {
  VulDBDashboardSkeleton,
  VulDBImageCardContainerSkeleton,
} from "@/components/vulnerability-db/VulDBSkeleton";
import { useSessionStore } from "@/context/SessionProvider";
import { ITEMS_PER_DB_PAGE } from "@/lib/const";
import { useVulDBPosts } from "@/lib/queries/useVulDBPosts";
import { useState } from "react";

export default function VulDBPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChip, setSelectedChip] = useState<"hot" | "new" | "all">(
    "all",
  );
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

  return (
    <div className="relative mx-auto mt-[1.688rem] flex min-h-[147rem] w-full max-w-[82.063rem] flex-col gap-[4.75rem] overflow-hidden px-[1rem]">
      {postsLoading ? (
        <VulDBImageCardContainerSkeleton />
      ) : (
        <VulDBImageCardContainer posts={latestPosts} />
      )}
      <Search setCurrentPage={setCurrentPage} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-[1fr_22rem] gap-5">
        {postsLoading ? (
          <VulDBDashboardSkeleton />
        ) : (
          <VulDBDashboard
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setSelectedChip={setSelectedChip}
            selectedChip={selectedChip}
            userId={userId}
            prefetchPage={prefetchPage}
          />
        )}
        <RealTimeTopic />
      </div>
    </div>
  );
}
