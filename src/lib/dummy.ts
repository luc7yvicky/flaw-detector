import { Timestamp } from "firebase/firestore";

export const exampleCode = `import SectionBusinessForever from "@/components/section-business-forever";
import SectionVideoDisplayer from "@/components/section-video-displayer";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center py-36 min-h-screen"
    // only background brightness is 0.5
      style={{ background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/bg.svg')", backgroundSize: "cover", backgroundPosition: "center"}}>
      <hgroup className="flex flex-col items-center py-16 gap-4 z-10">
        <Badge>Systemable</Badge>
        <h1 className="text-6xl font-bold">Build once, Business forever</h1>
        <p className="text-sm">
          We help businesses to grow and scale by providing them with the right
          tools and resources.
        </p>
      </hgroup>
      <div className="z-10 grid grid-cols-2 max-w-4xl mx-auto gap-4 my-24">
        <Card className="bg-transparent backdrop-blur-sm col-span-2">
          <CardHeader>
            <CardTitle>Analyze</CardTitle>
            <CardDescription>
              We analyze your business processes and provide you with the right ways to make sure your business is running smoothly.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Systemize</CardTitle>
            <CardDescription>
              We find the ways to systemize your business processes to make sure you are not wasting time on repetitive tasks.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-transparent backdrop-blur-sm">`;

// 크롤링 작업 끝나면 vulnerabilityDBDatas 삭제 예정
export const vulnerabilityDBDatas = [
  {
    id: 1,
    title: "[취약성 경고] Microsoft의 여러 보안 취약점에 대한 CNNVD의 보고서",
    content:
      "최근 Microsoft에서 발표한 보안 공지에 따르면, 원격 코드 실행, 권한 상승 등 다양한 취약점이 포함되어 있으며, 특히 Windows 10 운영체제에서 위험성이 큰 것으로 평가되었습니다.",
    createdAt: "2024.03.08 13:30:24",
  },
  {
    id: 2,
    title: "2023년 12월 CNNVD 호환 서비스 신제품 발표",
    content:
      "CNNVD는 최신 위협 정보를 신속하게 분석하고 대응할 수 있는 새로운 서비스 플랫폼을 발표했습니다. 이 플랫폼은 기업 보안 관리자를 위한 실시간 경고 시스템을 제공합니다.",
    createdAt: "2023.12.01 09:00:00",
  },
  {
    id: 3,
    title:
      "[취약성 보고서] CISCO IOS XE 소프트웨어의 보안 취약점에 대한 CNNVD의 보고서",
    content:
      "CISCO의 IOS XE 소프트웨어에서 발견된 취약점은 원격 공격자가 관리자 권한을 획득할 수 있게 해주며, 네트워크 인프라 전반에 걸쳐 심각한 위협을 초래할 수 있습니다.",
    createdAt: "2024.01.15 16:45:30",
  },
  {
    id: 4,
    title:
      "[취약성 경고] Apache Dubbo의 다양한 보안 취약점에 대한 CNNVD의 보고서",
    content:
      "Apache Dubbo는 인기 있는 분산 시스템 프레임워크로, 최근 원격 코드 실행과 서비스 거부 공격에 취약한 것으로 밝혀졌습니다. 최신 패치를 적용하는 것이 강력히 권장됩니다.",
    createdAt: "2024.02.20 11:22:10",
  },
  {
    id: 5,
    title: "[취약성 경고] Adobe Acrobat Reader의 치명적 취약점",
    content:
      "Adobe Acrobat Reader에서 발견된 이 취약점은 악성 PDF 파일을 통해 원격 코드 실행을 허용할 수 있으며, 특히 개인 사용자와 기업 모두에게 큰 위험을 초래합니다.",
    createdAt: "2024.03.01 14:15:00",
  },
  {
    id: 6,
    title: "[취약성 경고] Google Chrome의 제로데이 취약점",
    content:
      "Google Chrome에서 발견된 제로데이 취약점은 공격자가 브라우저 세션을 장악할 수 있는 가능성을 제공합니다. 사용자들은 즉시 브라우저를 최신 버전으로 업데이트할 필요가 있습니다.",
    createdAt: "2024.03.10 10:30:45",
  },
  {
    id: 7,
    title: "CNNVD 연례 보고서 발표: 2023년의 주요 보안 위협 분석",
    content:
      "2023년 한 해 동안 발생한 주요 보안 위협을 분석한 CNNVD 연례 보고서가 발표되었습니다. 이 보고서에는 랜섬웨어 공격의 증가, IoT 기기의 취약성 등이 주요 내용으로 다뤄졌습니다.",
    createdAt: "2024.01.05 08:00:00",
  },
  {
    id: 8,
    title: "[취약성 보고서] Oracle WebLogic Server의 취약점",
    content:
      "Oracle WebLogic Server에서 발견된 취약점은 공격자가 악성 코드를 주입할 수 있는 가능성을 제공하며, 이로 인해 기업 내 서버가 위험에 처할 수 있습니다.",
    createdAt: "2024.02.18 17:05:22",
  },
  {
    id: 9,
    title: "[취약성 경고] VMware vSphere의 보안 문제",
    content:
      "VMware vSphere 환경에서 발생하는 이 보안 문제는 가상화 서버를 표적으로 하는 공격이 가능하게 만들며, 특히 클라우드 인프라를 사용하는 조직들에게 큰 위협이 됩니다.",
    createdAt: "2024.02.28 12:40:00",
  },
  {
    id: 10,
    title: "[취약성 경고] Microsoft Exchange Server의 취약점",
    content:
      "Microsoft Exchange Server에서 발견된 이 취약점은 원격에서 서버를 제어할 수 있게 만들며, 특히 이메일 시스템을 표적으로 하는 공격에 취약합니다.",
    createdAt: "2024.03.08 13:30:24",
  },
  {
    id: 11,
    title: "[취약성 경고] Apple iOS의 보안 결함",
    content:
      "Apple의 iOS 운영체제에서 발견된 이 보안 결함은 사용자 데이터의 유출을 초래할 수 있으며, 악성 앱이 기기에 무단으로 접근할 수 있게 만듭니다.",
    createdAt: "2024.03.02 15:50:10",
  },
  {
    id: 12,
    title: "[취약성 경고] Linux Kernel의 심각한 취약점",
    content:
      "Linux Kernel에서 발견된 이 심각한 취약점은 루트 권한을 가진 공격자가 시스템 전체를 장악할 수 있게 해줍니다. 시스템 관리자는 즉각적인 패치가 필요합니다.",
    createdAt: "2024.03.11 09:20:55",
  },
];

export const examplePost = {
  label: "기타",
  source: "CERT/CC",
  page_url: "https://www.kb.cert.org/vuls/id/244112",
  title:
    "Multiple SMTP services are susceptible to spoofing attacks due to insufficient enforcement",
  created_at: Timestamp.fromDate(new Date("2023-08-29T12:34:56Z")),
  content: [
    {
      block_id: "afsd-sfsdf-35er",
      text: "Multiple hosted, outbound SMTP servers are vulnerable to email impersonation. This allows authenticated users and certain trusted networks to send emails containing spoofed sender information. Two vulnerabilities were identified that reduce the authentication and verification of the sender, provided by the combination of Sender Policy Framework (SPF) and Domain Key Identified Mail (DKIM).",
    },
    {
      block_id: "efsd-sdfff-35sr",
      text: "Domain-based Message Authentication, Reporting, and Conformance (DMARC) builds on SPF and DKIM, adding linkage to the author (FROM:) domain name, published policies for recipient handling of authentication failures, and reporting from receivers to senders to improve and monitor protection of the domain from fraudulent email (DMARC.org). An authenticated remote attacker can spoof the identity of a sender when sending emails using a hosted service provider.",
    },
  ],
};
