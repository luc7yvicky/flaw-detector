import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="h-[20.25rem] w-full bg-purple-light bg-[url('/images/footerBg.png')] bg-cover bg-right">
      <div className="mx-auto flex max-w-[120rem] items-end justify-between px-20 pb-[3.313rem] pt-[3.75rem]">
        <div>
          <Image
            src="/images/footerLogo.png"
            alt="SFAC SPACE Logo"
            width={120}
            height={55}
          />
          <div className="flex-between-end mt-[2.375rem]">
            <section className="h-[7.375rem]">
              <p className="mb-2 text-xl font-semibold leading-[1.875rem] tracking-[-0.011em] text-gray-dark">
                CONTACT
              </p>
              <ul className="flex-between-center gap-10 text-base font-medium leading-6 tracking-[-0.011em]">
                <li className="flex-col-start-center gap-1">
                  <div className="flex gap-[1.625rem]">
                    <span className="text-gray-default">(주)스팩스페이스</span>
                    <span>
                      <span className="mr-3 text-gray-default">대표자</span>
                      염민호
                    </span>
                  </div>
                  <div>서울 강서구 마곡중앙2로 11, 3층 303호</div>
                  <div>
                    <span className="mr-6 text-gray-default">Email</span>
                    admin@sfacspace.com
                  </div>
                </li>
                <li className="flex-col-start-center gap-1">
                  <div>
                    <span className="mr-2 text-gray-default">
                      사업자등록번호
                    </span>
                    450-87-01864
                  </div>
                  <div>
                    <span className="mr-[0.875rem] text-gray-default">
                      대표전화
                    </span>
                    02-6217-1119
                  </div>
                  <div>
                    <span className="mr-[1.875rem] text-gray-default">
                      팩스
                    </span>
                    02-6217-1115
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <div>
          <nav className="flex gap-8 text-base font-medium leading-6 tracking-[-0.011em] text-gray-default">
            <Link href={"https://www.sfacspace.com/ko"}>회사소개</Link>
            <Link href={"/agreements"}>서비스이용약관</Link>
            <Link href={"/ppa"}>개인정보처리방침</Link>
          </nav>
          <p className="mt-3 text-right text-base font-medium text-gray-dark">
            ©Spacspace.All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
