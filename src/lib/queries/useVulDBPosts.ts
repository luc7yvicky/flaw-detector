import { VulDBPost } from "@/types/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useRef } from "react";
import { getPaginatedPosts } from "../api/posts";
import { useHotPostIds } from "./useHotPostIds";

export function useVulDBPosts(
  userId: number | null,
  currentPage: number,
  itemsPerPage: number,
  selectedChip: "hot" | "new" | "",
  searchTerm: string[] | null = null,
) {
  const queryClient = useQueryClient();
  const { data: hotPostIds = [] } = useHotPostIds();
  const lastVisiblePost = useRef<VulDBPost | null>(null);

  const latestPostsQuery = useQuery<any, Error>({
    queryKey: ["latestPosts"],
    queryFn: async () => {
      const { posts } = await getPaginatedPosts(3, null, userId);
      const now = new Date();

      return posts.map((post: VulDBPost) => {
        const postDate = post.created_at
          ? new Timestamp(
              post.created_at.seconds,
              post.created_at.nanoseconds,
            ).toDate()
          : new Date(0);
        const diffInHours =
          (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
        const isNew = diffInHours <= 48;
        const isHot = hotPostIds.includes(post.id);
        const chip: "hot" | "new" | "" = isHot ? "hot" : isNew ? "new" : "";

        return { ...post, chip };
      });
    },
    staleTime: 1000 * 60 * 1,
  });

  const postsQuery = useQuery<any, Error>({
    queryKey: ["posts", userId, currentPage, selectedChip, searchTerm],
    queryFn: async () => {
      const { posts, lastVisiblePost: lastVisible } = await getPaginatedPosts(
        100,
        null,
        userId,
        searchTerm,
      );
      lastVisiblePost.current = lastVisible;

      let filteredPosts = posts;
      if (selectedChip === "hot") {
        filteredPosts = posts.filter((post) => hotPostIds.includes(post.id));
      } else if (selectedChip === "new") {
        const now = new Date();
        filteredPosts = posts.filter((post: VulDBPost) => {
          const postDate = post.created_at
            ? new Timestamp(
                post.created_at.seconds,
                post.created_at.nanoseconds,
              ).toDate()
            : new Date(0);
          const diffInHours =
            (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
          return diffInHours <= 48 && !hotPostIds.includes(post.id);
        });
      }

      return filteredPosts;
    },
    select: (posts) => {
      const now = new Date();

      return posts.map((post: VulDBPost) => {
        const postDate = post.created_at
          ? new Timestamp(
              post.created_at.seconds,
              post.created_at.nanoseconds,
            ).toDate()
          : new Date(0);
        const diffInHours =
          (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
        const isNew = diffInHours <= 48;
        const isHot = hotPostIds.includes(post.id);
        const chip: "hot" | "new" | "" = isHot ? "hot" : isNew ? "new" : "";

        return { ...post, chip };
      });
    },
    staleTime: 1000 * 60 * 1,
  });

  const filteredPosts = postsQuery.data || [];
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return {
    posts: paginatedPosts,
    totalPages,
    postsLoading: postsQuery.isLoading || latestPostsQuery.isLoading,
    latestPosts: latestPostsQuery.data || [],
    prefetchPage: (page: number) => {
      queryClient.prefetchQuery({
        queryKey: ["posts", userId, page, selectedChip, searchTerm],
        queryFn: async () => {
          const { posts, lastVisiblePost: lastVisible } =
            await getPaginatedPosts(100, null, userId, searchTerm);

          lastVisiblePost.current = lastVisible;

          let filteredPosts = posts;
          if (selectedChip === "hot") {
            filteredPosts = posts.filter((post) =>
              hotPostIds.includes(post.id),
            );
          } else if (selectedChip === "new") {
            const now = new Date();
            filteredPosts = posts.filter((post: VulDBPost) => {
              const postDate = post.created_at
                ? new Timestamp(
                    post.created_at.seconds,
                    post.created_at.nanoseconds,
                  ).toDate()
                : new Date(0);
              const diffInHours =
                (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
              return diffInHours <= 48 && !hotPostIds.includes(post.id);
            });
          }

          return filteredPosts;
        },
      });
    },
  };
}
