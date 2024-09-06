import { RepoContentItem } from "@/types/repo";
import { create } from "zustand";
import { useFileProcessStore } from "./useFileProcessStore";

interface FileSelectionState {
  selectedFiles: Map<string, string>; // path를 key로, 파일 이름을 value로 저장
  selectFile: (path: string, name: string) => void;
  deselectFile: (path: string) => void;
  toggleFileSelection: (path: string, name: string) => void;
  isFileSelected: (path: string) => boolean;
  selectAllFiles: (files: RepoContentItem[]) => void;
  deselectAllFiles: () => void;
  getSelectedFilesCount: () => number;
  getSelectedFiles: () => Array<{ path: string; name: string }>;
  initializeSelectedFilesStatus: () => void;
}

export const useFileSelectionStore = create<FileSelectionState>((set, get) => ({
  selectedFiles: new Map<string, string>(),
  selectFile: (path, name) =>
    set((state) => {
      const newMap = new Map(state.selectedFiles);
      newMap.set(path, name);
      return { selectedFiles: newMap };
    }),
  deselectFile: (path) =>
    set((state) => {
      const newMap = new Map(state.selectedFiles);
      newMap.delete(path);
      return { selectedFiles: newMap };
    }),
  toggleFileSelection: (path, name) =>
    set((state) => {
      const newMap = new Map(state.selectedFiles);
      if (newMap.has(path)) {
        newMap.delete(path);
      } else {
        newMap.set(path, name);
      }
      return { selectedFiles: newMap };
    }),
  isFileSelected: (path) => get().selectedFiles.has(path),
  selectAllFiles: (files) =>
    set((state) => {
      const newMap = new Map(state.selectedFiles);
      files.forEach((file) => newMap.set(file.path, file.name));
      return { selectedFiles: newMap };
    }),
  deselectAllFiles: () => set({ selectedFiles: new Map() }),
  getSelectedFilesCount: () => get().selectedFiles.size,
  getSelectedFiles: () =>
    Array.from(get().selectedFiles, ([path, name]) => ({ path, name })),
  initializeSelectedFilesStatus: () => {
    const selectedFiles = get().getSelectedFiles();
    useFileProcessStore.getState().resetFileStatuses();
    selectedFiles.forEach(({ path }) => {
      useFileProcessStore.getState().setFileStatus(path, "onWait");
    });
  },
}));