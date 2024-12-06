import { auth } from "@/auth";
import VulDBMainContent from "@/components/vulnerability-db/VulDBMainContent";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { BASE_URL } from "@/lib/const";
import dynamic from "next/dynamic";

async function fetchLatestPosts() {
  const res = await fetch(`${BASE_URL}/api/posts/latest`);
  return res.json();
}

const ToastContainer = dynamic(
  () =>
    import("@/components/vulnerability-db/Toast").then(
      (mod) => mod.ToastContainer,
    ),
  { ssr: false },
);

export default async function VulDBPage() {
  const response = await fetchLatestPosts();
  const latestPosts = response.results || [];

  const session = await auth();
  const userId = session?.user?.userId || null;

  return (
    <div className="relative mx-auto mt-[1.688rem] flex min-h-[147rem] w-full max-w-[82.063rem] flex-col gap-[4.75rem] overflow-hidden px-[1rem]">
      <VulDBImageCardContainer posts={latestPosts} />
      <VulDBMainContent userId={userId} />
      <ToastContainer />
    </div>
  );
}
