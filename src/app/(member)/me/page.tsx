import { auth } from "@/auth";
import LogoutButton from "@/components/me/LogoutButton";
import Profile from "@/components/me/Profile";
import { Input } from "@/components/ui/Input";
import TitleBar from "@/components/ui/TitleBar";
import Link from "next/link";

export default async function MyPage() {
  const session = await auth();

  return (
    <div className="mb-[7.75rem] flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <TitleBar
        title="Profile Information"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />

      <div className="flex flex-col gap-y-20 last:mb-20">
        <section className="flex flex-col gap-y-20">
          <div className="flex-between-center h-[6.688rem] gap-4">
            <Profile />
            <LogoutButton username={session?.user?.username} />
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
                {`계정 (깃허브 연동)`}
              </span>
              <Input
                isErrored={false}
                value={session?.user?.email || "marry@gmail.com"}
                disabled
                className="w-[54.125rem] leading-[1.688rem] -tracking-[0.011rem] text-gray-default"
              />
            </div>
          </div>
          <hr />
        </section>

        <section className="flex flex-col gap-y-20">
          <div className="flex flex-col gap-y-9 text-2xl font-medium leading-[1.816rem] text-gray-dark">
            <Link href="/me/scraps">
              <span>스크랩</span>
            </Link>
            <Link href="/me/settings">
              <span>설정</span>
            </Link>
            <Link href="/me/contact">
              <span>문의하기</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
