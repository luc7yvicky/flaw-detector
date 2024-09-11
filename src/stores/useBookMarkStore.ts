import { create } from "zustand";

interface BookmarkState {
  bookmarks: Set<string>;
  currentRepo: string | null;
  addBookmark: (path: string) => void;
  removeBookmark: (path: string) => void;
  toggleBookmark: (path: string) => void;
  isBookmarked: (path: string) => boolean;
  setCurrentRepo: (repo: string) => void;
}

export const useBookmarkStore = create<BookmarkState>()((set, get) => ({
  bookmarks: new Set<string>(),
  currentRepo: null,
  addBookmark: (path) =>
    set((state) => ({
      bookmarks: new Set(state.bookmarks).add(path),
    })),
  removeBookmark: (path) =>
    set((state) => {
      const newBookmarks = new Set(state.bookmarks);
      newBookmarks.delete(path);
      return { bookmarks: newBookmarks };
    }),
  toggleBookmark: (path) =>
    set((state) => {
      const newBookmarks = new Set(state.bookmarks);
      if (newBookmarks.has(path)) {
        newBookmarks.delete(path);
      } else {
        newBookmarks.add(path);
      }
      return { bookmarks: newBookmarks };
    }),
  isBookmarked: (path) => get().bookmarks.has(path),
  setCurrentRepo: (repo) =>
    set({ currentRepo: repo, bookmarks: new Set<string>() }),
}));
