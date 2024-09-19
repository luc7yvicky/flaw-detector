import { redirectIfNotLoggedIn } from "@/lib/redirect";
import { SessionProvider } from "next-auth/react";

export default async function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await redirectIfNotLoggedIn("/login");
  return (
    <div className="flex-col-center relative mx-auto w-full">
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}
