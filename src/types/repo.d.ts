export type RepoListData = {
  id: number;
  repositoryName: string;
  detectedStatus: "done" | "onProgress" | "notChecked";
  createdAt: string;
  detectedAt?: string;
  filename?: string;
};

export type RepoContentItem = {
  name: string;
  path: string;
  type: "file" | "dir";
  // processStatus?: "success" | "onCheck" | "onWait" | "error";
  expanded?: boolean;
  size?: number;
  loadingStatus: "initial" | "loading" | "loaded" | "error";
  items?: RepoItem[];
  error?: string;
};
