"use client";

import { useSessionStore } from "@/context/SessionProvider";
import { cn } from "@/lib/utils";
import { RepoBookmarkParams, RepoBookmarkProps } from "@/types/repo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { memo, useCallback, useState } from "react";
import ExceptionHandlingMessage from "../vulnerability-db/ExceptionHandlingMessage";

const IconStar = dynamic(() => import("@/components/ui/icons/IconStar"));

const updateFavoriteRepo = async ({
  owner,
  repo,
  isBookmarked,
}: RepoBookmarkParams) => {
  return await fetch("/api/repos", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      owner,
      repo,
      isBookmarked,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("북마크 업데이트 중 오류가 발생했습니다.");
    }
    res.json();
  });
};

const RepoBookmark = ({ repo, isBookmarked }: RepoBookmarkProps) => {
  const { user } = useSessionStore<Session>((state) => state);
  const [isSelected, setIsSelected] = useState(isBookmarked);
  const queryClient = useQueryClient();

  if (!user) {
    throw new Error("잘못된 접근입니다.");
  }

  const { mutate } = useMutation({
    mutationFn: updateFavoriteRepo,
    onMutate: async (newBookmark) => {
      await queryClient.cancelQueries({ queryKey: ["repos"] });

      const prevRepoData = queryClient.getQueryData(["repos"]);

      queryClient.setQueryData(["repos"], (old: RepoBookmarkParams) => ({
        ...old,
        isBookmarked: newBookmark,
      }));

      return { prevRepoData };
    },
    onError: (err, _, context) => {
      // 실패 시 이전 상태로 복구
      queryClient.setQueryData(["repos"], context?.prevRepoData);
      setIsSelected(!isSelected);
      console.error(err.message);

      return (
        <ExceptionHandlingMessage
          situation="북마크를 업데이트 하는 중에 오류가 발생했습니다."
          solution="다시 시도해주세요"
        />
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["repos"] });
    },
  });

  const onToggleFavorite = useCallback(async () => {
    setIsSelected(!isSelected);
    mutate({
      owner: user.username,
      repo: repo,
      isBookmarked: !isSelected,
    });
  }, [user.username, repo, isSelected, mutate]);

  return (
    <div
      className={cn(
        "flex-center-center absolute right-0 top-0 size-12 cursor-pointer rounded-xl",
        isSelected
          ? "opacity-100"
          : "border-[0.083rem] border-primary-100 bg-white opacity-0 transition-opacity group-hover:opacity-100",
      )}
      onClick={onToggleFavorite}
    >
      {isSelected ? (
        <IconStar className="size-8 fill-primary-200 stroke-primary-200" />
      ) : (
        <IconStar className="size-8 bg-white fill-white stroke-primary-100" />
      )}
    </div>
  );
};

export default memo(RepoBookmark);
