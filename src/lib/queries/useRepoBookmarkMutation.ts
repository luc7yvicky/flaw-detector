import { RepoBookmarkParams, RepoListData } from "@/types/repo";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const updateFavoriteRepo = async ({
  owner,
  repo,
  favorite,
}: RepoBookmarkParams) => {
  const res = await fetch("/api/repos", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner, repo, favorite }),
  });

  if (!res.ok) {
    throw new Error("북마크 업데이트 중 오류가 발생했습니다.");
  }

  return res.json();
};

export const useRepoBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFavoriteRepo,
    onMutate: async (newData) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ["repos"], exact: false });

      // 이전 상태 저장
      const activeQuery = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["repos"], exact: false } as QueryFilters);
      const prevData = activeQuery[0]?.state.data;

      // 캐시 업데이트
      activeQuery.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (old: any) => ({
          ...old,
          repos: old.repos.map((repo: RepoListData) =>
            repo.repositoryName === newData.repo
              ? { ...repo, favorite: !repo.favorite }
              : repo,
          ),
        }));
      });

      // 롤백을 위해 이전 상태 반환
      return { prevData };
    },
    onError: (err, _, context) => {
      // 실패 시 이전 상태로 복구
      if (context?.prevData) {
        queryClient.setQueryData(["repos"], context?.prevData);
      }
      console.error(err.message);
    },
    onSettled: () => {
      // 서버 상태와 동기화
      queryClient.invalidateQueries({ queryKey: ["repos"] });
    },
  });
};
