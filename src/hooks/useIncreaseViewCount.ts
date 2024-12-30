import { increasePostViews } from "@/lib/api/posts";
import { useEffect, useRef } from "react";

export default function useIncreaseViewCount(postId: string) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!postId) {
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      increasePostViews(postId).catch((error) =>
        console.error("게시글 조회수 증가에 실패했습니다.", error),
      );
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [postId]);
}
