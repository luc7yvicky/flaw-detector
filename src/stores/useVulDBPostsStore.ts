import { VulDBPostWithChip } from "@/types/post";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VulDBPostsState {
  vulDBPostsWithChip: VulDBPostWithChip[];
  setVulDBPostsWithChip: (vulDBPostsWithChip: VulDBPostWithChip[]) => void;
  updateScrappedPosts: (scrappedPostIds: string[]) => void;
}

export const useVulDBPostsStore = create<VulDBPostsState>()(
  persist(
    (set, get) => ({
      vulDBPostsWithChip: [],
      setVulDBPostsWithChip: (vulDBPostsWithChip) =>
        set({ vulDBPostsWithChip }),
      updateScrappedPosts: (scrappedPostIds) => {
        const updatedPosts = get().vulDBPostsWithChip.map((post) => ({
          ...post,
          isScrapped: scrappedPostIds.includes(post.id),
        }));
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
