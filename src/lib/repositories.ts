import { OCTOKIT_TOKEN } from "@/lib/const";
import { RepoItem, RepoListData } from "@/types/type";
import { Octokit } from "@octokit/rest";

type RepoListRawData = {
  id: number;
  name: string;
  // owner: {
  //   login: string;
  //   id: number;
  //   avatar_url: string;
  // };
};

const octokit = new Octokit({
  auth: OCTOKIT_TOKEN,
});

// 레포지토리 리스트를 불러옵니다.
export async function getRepoLists() {
  try {
    const username = "joanshim";
    if (!username) {
      throw new Error("GitHub username is not set");
    }

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
        // label: generateLabel(repo),
        // labelStatus: generateLabelStatus(repo),
        // caption: generateCaption(repo),
        // createdAt: generateCreatedAt(repo),
        // detectedAt: generateDetectedAt(repo),
        // filename: generateFilename(repo),
      }),
    );
  } catch (error) {
    console.error("Error fetching repos:", error);
    throw error;
  }
}

// 폴더의 하위 콘텐츠를 불러옵니다.
export async function expandFolder(
  username: string,
  repo: string,
  folder: RepoItem,
) {
  if (folder.type !== "dir" || folder.loaded) {
    return folder;
  }

  try {
    folder.items = await fetchRepoContents(username, repo, folder.path);
    folder.loaded = true;
    return folder;
  } catch (error) {
    console.error(`${folder.path} 내용을 로드하는 중 오류 발생:`, error);
    throw error;
  }
}

// 해당 경로의 content를 1depth만 읽어옵니다 (폴더/파일)
async function fetchRepoContents(
  username: string,
  repo: string,
  path: string = "",
): Promise<RepoItem[]> {
  try {
    if (!username || !repo) {
      throw new Error("GitHub username과 repository가 필요합니다.");
    }

    const response = await octokit.rest.repos.getContent({
      owner: username,
      repo: repo,
      path: path,
    });

    if (!Array.isArray(response.data)) {
      // console.warn(`경로 ${path}에 대한 예상치 못한 응답입니다. 건너뜁니다.`);
      // 오류 상태 업데이트
      return [];
    }

    return response.data.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type,
      size: item.size,
      sha: item.sha,
      loaded: item.type === "file",
      items: item.type === "dir" ? [] : undefined,
    }));
  } catch (error) {
    console.error(`${path}에 대한 레포 내용을 가져오는 중 오류 발생:`, error);
    throw error;
  }
}

// 레포의 최상위 루트폴더의 구조를 fetch합니다.
export async function fetchRootStructure(username: string, repo: string) {
  try {
    console.log(
      // `${username}/${repo} 레포지토리의 최상위 구조를 가져오는 중...`,
    );
    return await fetchRepoContents(username, repo);
  } catch (error) {
    console.error("fetchRootStructure에서 오류 발생:", error);
    throw error;
  }
}
