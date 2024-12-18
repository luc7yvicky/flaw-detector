import { increasePostViews } from "@/lib/api/posts";
import { useEffect, useRef } from "react";

export default function useIncreaseViewCount(postId: string) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      increasePostViews(postId);
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [postId]);
}
