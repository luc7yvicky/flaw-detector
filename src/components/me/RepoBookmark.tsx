"use client";

import { useSessionStore } from "@/context/SessionProvider";
import { useRepoBookmark } from "@/lib/queries/useRepoBookmark";
import { cn } from "@/lib/utils";
import { RepoBookmarkProps } from "@/types/repo";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { memo, useCallback } from "react";

const IconStar = dynamic(() => import("@/components/ui/icons/IconStar"));

const RepoBookmark = ({ repo, favorite }: RepoBookmarkProps) => {
  const { user } = useSessionStore<Session>((state) => state);

  if (!user) {
    throw new Error("잘못된 접근입니다.");
  }

  const { mutate } = useRepoBookmark();

  const onToggleFavorite = useCallback(async () => {
    mutate({
      owner: user.username,
      repo: repo,
      favorite: !favorite,
    });
  }, [user.username, repo, favorite, mutate]);

  return (
    <div
      className={cn(
        "flex-center-center absolute right-0 top-0 size-12 cursor-pointer rounded-xl",
        favorite
          ? "opacity-100"
          : "border-[0.083rem] border-primary-100 bg-white opacity-0 transition-opacity group-hover:opacity-100",
      )}
      onClick={onToggleFavorite}
    >
      {favorite ? (
        <IconStar className="size-8 fill-primary-200 stroke-primary-200" />
      ) : (
        <IconStar className="size-8 bg-white fill-white stroke-primary-100" />
      )}
    </div>
  );
};

export default memo(RepoBookmark);
