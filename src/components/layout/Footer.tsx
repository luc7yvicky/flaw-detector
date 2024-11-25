"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <footer
      className={cn(
        "relative size-full max-h-[20.25rem] bg-purple-light",
        isLandingPage ? "snap-start snap-always" : "",
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/footerBg.png"
          alt="Footer 배경 이미지"
          fill={true}
          className="object-cover"
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 mx-auto grid size-full max-w-[120rem] grid-cols-[120px_1fr] grid-rows-2 px-12 pb-16 pt-[3.75rem] sm:pb-[3.313rem] md:grid-cols-[400px_1fr] md:px-20">
        <Image
          src="/images/footerLogo.png"
          alt="SFAC SPACE Logo"
          width={120}
          height={55}
          className="col-start-1 col-end-2 row-start-1 row-end-2 md:col-end-3"
        />

        <section className="col-start-1 col-end-3 row-start-2 row-end-3 md:col-end-2">
          <p className="mb-1 text-xl font-semibold leading-[1.875rem] tracking-[-0.011em] text-gray-dark">
            CONTACT
          </p>
          <div className="flex flex-col text-base font-medium leading-6 tracking-[-0.011em]">
            <p>
              <span className="mr-4 text-gray-default sm:mr-[1.625rem]">
                (주)스팩스페이스
              </span>
              <span className="mr-2 text-gray-default sm:mr-3">대표자</span>
              <span className="mr-6 sm:mr-12">염민호</span>
              <span className="mr-2 text-gray-default">사업자등록번호</span>
              <span>450-87-01864</span>
            </p>
            <p>
              <span className="mr-5 sm:mr-9">
                서울 강서구 마곡중앙2로 11, 3층 303호
              </span>
              <span className="mr-2 text-gray-default sm:mr-[0.875rem]">
                대표전화
              </span>
              <span> 02-6217-1119</span>
            </p>
            <p>
              <span className="mr-3 text-gray-default sm:mr-6">Email</span>
              <span className="mr-6 sm:mr-14">admin@sfacspace.com</span>
              <span className="mr-3 text-gray-default sm:mr-6">팩스</span>
              <span>02-6217-1115</span>
            </p>
          </div>
        </section>

        <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col items-end justify-start gap-3 md:row-start-2 md:row-end-3 md:justify-end">
          <nav className="flex flex-col gap-2 text-right text-base font-medium leading-6 tracking-[-0.011em] text-gray-default md:flex-row md:gap-8">
            <Link href={"https://www.sfacspace.com/ko"}>회사소개</Link>
            <Link href={"/agreements"}>서비스이용약관</Link>
            <Link href={"/ppa"}>개인정보처리방침</Link>
          </nav>
          <p className="absolute left-12 top-[8.4rem] text-right text-sm font-medium text-gray-dark md:relative md:left-0 md:top-0 md:text-base">
            ©Spacspace.All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
