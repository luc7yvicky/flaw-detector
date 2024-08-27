export type ArticleListItem = {
  id: string;
  title: string;
  createdAt: string;
  labelVariant?:
    | "hot"
    | "new"
    | "clipping"
    | "clipping-notify"
    | "clipping-warning";
  labelText?: string;
};

export type RepoListData = {
  id: number;
  repositoryName: string;
  label?: string;
  labelStatus?: string;
  caption?: string;
  createdAt?: string;
  detectedAt?: string;
  filename?: string;
};

export type RepoContentItem = {
  name: string;
  path: string;
  type: "file" | "dir";
  processStatus?: "done" | "onProgress" | "onWait" | "error";
  expanded?: boolean;
  size?: number;
  loadingStatus: "initial" | "loading" | "loaded" | "error";
  items?: RepoItem[];
  error?: string; 
};
export type ArticleDetailProps = {
  content?: string;
  showLabel?: boolean;
} & ArticleListItem;
