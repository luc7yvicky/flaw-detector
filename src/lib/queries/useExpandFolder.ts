import { useQuery } from "@tanstack/react-query";
import { expandFolder } from "@/lib/api/repositories";
import { FolderItem, RepoContentItem } from "@/types/repo";


export function useExpandFolder(
  username: string,
  repo: string,
  folder: FolderItem | null,
) {
  return useQuery<FolderItem | null, Error>({
    queryKey: ["folderContents", username, repo, folder?.path],
    queryFn: async () => {
      if (!folder) return null;
      return await expandFolder(username, repo, folder);
    },
    enabled: !!folder && folder.folderExpandStatus !== "expanded",
  });
}
