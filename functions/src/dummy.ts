import { Timestamp } from "firebase-admin/firestore";
import { VulDBPost } from "./type";

export const examplePost: VulDBPost = {
  id: "",
  label: "기타",
  source: "CERT/CC",
  page_url: "https://www.kb.cert.org/vuls/id/244112",
  title: {
    original:
      "This is a test post for the CERT/CC source. Multiple SMTP services are vulnerable to spoofing attacks due to insufficient hardening.",
    translated:
      "CERT/CC 소스에 대한 테스트 게시물입니다. 충분한 경직화가 없어 여러 SMTP 서비스가 스푸핑 공격에 취약합니다.",
  },
  created_at: Timestamp.fromDate(new Date("2023-09-01T12:34:56Z")),
  updated_at: Timestamp.fromDate(new Date("2024-09-01T12:34:56Z")),
  views: 0,
  content: {
    overview: {
      original: [{ id: "1", text: "overview" }],
      translated: [{ id: "1", text: "overview" }],
    },
    description: {
      original: [
        { id: "1", text: "description1" },
        { id: "2", text: "description2" },
      ],
      translated: [
        { id: "1", text: "description1" },
        { id: "2", text: "description2" },
      ],
    },
    impact: {
      original: [{ id: "1", text: "impact" }],
      translated: [{ id: "1", text: "impact" }],
    },
    solution: {
      original: [
        { id: "1", text: "solution1" },
        { id: "2", text: "solution2" },
      ],
      translated: [
        { id: "1", text: "solution1" },
        { id: "2", text: "solution2" },
      ],
    },
    cveIDs: ["CVE-2024-7208", "CVE-2024-7209"],
  },
};
