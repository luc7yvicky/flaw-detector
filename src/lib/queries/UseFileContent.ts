import { useQuery } from "@tanstack/react-query";
import { fetchCodes } from "@/lib/api/repositories";

export function useFileContent(
  username: string,
  repo: string,
  path: string | null,
) {
  return useQuery({
    queryKey: ["fileContent", username, repo, path],
    queryFn: () => (path ? fetchCodes(username, repo, path) : null),
    enabled: !!username && !!repo && !!path,
  });
}
