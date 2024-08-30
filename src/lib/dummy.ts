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
