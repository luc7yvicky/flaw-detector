import Profile from "@/components/my/Profile";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import TitleBar from "@/components/ui/TitleBar";
import { logout } from "@/lib/actions";

export default function SettingsPage() {
  // 임시 데이터, db에서 데이터 받아와서 뿌릴 예정
  const user = {
    email: "gheddong2@naver.com",
    image: "https://avatars.githubusercontent.com/u/87695983?v=4",
  };

  return (
    <div className="flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      <TitleBar title="Settings" align="center" className="mb-0 mt-[4.5rem]" />

      <div className="flex flex-col gap-y-20 last:mb-[5.438rem]">
        <section className="flex flex-col gap-y-20">
          <div className="flex-between-center h-[6.688rem] gap-4">
            <Profile
              avatar={user?.image || "/images/user.png"}
              email={user?.email || "marry@gmail.com"}
            />
            <form action={logout}>
              <Button
                variant="outlined"
                className="flex-center-center px-5 py-4 text-2xl font-medium"
              >
                로그아웃
              </Button>
            </form>
          </div>
          <hr />
        </section>

        <section className="flex-col-start-center gap-y-20">
          <div className="flex gap-x-8 text-2xl -tracking-[0.01em]">
            <h2 className="font-semibold">계정 유형</h2>
            <span className="font-normal">깃허브 연동</span>
          </div>
          <hr />
        </section>

        <section className="flex-col-start-center gap-y-20">
          <div className="flex w-full flex-col gap-y-12 text-2xl -tracking-[0.01em]">
            <h2 className="font-semibold">알림</h2>
            <div className="flex-between-center w-full">
              <span className="font-normal">이메일로 알림 받기</span>
              <Switch />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
