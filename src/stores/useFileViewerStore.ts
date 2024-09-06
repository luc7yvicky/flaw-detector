import { fetchCodes } from "@/lib/api/repositories";
import { create } from "zustand";

interface FileViewerState {
  currentRepo: string;
  currentFile: string | null;
  fileContent: string | null;
  isLoading: boolean;
  error: string | null;
  setCurrentRepo: (repo: string) => void;
  setCurrentFile: (file: string | null) => void;
  fetchFileContent: (
    owner: string,
    repo: string,
    path: string,
  ) => Promise<void>;
  resetFileViewer: () => void;
}

export const useFileViewerStore = create<FileViewerState>((set) => ({
  currentRepo: "",
  currentFile: null,
  fileContent: null,
  isLoading: false,
  error: null,
  setCurrentRepo: (repo) => set({ currentRepo: repo }),
  setCurrentFile: (file) => set({ currentFile: file }),
  fetchFileContent: (owner, repo, path) => {
    set({ isLoading: true, error: null });

    return fetchCodes(owner, repo, path)
      .then((content) => {
        set({ fileContent: content, isLoading: false });
      })
      .catch((error) => {
        set({
          error: error instanceof Error ? error.message : "Unknown error",
          isLoading: false,
        });
        throw error; // 에러를 다시 throw하여 호출자가 처리할 수 있게 함
      });
  },
  resetFileViewer: () =>
    set({ currentFile: null, fileContent: null, error: null }),
}));
