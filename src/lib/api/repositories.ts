import { OCTOKIT_TOKEN } from "@/lib/const";
import { RepoContentItem, RepoListData } from "@/types/repo";
import { Octokit } from "@octokit/rest";

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
export async function expandFolder(
  username: string,
  repo: string,
  folder: RepoContentItem,
): Promise<RepoContentItem> {
  if (folder.type !== "dir" || folder.loadingStatus === "loaded") {
    return folder;
  }

  try {
    folder.loadingStatus = "loading";
    folder.items = await fetchRepoContents(username, repo, folder.path);
    folder.loadingStatus = "loaded";
    return folder;
  } catch (error) {
    folder.loadingStatus = "error";
    folder.error =
      error instanceof Error
        ? error.message
        : "알 수 없는 에러가 발생했습니다.";
    throw error;
  }
}
// 해당 경로의 content를 1depth만 읽어옵니다 (폴더/파일)
async function fetchRepoContents(
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

    // const sortedData = sortFilesAndDirs(response.data);
    return response.data?.map(
      (item: any): RepoContentItem => ({
        name: item.name,
        path: item.path,
        type: item.type,
        loadingStatus: item.type === "file" ? "loaded" : "initial",
        size: item.size,
        items: item.type === "dir" ? [] : undefined,
      }),
    );
  } catch (error) {
    throw new Error(
      `${path}에 대한 레포 내용을 가져오는 중 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 에러"}`,
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
