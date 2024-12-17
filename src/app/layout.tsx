import Footer from "@/components/layout/Footer";
import { FooterContent } from "@/components/layout/FooterContent";
import Header from "@/components/layout/Header";
import { SessionStoreProvider } from "@/context/SessionProvider";
import ReactQueryProviders from "@/lib/queries/useReactQuery";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="ko" className={`${inter.className} ${pretendard.className}`}>
      <body className={`w-dvw md:min-w-[64rem]`}>
        <div className="relative h-dvh snap-y snap-mandatory overflow-y-auto overflow-x-hidden">
          <Header />
          <SessionStoreProvider>
            <ReactQueryProviders>{children}</ReactQueryProviders>
          </SessionStoreProvider>
          <Footer>
            <FooterContent />
          </Footer>
        </div>
      </body>
    </html>
  );
}
