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
