import { Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  label: "기타" | "취약성 보고서" | "취약성 알림" | "취약성 경고";
  source: "CERT/CC" | "CNNVD";
  page_url: string;
  title: string;
  created_at: Timestamp;
  content: { block_id: string; text: string }[];
};
