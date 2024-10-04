"use client";

import { useSessionStore } from "@/context/SessionProvider";
import { cn } from "@/lib/utils";
import { memo, useCallback, useState } from "react";
import { IconStar } from "../ui/Icons";

const RepoBookmark = ({
  repo,
  isBookmarked,
}: {
  repo: string;
  isBookmarked: boolean;
}) => {
  const { user } = useSessionStore((state) => state);
  const [isSelected, setIsSelected] = useState(isBookmarked);

  if (!user) {
    throw new Error("잘못된 접근입니다.");
  }

  const onToggleFavorite = useCallback(async () => {
    setIsSelected(!isSelected);

    try {
      const res = await fetch("/api/repos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user?.username,
          repoName: repo,
          favorite: !isSelected,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save results.");
      }
    } catch (err) {
      console.error("Error adding results:", err);
    }
  }, [isSelected, repo, user]);

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
