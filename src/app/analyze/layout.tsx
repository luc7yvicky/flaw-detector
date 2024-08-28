import { redirectIfNotLoggedIn } from "@/lib/redirect";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await redirectIfNotLoggedIn("/my/repos");
  return <>{children}</>;
}
