"use client";

import DetailContent from "@/components/vuldb/detail/Content";
import { fetchPostAndSimilarPosts } from "@/lib/api/posts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import DetailHeader from "./Header";
import DetailPageSkeleton from "./DetailPageSkeleton";

const SimilarPostList = dynamic(() => import("./SimilarPostList"));

export default function DetailPageContainer({
  postId,
  userId,
}: {
  postId: string;
  userId: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["postAndSimilarPosts", postId, userId],
    queryFn: async () => await fetchPostAndSimilarPosts({ postId, userId }),
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (data) {
    const { post, latestPosts } = data;
    return (
      <>
        <DetailHeader post={post} userId={userId} />
        <DetailContent post={post} />
        <SimilarPostList userId={userId} posts={latestPosts} />
      </>
    );
  }
}
