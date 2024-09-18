import { VulDBPostWithChip } from "@/types/post";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VulDBPostsState {
  vulDBPostsWithChip: VulDBPostWithChip[];
  setVulDBPostsWithChip: (vulDBPostsWithChip: VulDBPostWithChip[]) => void;
  updateScrappedPosts: (scrappedPostIds: string[]) => void;
  scrapPost: (postId: string) => void;
  unscrapPost: (postId: string) => void;
}

export const useVulDBPostsStore = create<VulDBPostsState>()(
  persist(
    (set, get) => ({
      vulDBPostsWithChip: [],

      // 전체 posts 설정
      setVulDBPostsWithChip: (vulDBPostsWithChip) =>
        set({ vulDBPostsWithChip }),

      // 스크랩된 게시물 ID를 받아 상태 업데이트
      updateScrappedPosts: (scrappedPostIds) => {
        const updatedPosts = get().vulDBPostsWithChip.map((post) => ({
          ...post,
          isScrapped: scrappedPostIds
            ? scrappedPostIds.includes(post.id)
            : false,
        }));
        set({ vulDBPostsWithChip: updatedPosts });
      },

      // 스크랩 추가 시 호출
      scrapPost: (postId: string) => {
        const updatedPosts = get().vulDBPostsWithChip.map((post) =>
          post.id === postId ? { ...post, isScrapped: true } : post,
        );
        set({ vulDBPostsWithChip: updatedPosts });
      },

      // 스크랩 취소 시 호출
      unscrapPost: (postId: string) => {
        const updatedPosts = get().vulDBPostsWithChip.map((post) =>
          post.id === postId ? { ...post, isScrapped: false } : post,
        );
        set({ vulDBPostsWithChip: updatedPosts });
      },
    }),
    {
      name: "vuldb-posts-store",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);
