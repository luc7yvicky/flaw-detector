import Link from "next/link";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import TitleBar from "@/components/ui/TitleBar";
import Profile from "@/components/my/Profile";

export default function ProfilePage() {
  return (
    <>
      <TitleBar
        title="Profile Information"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />

      <div className="flex flex-col gap-y-20 last:mb-20">
        <section className="flex flex-col gap-y-20">
          <div className="flex-between-center h-[6.688rem] gap-4">
            <Profile avatar="/images/user.png" email="marry@gmail.com" />
            <Button
              variant="outlined"
              className="flex-center-center px-5 py-4 text-2xl font-medium"
            >
              로그아웃
            </Button>
          </div>
          <hr />
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
          <hr />
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
          <hr />
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
