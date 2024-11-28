/* 마이 라이브러리 페이지 */
export type detectedStatus = "done" | "onProgress" | "notChecked";

export type RepoListData = {
  id: number;
  repositoryName: string;
  detectedStatus: detectedStatus;
  favorite: boolean;
  createdAt: string;
  detectedAt?: string;
  filename?: string;
  owner?: string;
};

/* 취약점 검사 페이지 */
export type RepoContentItem = {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  error?: string;
} & (
  | {
      type: "dir";
      folderExpandStatus: "initial" | "expanding" | "expanded" | "error";
      items?: RepoContentItem[];
    }
  | {
      type: "file";
      fileContentStatus: "initial" | "loading" | "loaded" | "error";
    }
);

export type FolderItem = Extract<RepoContentItem, { type: "dir" }>;

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
