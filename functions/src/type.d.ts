export type TextBlock = { id: string; text: string };

export type LocalizedTextBlock = {
  original: TextBlock[];
  translated: TextBlock[];
};

export type CertCCContent = {
  overview: LocalizedTextBlock;
  description: LocalizedTextBlock;
  impact: LocalizedTextBlock;
  solution: LocalizedTextBlock;
  cveIDs: string[];
};

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
  source_updated_at?: { seconds: number; nanoseconds: number };
  source_created_at: { seconds: number; nanoseconds: number };
  content: CertCCContent | CnnvdContent;
  views: number;
};
