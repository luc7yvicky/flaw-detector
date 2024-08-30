import { redirectIfNotLoggedIn } from "@/lib/redirect";

export default async function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await redirectIfNotLoggedIn("/login");
  return (
    <div className="flex-col-center relative mx-auto mb-[7.75rem] w-full">
      {children}
    </div>
  );
}
