import { VulDBPostWithChip } from "@/types/post";
import Link from "next/link";
import SimilarPostCard from "./SimilarPostCard";

export default function SimilarPostList({
  userId,
  posts,
}: {
  userId: number;
  posts: VulDBPostWithChip[];
}) {
  return (
    <section className="w-full max-w-[82.125rem]">
      <h2 className="mb-4 text-2xl font-semibold leading-[1.816rem] tracking-[-0.01em]">
        비슷한 정보글
      </h2>
      <ul className="grid grid-cols-3 gap-9">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/vuldb/items/${post.id}`}>
              <SimilarPostCard post={post} userId={userId as number} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
