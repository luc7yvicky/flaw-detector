import { BASE_URL, OCTOKIT_TOKEN } from "@/lib/const";
import { Mode } from "@/stores/useDetectedModeStore";
import { FileResultProps, FileStatus } from "@/types/file";
import { detectedStatus, RepoListData } from "@/types/repo";
import { Octokit } from "@octokit/rest";
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

export async function getRepoLists(username: string) {
  if (!username) {
    throw new Error("GitHub username이 존재하지 않습니다");
  }
  try {
    const { data } = await octokit.request("GET /users/{username}/repos", {
      username: username,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const repos = data.map(
      (repo: RepoListRawData): RepoListData => ({
        id: repo.id,
        repositoryName: repo.name,
        createdAt: repo.created_at ?? "",
        detectedStatus: "notChecked",
        favorite: false,
        owner: username,
      }),
    );

    // 레포지토리 리스트 저장
    await addRepoList(username, repos);

    return repos;
  } catch (error) {
    console.error("레포지토리 목록을 읽어오는 데 실패했습니다:", error);
    throw error;
  }
}

// GitHub API 응답에 맞춘 타입 정의
type GitHubTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
};

export type RepoTreeItem = {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  sha?: string;
};

export type RepoTree = {
  tree: RepoTreeItem[];
};

export type InspectionList = {
  tree: RepoTreeItem[];
  ignoredFiles: RepoTreeItem[];
  ignoredCount: number;
};

// 타입 가드 함수
function isValidTreeItem(item: any): item is GitHubTreeItem {
  return (
    typeof item.path === "string" &&
    typeof item.mode === "string" &&
    typeof item.type === "string" &&
    typeof item.sha === "string" &&
    typeof item.url === "string" &&
    (item.size === undefined || typeof item.size === "number")
  );
}

// 기본 브랜치 가져오기
async function getDefaultBranch(owner: string, repo: string): Promise<string> {
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return data.default_branch;
}

export async function getRepoTree(
  owner: string,
  repo: string,
  branch?: string,
): Promise<RepoTree> {
  try {
    if (!branch) {
      branch = await getDefaultBranch(owner, repo);
    }

    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const commitSha = refData.object.sha;

    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: commitSha,
    });
    const treeSha = commitData.tree.sha;

    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "1",
    });

    const processedTree: RepoTreeItem[] = treeData.tree
      .filter(isValidTreeItem)
      .map((item) => ({
        name: item.path.split("/").pop() || item.path,
        path: item.path,
        type: item.type === "blob" ? "file" : "dir",
        size: item.size,
        sha: item.sha,
      }));

    return { tree: processedTree };
  } catch (error) {
    console.error("Error fetching repo tree:", error);
    throw new Error(
      `레포지토리 트리를 가져오는 중 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 에러"}`,
    );
  }
}

// 취약점 검사 결과 저장 (파일 단위)
export const addFileResults = async (
  username: string,
  repo: string,
  filePath: string,
  results: FileResultProps[],
) => {
  try {
    const res = await fetch("/api/repos/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        repo,
        filePath,
        results,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to save results.");
    }
  } catch (err) {
    console.error("Error adding results:", err);
  }
};

// 파일의 취약점 검사 결과 조회
export const getDetectedResultsByFile = async (
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
      return { mode: "undetected", results: data.message };
    }
  } catch (err) {
    console.error("Error fetching results:", err);
    throw err;
  }
};

// 레포의 취약점 검사 결과 조회
export const getDetectedResultsByRepo = async (
  username: string,
  repo: string | null,
): Promise<{
  status: FileStatus;
  filePaths: string[];
  // results?: FileResultProps[] | null;
}> => {
  try {
    const res = await fetch(
      `/api/repos/results?username=${username}&repo=${repo}`,
    );
    const data = await res.json();
    if (!res.ok) {
      throw Error("Failed to fetch results.");
    }

    if (data.results) {
      return {
        status: "success",
        filePaths: data.results,
      };
    } else {
      return { status: null, filePaths: [] };
    }
  } catch (err) {
    console.error("Error fetching results:", err);
    throw err;
  }
};

// 2. 현재 사용자의 레파지토리 리스트 추가
export const addRepoList = async (username: string, repos: RepoListData[]) => {
  try {
    await fetch(`${BASE_URL}/api/repos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        repos: repos,
      }),
    });
  } catch (err) {
    console.error("Error adding document:", err);
  }
};

// 3. 현재 사용자의 레파지토리 리스트 목록 조회
export const getRepoListFromDB = async (params: URLSearchParams) => {
  try {
    const res = await fetch(`${BASE_URL}/api/repos?${params.toString()}`);
    const data = await res.json();
    return { ...data, status: res.status };
  } catch (err) {
    console.error("Error fetching document from repos collections:", err);
    return { error: "게시물을 불러오는 데 실패했습니다.", status: 500 };
  }
};

// 레파지토리 검사 상태 변경
export const updateRepoStatus = async (
  username: string,
  repo: string,
  detectedStatus: detectedStatus,
) => {
  try {
    const res = await fetch(`${BASE_URL}/api/repos`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        repoName: repo,
        detectedStatus: detectedStatus,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to save results.");
    }
  } catch (err) {
    console.error("Error occurs updating results status:", err);
  }
};
