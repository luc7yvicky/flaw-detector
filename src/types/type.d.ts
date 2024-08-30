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

export type VulnDBPost = {
  id: string;
  label: "기타" | "취약성 보고서" | "취약성 알림" | "취약성 경고";
  source: "CERT/CC" | "CNNVD";
  page_url: string;
  title: string;
  created_at: { seconds: number; nanoseconds: number }; // firestore timestamp
  content: { block_id: string; text: string }[];
};
