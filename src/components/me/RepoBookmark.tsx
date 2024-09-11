"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { IconFilledStar, IconStar } from "../ui/Icons";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

function RepoBookmark({
  repo,
  isBookmarked,
}: {
  repo: string;
  isBookmarked: boolean;
}) {
  const { data: session } = useSession();
  const [isSelected, setIsSelected] = useState(isBookmarked);

  const onToggleFavorite = useCallback(async () => {
    try {
      const res = await fetch("/api/repos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: session?.user?.username,
          repoName: repo,
          favorite: !isSelected,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save results.");
      }

      setIsSelected(!isSelected);
    } catch (err) {
      console.error("Error adding results:", err);
    }
  }, [isSelected, repo, session]);

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
        <IconFilledStar className="size-8 fill-primary-200" />
      ) : (
        <IconStar className="size-8 bg-white fill-primary-100" />
      )}
    </div>
  );
}

export default memo(RepoBookmark);
