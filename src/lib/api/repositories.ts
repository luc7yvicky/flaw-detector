import { OCTOKIT_TOKEN } from "@/lib/const";
import { Mode } from "@/stores/useDetectedModeStore";
import { FileResultProps } from "@/types/file";
import { RepoContentItem, RepoListData } from "@/types/repo";
import { Octokit } from "@octokit/rest";
import { sortDirectoryFirst } from "../utils";
import { isIgnoredFile } from "../utils";

type RepoListRawData = {
  id: number;
  name: string;
  created_at?: string | null;
  // owner: {
  //   login: string;
  //   id: number;
  //   avatar_url: string;
  // };
};

const octokit = new Octokit({
  auth: OCTOKIT_TOKEN,
});

export async function fetchCodes(
  owner: string,
  repo: string,
  path: string,
): Promise<string> {
  if (!owner || !repo || !path) {
    throw new Error("owner, repo, path 모두 필요합니다.");
  }

  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      mediaType: {
        format: "raw",
      },
    });

    if (typeof response.data === "string") {
      return response.data;
    } else {
      throw new Error("예상치 못한 응답 형식입니다.");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`파일 내용을 가져오는 중 오류 발생: ${error.message}`);
    } else {
      throw new Error("파일 내용을 가져오는 중 알 수 없는 오류 발생");
    }
  }
}

// 레포지토리 리스트를 불러옵니다.
export async function getRepoLists(username: string) {
  if (!username) {
    throw new Error("GitHub username이 존재하지 않습니다");
  }
  try {
    const { data } = await octokit.request("GET /users/{username}/repos", {
      username: username,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: `token ${OCTOKIT_TOKEN}`, // Github API 요청 한도 초과로 임시 추가
      },
    });

    return data.map(
      (repo: RepoListRawData): RepoListData => ({
        id: repo.id,
        repositoryName: repo.name,
        createdAt: repo.created_at ?? "",
        detectedStatus: "notChecked",
      }),
    );
  } catch (error) {
    console.error("레포지토리 목록을 읽어오는 데 실패했습니다:", error);
    throw error;
  }
}

// 폴더의 하위 콘텐츠를 불러옵니다.
type FolderItem = Extract<RepoContentItem, { type: "dir" }>;

export async function expandFolder(
  username: string,
  repo: string,
  folder: FolderItem,
): Promise<FolderItem> {
  if (folder.folderExpandStatus === "expanded") {
    return folder;
  }

  try {
    folder.folderExpandStatus = "expanding";
    folder.items = await fetchRepoContents(username, repo, folder.path);
    folder.folderExpandStatus = "expanded";
    return folder;
  } catch (error) {
    folder.folderExpandStatus = "error";
    folder.error =
      error instanceof Error
        ? error.message
        : "알 수 없는 에러가 발생했습니다.";
    throw error;
  }
}
// 해당 경로의 content를 1depth만 읽어옵니다 (폴더/파일)
export async function fetchRepoContents(
  username: string,
  repo: string,
  path: string = "",
): Promise<RepoContentItem[]> {
  if (!username || !repo) {
    throw new Error("GitHub username과 repository가 필요합니다.");
  }

  try {
    const response = await octokit.rest.repos.getContent({
      owner: username,
      repo: repo,
      path: path,
    });

    if (!Array.isArray(response.data)) {
      throw new Error(`경로 ${path}에 대한 예상치 못한 응답입니다.`);
    }

    const sortedData = sortDirectoryFirst(response.data);
    return sortedData?.map((item: any): RepoContentItem => {
      const baseItem = {
        name: item.name,
        path: item.path,
        type: item.type as "file" | "dir",
        size: item.size,
      };

      if (item.type === "dir") {
        return {
          ...baseItem,
          type: "dir",
          folderExpandStatus: "initial",
          items: [],
        };
      } else {
        return {
          ...baseItem,
          type: "file",
          fileContentStatus: "initial",
        };
      }
    });
  } catch (error) {
    throw new Error(
      `${path} 레포 내용을 가져오는 중 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 에러"}`,
    );
  }
}

// 레포의 최상위 루트폴더의 구조를 fetch합니다.
export async function fetchRootStructure(username: string, repo: string) {
  try {
    // console.log(
    //   `${username}/${repo} 레포지토리의 최상위 구조를 가져오는 중...`,
    // );
    return await fetchRepoContents(username, repo);
  } catch (error) {
    console.error("fetchRootStructure에서 오류 발생:", error);
    throw error;
  }
}

// GitHub API 응답에 맞춘 타입 정의
type GitHubTreeItem = {
  path?: string;
  mode?: string;
  type?: string;
  sha?: string;
  size?: number;
  url?: string;
};

export type RepoTreeItem = {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  sha: string;
};
export type RepoTreeResult = {
  tree: RepoTreeItem[];
  ignoredFiles: RepoTreeItem[];
  ignoredCount: number;
};

// 타입 가드 함수
function isValidTreeItem(
  item: GitHubTreeItem,
): item is Required<Pick<GitHubTreeItem, "path" | "type" | "sha">> &
  Pick<GitHubTreeItem, "size"> {
  return (
    typeof item.path === "string" &&
    typeof item.type === "string" &&
    typeof item.sha === "string" &&
    (item.size === undefined || typeof item.size === "number")
  );
}

export async function getRepoTree(
  owner: string,
  repo: string,
  branch: string = "main",
): Promise<RepoTreeResult> {
  try {
    // 1. Get the latest commit SHA of the specified branch
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const commitSha = refData.object.sha;

    // 2. Get the tree SHA from the commit
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: commitSha,
    });
    const treeSha = commitData.tree.sha;

    // 3. Get the full tree recursively
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "1",
    });

    const processedTree: RepoTreeItem[] = [];
    const ignoredFiles: RepoTreeItem[] = [];

    // 4. Process and filter the tree data
    treeData.tree.forEach((item) => {
      if (isValidTreeItem(item)) {
        const processedItem: RepoTreeItem = {
          name: item.path.split("/").pop() || item.path,
          path: item.path,
          type: item.type === "blob" ? "file" : "directory",
          size: item.size,
          sha: item.sha,
        };

        if (isIgnoredFile(item.path)) {
          ignoredFiles.push(processedItem);
        } else {
          processedTree.push(processedItem);
        }
      }
    });

    return {
      tree: processedTree,
      ignoredFiles,
      ignoredCount: ignoredFiles.length,
    };
  } catch (error) {
    console.error("Error fetching repo tree:", error);
    throw new Error(
      `레포지토리 트리를 가져오는 중 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 에러"}`,
    );
  }
}

// 취약점 검사 결과 조회
export const getDetectedResults = async (
  username: string,
  filePath: string | null,
): Promise<{ mode: Mode; results: FileResultProps[] | null }> => {
  try {
    const res = await fetch(
      `/api/repos/results?username=${username}&filePath=${filePath}`,
    );
    const data = await res.json();

    if (!res.ok) {
      throw Error("Failed to fetch results.");
    }

    if (data.results) {
      return { mode: "detected", results: data.results };
    } else {
      return { mode: "detected", results: data.results };
    }
  } catch (err) {
    console.error("Error fetching results:", err);
    throw err;
  }
};
