"use client";

import SearchBox from "@/components/vuldb/posts/SearchBox";

import { fetchPosts } from "@/lib/api/posts";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import RealTimeTopic from "./RealTimeTopic";
import PostFilterSection from "./PostFilterSection";
import PostList from "./PostList";
import VulDBMainSkeleton from "./VulDBMainSkeleton";

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

export default function VulDBMainContent({ userId }: { userId: number }) {
  const [filter, setFilter] = useState<"all" | "hot" | "new">("all");
  const [searchTerm, setSearchTerm] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", userId, filter, searchTerm, currentPage],
    queryFn: async () =>
      await fetchPosts({
        userId: userId ?? 0,
        filter,
        searchTerm,
        currentPage,
      }),

    staleTime: 10 * 60 * 1000, // 10분
    placeholderData: keepPreviousData,
  });

  const onChangeFilter = (chip: "hot" | "new" | "all") => {
    setFilter(filter === chip ? "all" : chip);
    setCurrentPage(1);
  };

  return (
    <>
      <SearchBox
        setCurrentPage={setCurrentPage}
        setSearchTerm={setSearchTerm}
      />
      <div className="grid grid-cols-[1fr_22rem] gap-5">
        <>
          {isLoading && !data && <VulDBMainSkeleton />}
          {!isLoading && data && (
            <>
              <PostFilterSection
                filter={filter}
                onChangeFilter={onChangeFilter}
                isLoggedIn={userId !== null}
              >
                <PostList
                  posts={data?.posts || []}
                  selectedChip={filter}
                  userId={userId}
                  hasSearchTerm={searchTerm.length > 0}
                />
              </PostFilterSection>

              <Pagination
                className={cn(
                  "absolute bottom-20 left-1/2 -translate-x-1/2 transform",
                  !userId && "pointer-events-none",
                )}
                currentPage={currentPage}
                totalPages={data?.totalPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </>
        <RealTimeTopic />
      </div>
    </>
  );
}
