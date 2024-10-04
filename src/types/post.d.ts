export type CertCCTextBlock = { id: string; text: string };

export type CnnvdTextBlock = {
  text: string;
};

export type CertCCLocalizedTextBlock = {
  original: CertCCTextBlock[];
  translated: CertCCTextBlock[];
};

export type CnnvdLocalizedTextBlock = {
  original: string;
  translated: string;
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
export type CnnvdContent = {
  description: CnnvdLocalizedTextBlock;
  introduction: CnnvdLocalizedTextBlock;
  vulnDetail: CnnvdLocalizedTextBlock;
  remediation: CnnvdLocalizedTextBlock;
};

export type VulDBPostLabel = "기타" | "취약성 보고서" | "취약성 알림";

export type VulDBPost = {
  id: string;
  label: VulDBPostLabel;
  source: "CERT/CC" | "CNNVD";
  page_url: string;
  title: {
    original: string;
    translated: string;
  };
  source_created_at: { seconds: number; nanoseconds: number }; //원문 게시글 등록일
  created_at: { seconds: number; nanoseconds: number }; // firestore timestamp
  source_updated_at?: { seconds: number; nanoseconds: number };
  content: CertCCContent | CnnvdContent;
  views: number;
};

export type VulDBPostWithChip = VulDBPost & {
  chip: "hot" | "new" | "";
  isScrapped: boolean;
};

export type VulDBPinnedInfo = {
  userId: number;
  postId: string;
};

export type ArticleListItem = {
  id: string;
  title: string;
  label: VulDBPostLabel;
  createdAt: Date;
};

export type VulDBPinnedPosts = {
  userId: number;
  pinnedPosts: string[];
};
