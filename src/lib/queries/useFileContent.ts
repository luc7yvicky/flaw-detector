import { useQuery } from "@tanstack/react-query";
import { fetchCodes } from "@/lib/api/repositories";
import { getLanguage } from "../utils";

type FileContentResult =
  | { type: "code"; content: string; language: string; path: string }
  | { type: "image"; message: string; path: string }
  | null;

export function useFileContent(
  username: string,
  repo: string,
  path: string | null,
) {
  return useQuery<FileContentResult, Error>({
    queryKey: ["fileContent", username, repo, path],
    queryFn: async () => {
      if (!path) return null;

      const language = getLanguage(path);
      if (language === "image") {
        return {
          type: "image",
          message: "이미지 파일은 미리보기를 지원하지 않습니다.",
          path,
        };
      }

      try {
        const content = await fetchCodes(username, repo, path);
        return { type: "code", content, language, path };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "파일 내용을 가져오는 중 알 수 없는 오류가 발생했습니다.",
        );
      }
    },
    enabled: !!username && !!repo && !!path,
    retry: 1, // 실패 시 1번 더 시도
    retryDelay: 1000,
  });
}
