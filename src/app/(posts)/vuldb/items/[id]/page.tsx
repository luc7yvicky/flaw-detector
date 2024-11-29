import { auth } from "@/auth";
import { Floating } from "@/components/ui/Floating";
import ArticleDetail from "@/components/vulnerability-db/ArticleDetail";
import {
  ArticleDetailContentSkeleton,
  ArticleDetailHeaderSkeleton,
} from "@/components/vulnerability-db/VulDBSkeleton";
import { increasePostViews } from "@/lib/api/posts";

import { BASE_URL } from "@/lib/const";
import { redirectIfNotLoggedIn } from "@/lib/redirect";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ToastContainer = dynamic(() =>
  import("@/components/vulnerability-db/Toast").then(
    (mod) => mod.ToastContainer,
  ),
);

async function fetchPost({ postId }: { postId: string }) {
  if (!postId) throw new Error("postId가 유효하지 않습니다.");

  const res = await fetch(`${BASE_URL}/api/posts/${postId}`);
  return res.json();
}

export default async function VulnerabilityDBDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await redirectIfNotLoggedIn("/vuldb/items");

  const session = await auth();
  if (!session || !session.user) {
    throw new Error("로그인 정보가 유효하지 않습니다.");
  }

  const userId = session?.user.userId;
  if (!userId) {
    throw new Error("사용자 정보가 유효하지 않습니다.");
  }

  const postId = params?.id;

  const post = await fetchPost({ postId });
  if (!post) {
    throw new Error("게시글 데이터를 불러오는데 실패했습니다.");
  }
  await increasePostViews(postId);

  return (
    <div className="relative mx-auto mb-[8.596rem] mt-[2.063rem] flex w-full max-w-[120rem] flex-col items-center gap-[3.75rem] overflow-hidden px-[1rem]">
      <Suspense
        fallback={
          <>
            <ArticleDetailHeaderSkeleton />
            <ArticleDetailContentSkeleton />
          </>
        }
      >
        <ArticleDetail data={post} userId={userId} />
      </Suspense>
      {/* <SimilarInfoPosts postId={postId} userId={userId} /> */}
      <ToastContainer />
      <div className="width-[4.75rem] absolute right-[8.75rem] top-[46.313rem]">
        <Floating variant="chat" className="fixed top-[46.313rem]" />
      </div>
    </div>
  );
}
