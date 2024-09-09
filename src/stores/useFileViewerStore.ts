import { create } from "zustand";
interface FileViewerState {
  currentFile: string | null;
  currentRepo: string;
  setCurrentFile: (file: string | null) => void;
  setCurrentRepo: (repo: string) => void;
  resetFileViewer: () => void;
}

export const useFileViewerStore = create<FileViewerState>((set) => ({
  currentFile: null,
  currentRepo: "",
  setCurrentFile: (file) => set({ currentFile: file }),
  setCurrentRepo: (repo) => set({ currentRepo: repo }),
  resetFileViewer: () => set({ currentFile: null, currentRepo: "" }),
}));
