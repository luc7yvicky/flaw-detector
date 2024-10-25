import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ReactQueryProviders from "@/lib/queries/useReactQuery";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SessionStoreProvider } from "@/context/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Flaw Detector",
  description:
    "인공지능의 뛰어난 분석 능력을 활용하여 코드의 보안 취약점을 신속하게 해결하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} font-pretendard ${inter.className} min-w-[64rem]`}
      >
        <Header />
        <main className="min-h-[calc(100dvh-8.5rem)]">
          <SessionStoreProvider>
            <ReactQueryProviders>{children}</ReactQueryProviders>
          </SessionStoreProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
