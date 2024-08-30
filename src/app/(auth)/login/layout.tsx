import { redirectIfLoggedIn } from "@/lib/redirect";

export default async function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await redirectIfLoggedIn("/repos");
  return <div className="relative flex justify-center">{children}</div>;
}
