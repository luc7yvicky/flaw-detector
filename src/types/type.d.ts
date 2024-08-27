export type ArticleDetailProps = {
  title: string;
  content: string;
  createdAt: string;
  showLabel?: boolean;
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

export type RepoItem = {
  name: string;
  path: string;
  type: "file" | "dir";
  status?: "done" | "onProgress" | "onWait" | "error";
  expanded?: boolean;
  size?: number;
  sha?: string;
  loaded?: boolean;
  items?: RepoItem[];
};
