import { auth } from "@/auth";
import { Floating } from "@/components/ui/Floating";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const DetailPageContainer = dynamic(
  () => import("@/components/vuldb/detail/DetailPageContainer"),
  {
    ssr: false,
  },
);

export default async function VulDBDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/vuldb/items");
  }

  const userId = session?.user.userId;
  const postId = params?.id;
  if (!userId || !postId) {
    throw new Error("필수 데이터가 없습니다.");
  }

  return (
    <div className="relative mx-auto mb-[8.596rem] mt-[2.063rem] flex w-full max-w-[120rem] flex-col items-center gap-[3.75rem] overflow-hidden px-[1rem]">
      <DetailPageContainer postId={postId} userId={userId} />
      <div className="width-[4.75rem] absolute right-[8.75rem] top-[46.313rem]">
        <Floating variant="chat" className="fixed top-[46.313rem]" />
      </div>
    </div>
  );
}
