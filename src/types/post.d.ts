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

export type CertCCTextBlock = { id: string; text: string };

export type CertCCLocalizedTextBlock = {
  original: CertCCTextBlock[];
  translated: CertCCTextBlock[];
};

// CERT/CC 게시글 내용
export type CertCCContent = {
  overview: CertCCLocalizedTextBlock;
  description: CertCCLocalizedTextBlock;
  impact: CertCCLocalizedTextBlock;
  solution: CertCCLocalizedTextBlock;
  cveIDs: string[];
};

// CNNVD 게시글 내용
export type CnnvdContent = { block_id: string; text: string }[];

export type VulDBPost = {
  id: string;
  label: "기타" | "취약성 보고서" | "취약성 알림";
  source: "CERT/CC" | "CNNVD";
  page_url: string;
  title: {
    original: string;
    translated: string;
  };
  created_at: { seconds: number; nanoseconds: number };
  updated_at?: { seconds: number; nanoseconds: number };
  content: CertCCContent | CnnvdContent;
  views: number;
};