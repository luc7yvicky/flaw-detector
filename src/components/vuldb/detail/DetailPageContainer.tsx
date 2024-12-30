"use client";

import InfoMessage from "@/components/ui/InfoMessage";
import DetailContent from "@/components/vuldb/detail/Content";
import { fetchPostAndSimilarPosts } from "@/lib/api/posts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import DetailPageSkeleton from "./DetailPageSkeleton";
import DetailHeader from "./Header";

const SimilarPostList = dynamic(() => import("./SimilarPostList"));

export default function DetailPageContainer({
  postId,
  userId,
}: {
  postId: string;
  userId: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["postAndSimilarPosts", postId, userId],
    queryFn: async () => await fetchPostAndSimilarPosts({ postId, userId }),
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError) {
    return (
      <InfoMessage
        situation="게시글을 불러오는 중 오류가 발생했습니다."
        solution="새로고침하거나 잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요."
      />
    );
  }

  if (!data) {
    return (
      <InfoMessage
        situation="게시글을 찾을 수 없습니다."
        solution="다른 게시글을 선택해주세요."
      />
    );
  }

  const { post, latestPosts } = data;

  return (
    <>
      <DetailHeader post={post} userId={userId} />
      <DetailContent post={post} />
      <SimilarPostList userId={userId} posts={latestPosts} />
    </>
  );
}
