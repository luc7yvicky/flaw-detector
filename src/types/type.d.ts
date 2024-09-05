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

export type ArticleDetailProps = {
  content?: string;
  showLabel?: boolean;
} & ArticleListItem;

export type RepoListData = {
  id: number;
  repositoryName: string;
  label?: string;
  labelStatus?: string;
  caption?: string;
  detectedStatus: "done" | "onProgress" | "notChecked";
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

export type CertCCCTextBlock = { id: string; text: string };

export type CnnvdTextBlock = {
  text: string;
};

export type CertCCCLocalizedTextBlock = {
  original: TextBlock[];
  translated: TextBlock[];
};

export type CnnvdLocalizedTextBlock = {
  original: string;
  translated: string;
};

// CERT/CC 게시글 내용
export type CertCCContent = {
  overview: CertCCCLocalizedTextBlock;
  description: CertCCCLocalizedTextBlock;
  impact: CertCCCLocalizedTextBlock;
  solution: CertCCCLocalizedTextBlock;
  cveIDs: string[];
};

// CNNVD 게시글 내용
export type CnnvdContent = {
  description: CnnvdLocalizedTextBlock;
  introduction: CnnvdLocalizedTextBlock;
  vulnDetail: CnnvdLocalizedTextBlock;
  remediation: CnnvdLocalizedTextBlock;
};

export type VulDBPost = {
  id: string;
  label: "기타" | "취약성 보고서" | "취약성 알림";
  source: "CERT/CC" | "CNNVD";
  page_url: string;
  title: {
    original: string;
    translated: string;
  };
  source_created_at: { seconds: number; nanoseconds: number }; //원문 게시글 등록일
  created_at: { seconds: number; nanoseconds: number }; // firestore timestamp
  content: CertCCContent | CnnvdContent;
};
