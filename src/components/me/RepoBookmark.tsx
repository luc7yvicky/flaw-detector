"use client";

import { useSessionStore } from "@/context/SessionProvider";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import { memo, useCallback, useState } from "react";
import { IconStar } from "../ui/Icons";
import ExceptionHandlingMessage from "../vulnerability-db/ExceptionHandlingMessage";

const updateFavoriteRepo = async (
  username: string,
  repoName: string,
  favorite: boolean,
) => {
  return await fetch("/api/repos", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      repoName,
      favorite,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("북마크 업데이트 중 오류가 발생했습니다.");
    }
    res.json();
  });
};

const RepoBookmark = ({
  repo,
  isBookmarked,
}: {
  repo: string;
  isBookmarked: boolean;
}) => {
  const { user } = useSessionStore<Session>((state) => state);

  if (!user) {
    throw new Error("잘못된 접근입니다.");
  }

  const [isSelected, setIsSelected] = useState(isBookmarked);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({
      username,
      repoName,
      favorite,
    }: {
      username: string;
      repoName: string;
      favorite: boolean;
    }) => {
      await updateFavoriteRepo(username, repoName, favorite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repos"] });
    },
    onError: (error: Error) => {
      console.error(error.message);
      setIsSelected(isBookmarked);
      return (
        <ExceptionHandlingMessage
          situation="북마크를 업데이트 하는 중에 오류가 발생했습니다."
          solution="다시 시도해주세요"
        />
      );
    },
  });

  const onToggleFavorite = useCallback(async () => {
    setIsSelected(!isSelected);
    mutate({ username: user.username, repoName: repo, favorite: !isSelected });
  }, [isSelected, repo, user, mutate]);

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
