import { OCTOKIT_TOKEN } from "@/lib/const";
import { RepoListData } from "@/types/type";
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

if (!OCTOKIT_TOKEN) {
  throw new Error(".env 파일의 github token을 읽는 중 오류가 생겼습니다.");
}

const octokit = new Octokit({
  auth: OCTOKIT_TOKEN,
});

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
