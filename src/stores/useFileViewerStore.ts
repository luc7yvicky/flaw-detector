import { fetchCodes } from "@/lib/api/repositories";
import { getLanguage } from "@/lib/utils";
import { create } from "zustand";

interface FileViewerState {
  currentRepo: string;
  currentFile: string | null;
  fileContent: string | null;
  isLoading: boolean;
  error: string | null;
  language: string;
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
  language: "text",
  setCurrentRepo: (repo) => set({ currentRepo: repo }),
  setCurrentFile: (file) => set({ currentFile: file }),
  fetchFileContent: async (owner, repo, path) => {
    set({ isLoading: true, error: null });

        // 이미지 파일 예외처리
    const language = getLanguage(path);
    set({ language });
    if (language === "image") {
      set({
        fileContent: "이미지 파일입니다.",
        isLoading: false,
      });
      return;
    }

    try {
      const content = await fetchCodes(owner, repo, path);
      set({ fileContent: content, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
      throw error;
    }
  },
  resetFileViewer: () =>
    set({ currentFile: null, fileContent: null, error: null }),
}));
