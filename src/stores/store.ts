import { create } from "zustand";
import { fetchCodes } from "@/lib/api/repositories";

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
  fetchFileContent: async (owner, repo, path) => {
    set({ isLoading: true, error: null });
    try {
      const content = await fetchCodes(owner, repo, path);
      set({ fileContent: content, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
    }
  },
  resetFileViewer: () =>
    set({ currentFile: null, fileContent: null, error: null }),
}));
