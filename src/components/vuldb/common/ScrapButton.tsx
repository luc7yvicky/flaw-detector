"use client";

import { updatePinnedPost } from "@/lib/api/posts";
import { VulDBPinnedInfo } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import IconFilledPin from "@/components/ui/icons/IconFilledPin";
import IconPin from "@/components/ui/icons/IconPin";

export default function ScrapButton({
  pinnedInfo,
  isScrapped,
}: {
  pinnedInfo: VulDBPinnedInfo;
  isScrapped: boolean;
}) {
  const [isClicked, setIsClicked] = useState(isScrapped);
  const queryClient = useQueryClient();

  const addPinnedMutation = useMutation({
    mutationFn: async (info: VulDBPinnedInfo) => {
      await updatePinnedPost(info, "add");
    },
    onSuccess: () => {
      toast("📌 스크랩이 추가되었습니다");

      queryClient.setQueryData(
        ["posts", pinnedInfo.userId, "all", [], 1],
        (oldData: any) => {
          if (!oldData || !oldData.posts) return oldData;
          return {
            ...oldData,
            posts: oldData.posts.map((post: any) =>
              post.id === pinnedInfo.postId
                ? { ...post, isScrapped: true }
                : post,
            ),
          };
        },
      );

      queryClient.setQueryData(
        ["postAndSimilarPosts", pinnedInfo.postId, pinnedInfo.userId],
        (oldPost: any) => {
          if (!oldPost) return null;
          return { ...oldPost, isScrapped: true };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["postAndSimilarPosts", pinnedInfo.postId, pinnedInfo.userId],
      });
    },
    onError: () => {
      setIsClicked(isScrapped);
      toast("🚨 스크랩에 실패했습니다");
    },
  });

  const deletePinnedMutation = useMutation({
    mutationFn: async (info: VulDBPinnedInfo) => {
      await updatePinnedPost(info, "remove");
    },
    onSuccess: () => {
      toast("✅ 스크랩이 취소되었습니다");

      queryClient.setQueryData(
        ["posts", pinnedInfo.userId, "all", [], 1],
        (oldData: any) => {
          if (!oldData || !oldData.posts) return oldData;
          return {
            ...oldData,
            posts: oldData.posts.map((post: any) =>
              post.id === pinnedInfo.postId
                ? { ...post, isScrapped: false }
                : post,
            ),
          };
        },
      );

      queryClient.setQueryData(
        ["postAndSimilarPosts", pinnedInfo.postId, pinnedInfo.userId],
        (oldPost: any) => {
          if (!oldPost) return null;
          return { ...oldPost, isScrapped: false };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["postAndSimilarPosts", pinnedInfo.postId, pinnedInfo.userId],
      });
    },
    onError: () => {
      setIsClicked(isScrapped);
      toast("🚨 스크랩 취소에 실패했습니다");
    },
  });

  const onClickScrapButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (isScrapped || isClicked) {
      setIsClicked(false);
      deletePinnedMutation.mutate(pinnedInfo);
    } else {
      setIsClicked(true);
      addPinnedMutation.mutate(pinnedInfo);
    }
  };

  return (
    <button
      onClick={onClickScrapButton}
      aria-label="스크랩 버튼"
      className="p-1"
    >
      {isClicked ? <IconFilledPin /> : <IconPin />}
    </button>
  );
}
