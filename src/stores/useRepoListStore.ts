import { create } from "zustand";

type RepoListStore = {
  filterByBookmarked: boolean;
  filterByRecentClicked: boolean;
  setFilterByBookmarked: (isBookmarked: boolean) => void;
  setFilterByRecentClicked: (isRecentClicked: boolean) => void;
};

export const useRepoListStore = create<RepoListStore>((set) => ({
  filterByBookmarked: false,
  filterByRecentClicked: false,
  setFilterByBookmarked: (isBookmarked) =>
    set({ filterByBookmarked: isBookmarked }),
  setFilterByRecentClicked: (isRecentClicked) =>
    set({ filterByRecentClicked: isRecentClicked }),
}));
