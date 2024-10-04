import { useQuery } from "@tanstack/react-query";
import { getTopHotPostIds } from "../api/posts";

export function useHotPostIds() {
  return useQuery<string[], Error>({
    queryKey: ["hotPostIds"],
    queryFn: getTopHotPostIds,
    staleTime: 1000 * 60 * 5,
  });
}
