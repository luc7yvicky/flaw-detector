import { redirectIfNotLoggedIn } from "@/lib/redirect";

export default async function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await redirectIfNotLoggedIn("/login");
  return (
    <main className="flex-col-center relative mx-auto w-full">{children}</main>
  );
}
