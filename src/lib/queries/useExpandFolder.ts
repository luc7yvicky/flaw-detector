import { useQuery } from "@tanstack/react-query";
import { expandFolder } from "@/lib/api/repositories";
import { RepoContentItem } from "@/types/repo";

export function useExpandFolder(
  username: string,
  repo: string,
  folder: RepoContentItem | null,
) {
  return useQuery({
    queryKey: ["folderContents", username, repo, folder?.path],
    queryFn: () =>
      folder ? expandFolder(username, repo, folder) : Promise.resolve(null),
    enabled:
      !!folder && folder.type === "dir" && folder.loadingStatus !== "loaded",
  });
}
