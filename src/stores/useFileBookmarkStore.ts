import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FileBookmark {
  repoName: string;
  filePath: string;
}

interface FileBookmarkState {
  fileBookmarks: FileBookmark[];
  currentRepo: string | null;
  addFileBookmark: (repoName: string, filePath: string) => void;
  removeFileBookmark: (repoName: string, filePath: string) => void;
  toggleFileBookmark: (repoName: string, filePath: string) => void;
  isFileBookmarked: (repoName: string, filePath: string) => boolean;
  getFileBookmarksForRepo: (repoName: string) => string[];
  setCurrentRepo: (repo: string) => void;
  clearAllBookmarks: () => void; 
}

export const useFileBookmarkStore = create<FileBookmarkState>()(
  persist(
    (set, get) => ({
      fileBookmarks: [],
      currentRepo: null,
      addFileBookmark: (repoName, filePath) =>
        set((state) => ({
          fileBookmarks: [...state.fileBookmarks, { repoName, filePath }],
        })),
      removeFileBookmark: (repoName, filePath) =>
        set((state) => ({
          fileBookmarks: state.fileBookmarks.filter(
            (bookmark) =>
              !(
                bookmark.repoName === repoName && bookmark.filePath === filePath
              ),
          ),
        })),
      toggleFileBookmark: (repoName, filePath) =>
        set((state) => {
          const isBookmarked = state.fileBookmarks.some(
            (bookmark) =>
              bookmark.repoName === repoName && bookmark.filePath === filePath,
          );
          if (isBookmarked) {
            return {
              fileBookmarks: state.fileBookmarks.filter(
                (bookmark) =>
                  !(
                    bookmark.repoName === repoName &&
                    bookmark.filePath === filePath
                  ),
              ),
            };
          } else {
            return {
              fileBookmarks: [...state.fileBookmarks, { repoName, filePath }],
            };
          }
        }),
      isFileBookmarked: (repoName, filePath) =>
        get().fileBookmarks.some(
          (bookmark) =>
            bookmark.repoName === repoName && bookmark.filePath === filePath,
        ),
      getFileBookmarksForRepo: (repoName) =>
        get()
          .fileBookmarks.filter((bookmark) => bookmark.repoName === repoName)
          .map((bookmark) => bookmark.filePath),
      setCurrentRepo: (repo) => set({ currentRepo: repo }),
      clearAllBookmarks: () => set({ fileBookmarks: [] }), 
    }),
    
    {
      name: "file-bookmarks-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
