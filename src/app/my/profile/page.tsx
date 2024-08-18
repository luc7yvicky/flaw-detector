import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

export default function Profile() {
  return (
    <>
      <h1 className="flex-col-center-center mt-[4.5rem] gap-y-5 text-[2.5rem] font-normal leading-[3.026rem] -tracking-[0.01em] text-primary-500">
        <span className="rounded-full border-[0.25rem] border-primary-500 px-[1.25rem] py-[0.969rem]">
          Profile Information
        </span>
      </h1>

      <div className="flex flex-col gap-y-20">
        <section className="flex flex-col gap-y-20">
          <div className="flex-between-center h-[6.688rem] gap-4">
            {/* User */}
            <div className="inline-flex items-center gap-x-[2.75rem]">
              <Image
                src={"/images/gear.png"}
                alt="avatar"
                width={108}
                height={108}
                priority
                className="h-[6.688rem] w-[6.688rem] rounded-[50%]"
              />
              <div className="flex-col-start-center text-[2.5rem] font-medium leading-tight -tracking-[0.01em] text-gray-dark">
                <span>Hello,</span>
                <span>marry@gmail.com</span>
              </div>
            </div>
            {/* 임시, Button */}
            <button className="flex-center-center rounded-lg border-2 border-primary-500 px-5 py-4 text-2xl font-medium text-primary-500">
              로그아웃
            </button>
          </div>
          <hr className="h-[0.063rem] w-full border-[#BABABA]" />
        </section>

        <section className="flex flex-col gap-y-20">
          <div className="flex-col-start-center h-full gap-y-12">
            <h2 className="text-[2rem] font-semibold leading-[2.421rem] -tracking-[0.01em] text-gray-dark">
              내 정보
            </h2>
            <div className="flex flex-col gap-y-4">
              <span className="text-2xl font-medium leading-[1.816rem] text-gray-dark">
                계정
              </span>
              <Input
                isErrored={false}
                value="marry@gmail.com"
                disabled
                className="w-[54.125rem] leading-[1.688rem] -tracking-[0.011rem] text-gray-default"
              />
            </div>
          </div>
          <hr className="h-[0.063rem] w-full border-[#BABABA]" />
        </section>

        <section className="flex flex-col gap-y-20">
          <div className="flex-col-start-center h-full gap-y-14">
            <h2 className="text-[2rem] font-semibold leading-[2.421rem] -tracking-[0.01em] text-gray-dark">
              라이브러리
            </h2>
            <div className="flex flex-col gap-y-9">
              <Link href="/my/detected-files">
                <span className="text-2xl font-medium leading-[1.816rem] text-gray-dark">
                  검출된 파일
                </span>
              </Link>
              <Link href="/my/clipping-articles">
                <span className="text-2xl font-medium leading-[1.816rem] text-gray-dark">
                  스크랩
                </span>
              </Link>
            </div>
          </div>
          <hr className="h-[0.063rem] w-full border-[#BABABA]" />
        </section>

        <section className="flex flex-col gap-y-20">
          <div className="flex-col-start-center h-full gap-y-14">
            <div className="flex flex-col gap-y-9">
              <Link href="/my/settings">
                <span className="text-2xl font-medium leading-[1.816rem] text-gray-dark">
                  설정
                </span>
              </Link>
              <Link href="/my/customer-service">
                <span className="text-2xl font-medium leading-[1.816rem] text-gray-dark">
                  고객센터
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
