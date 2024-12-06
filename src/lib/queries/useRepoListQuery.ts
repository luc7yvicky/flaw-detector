import { useQuery } from "@tanstack/react-query";
import { getRepoListFromDB } from "../api/repositories";
import { RepoListData } from "@/types/repo";

type UseRepoListQueryProps = {
  username: string;
  currPage: number;
  filterType: string;
  filterByBookmarked: boolean;
  filterByRecentClicked: boolean;
  initialRepos: RepoListData[];
  totalPage: number;
};

export const useRepoListQuery = ({
  username,
  currPage,
  filterType,
  filterByBookmarked,
  filterByRecentClicked,
  initialRepos,
  totalPage,
}: UseRepoListQueryProps) => {
  return useQuery({
    queryKey: [
      "repos",
      username,
      currPage,
      filterType,
      filterByBookmarked,
      filterByRecentClicked,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({ username });

      if (currPage) {
        params.append("page", currPage.toString());
      }

      if (filterType !== undefined) {
        params.append("filterType", filterType);
      }

      if (filterByBookmarked) {
        params.append("favorite", "true");
      }

      if (filterByRecentClicked) {
        params.append("clickedAt", "true");
      }

      const res = await getRepoListFromDB(params);
      return res;
    },
    enabled: false,
    initialData: { repos: initialRepos, totalPage },
  });
};
