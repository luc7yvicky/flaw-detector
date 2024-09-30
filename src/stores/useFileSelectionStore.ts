import { create } from "zustand";
import { useFileProcessStore } from "./useFileProcessStore";

type FileSelectionState = {
  selectedFiles: Map<string, string>; 
  toggleFileSelection: (path: string, name: string) => void;
  isFileSelected: (path: string) => boolean;
  getSelectedFilesCount: () => number;
  getSelectedFiles: () => Array<{ path: string; name: string }>;
  initializeSelectedFilesStatus: () => void;
  resetFileSelection: () => void;
  isCheckboxVisible: boolean;
  toggleCheckboxVisibility: () => void;
};

export const useFileSelectionStore = create<FileSelectionState>((set, get) => ({
  selectedFiles: new Map<string, string>(),
  toggleFileSelection: (path, name) => set((state) => {
    const newSelectedFiles = new Map(state.selectedFiles);
    if (newSelectedFiles.has(path)) {
      newSelectedFiles.delete(path);
    } else {
      newSelectedFiles.set(path, name);
    }
    return { selectedFiles: newSelectedFiles };
  }),
  isFileSelected: (path) => get().selectedFiles.has(path),
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
  resetFileSelection: () => set({ selectedFiles: new Map() }),
  isCheckboxVisible: false,
  toggleCheckboxVisibility: () =>
    set((state) => ({ isCheckboxVisible: !state.isCheckboxVisible })),
}));
