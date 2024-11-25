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
      <div className="relative z-10 mx-auto flex size-full max-w-[120rem] justify-between gap-4 px-12 pb-[3.313rem] pt-[3.75rem] md:gap-0 md:px-20">
        <div className="flex flex-col justify-between gap-2">
          <Image
            src="/images/footerLogo.png"
            alt="SFAC SPACE Logo"
            width={120}
            height={55}
          />

          <section>
            <p className="mb-0 text-xl font-semibold leading-[1.875rem] tracking-[-0.011em] text-gray-dark sm:mb-2">
              CONTACT
            </p>
            <ul className="flex justify-between gap-2 text-base font-medium leading-6 tracking-[-0.011em] sm:gap-6 md:gap-10">
              <li className="flex flex-col gap-1">
                <div className="flex gap-2 sm:gap-[1.625rem]">
                  <span className="text-gray-default">(주)스팩스페이스</span>
                  <span>
                    <span className="mr-3 text-gray-default">대표자</span>
                    염민호
                  </span>
                </div>
                <div>서울 강서구 마곡중앙2로 11, 3층 303호</div>
                <div>
                  <span className="mr-3 text-gray-default sm:mr-6">Email</span>
                  admin@sfacspace.com
                </div>
              </li>
              <li className="flex flex-col gap-1">
                <div>
                  <span className="mr-2 text-gray-default">사업자등록번호</span>
                  450-87-01864
                </div>
                <div>
                  <span className="mr-[0.875rem] text-gray-default">
                    대표전화
                  </span>
                  02-6217-1119
                </div>
                <div>
                  <span className="mr-4 text-gray-default sm:mr-[1.875rem]">
                    팩스
                  </span>
                  02-6217-1115
                </div>
              </li>
            </ul>
          </section>
        </div>

        <div className="flex w-min flex-col flex-wrap justify-end gap-3 sm:w-fit">
          <nav className="flex flex-col gap-3 text-right text-base font-medium leading-6 tracking-[-0.011em] text-gray-default sm:flex-row sm:gap-8">
            <Link href={"https://www.sfacspace.com/ko"}>회사소개</Link>
            <Link href={"/agreements"}>서비스이용약관</Link>
            <Link href={"/ppa"}>개인정보처리방침</Link>
          </nav>
          <p className="text-right text-base font-medium text-gray-dark">
            ©Spacspace.All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
