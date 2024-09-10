import { VulDBPostWithChip } from "@/types/post";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**  필요한 필드(id와 chip만)를 추출하는 함수 */
const extractIdAndChip = (posts: VulDBPostWithChip[]) => {
  return posts.map((post) => ({
    id: post.id,
    chip: post.chip,
  }));
};

interface VulDBPostsState {
  vulDBPostsWithChip: { id: string; chip: string }[];
  setVulDBPostsWithChip: (vulDBPostsWithChip: VulDBPostWithChip[]) => void;
}

export const useVulDBPostsStore = create<VulDBPostsState>()(
  persist(
    (set) => ({
      vulDBPostsWithChip: [],
      setVulDBPostsWithChip: (vulDBPostsWithChip) =>
        set({ vulDBPostsWithChip: extractIdAndChip(vulDBPostsWithChip) }),
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
