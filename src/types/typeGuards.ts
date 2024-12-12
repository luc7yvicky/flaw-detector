import { CertCCContent, CnnvdContent } from "./post";

// GitHub API 응답에 맞춘 타입 정의
type GitHubTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
};

// 파일 트리 타입 가드 함수
export function isValidTreeItem(item: any): item is GitHubTreeItem {
  return (
    typeof item.path === "string" &&
    typeof item.mode === "string" &&
    typeof item.type === "string" &&
    typeof item.sha === "string" &&
    typeof item.url === "string" &&
    (item.size === undefined || typeof item.size === "number")
  );
}

export const isCertCCContentType = (
  content: CertCCContent | CnnvdContent,
): content is CertCCContent => {
  return (content as CertCCContent).overview !== undefined;
};

export const isCnnvdContentType = (
  content: CertCCContent | CnnvdContent,
): content is CnnvdContent => {
  return (content as CnnvdContent).description !== undefined;
};
