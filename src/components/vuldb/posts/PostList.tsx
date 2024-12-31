import { cn } from "@/lib/utils";
import { VulDBPostWithChip } from "@/types/post";
import dynamic from "next/dynamic";
import Link from "next/link";
import InfoMessage from "../../ui/InfoMessage";
import PostCard from "./PostCard";

const LoginPromptModal = dynamic(
  () => import("@/components/vuldb/posts/LoginPromptModal"),
);

export default function PostList({
  posts,
  userId,
  selectedChip,
  hasSearchTerm,
}: {
  posts: VulDBPostWithChip[];
  userId?: number;
  selectedChip?: "hot" | "new" | "all";
  hasSearchTerm?: boolean;
}) {
  if (!posts || posts.length === 0) {
    if (selectedChip === "new") {
      return (
        <InfoMessage
          situation="최근 48시간 이내에 올라온 게시글이 없어요."
          solution="NEW 필터를 해제하거나 HOT 필터로 다시 시도해 보세요."
        />
      );
    }

    if (selectedChip === "hot") {
      return (
        <InfoMessage
          situation="HOT 게시글이 없어요."
          solution="HOT 필터를 해제하거나 NEW 필터로 다시 시도해 보세요."
        />
      );
    }

    if (hasSearchTerm) {
      return (
        <InfoMessage
          situation="검색 결과가 없어요."
          solution="다른 주제로 다시 검색해 보세요."
        />
      );
    }

    return (
      <InfoMessage
        situation="게시글 데이터가 없어요."
        solution="고객센터로 문의해주세요."
      />
    );
  }

  return (
    <>
      {!userId && <LoginPromptModal />}
      <ul
        className={cn(
          "flex w-fit flex-col gap-4",
          !userId && "block size-full whitespace-pre-wrap blur-[0.5rem]",
        )}
      >
        {posts.map((post: VulDBPostWithChip) => {
          return (
            <li key={post.id}>
              <Link href={`/vuldb/items/${post.id}`}>
                <PostCard post={post} userId={userId as number} />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
