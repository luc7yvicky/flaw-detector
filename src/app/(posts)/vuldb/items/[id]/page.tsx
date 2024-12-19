import { auth } from "@/auth";
import { Floating } from "@/components/ui/Floating";
import ArticleContainer from "@/components/vulnerability-db/ArticleContainer";
import { redirect } from "next/navigation";

export default async function VulnerabilityDBDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/vuldb/items");
  }
  const userId = session?.user.userId;
  if (!userId) {
    throw new Error("사용자 정보가 유효하지 않습니다.");
  }

  const postId = params?.id;

  return (
    <div className="relative mx-auto mb-[8.596rem] mt-[2.063rem] flex w-full max-w-[120rem] flex-col items-center gap-[3.75rem] overflow-hidden px-[1rem]">
      <ArticleContainer postId={postId} userId={userId} />
      <div className="width-[4.75rem] absolute right-[8.75rem] top-[46.313rem]">
        <Floating variant="chat" className="fixed top-[46.313rem]" />
      </div>
    </div>
  );
}
