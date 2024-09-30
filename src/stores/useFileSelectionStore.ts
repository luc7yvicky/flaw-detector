import { create } from "zustand";
import { useFileProcessStore } from "./useFileProcessStore";

type FileInfo = {
  name: string;
  size: number;
};

type FileSelectionState = {
  selectedFiles: Map<string, FileInfo>;
  isFileSelected: (path: string) => boolean;
  toggleFileSelection: (path: string, name: string, size: number) => void;
  clearSelection: () => void;
  getSelectedFiles: () => Array<{ path: string; name: string; size: number }>;
  isCheckboxVisible: boolean;
  toggleCheckboxVisibility: () => void;
};

export const useFileSelectionStore = create<FileSelectionState>((set, get) => ({
  selectedFiles: new Map<string, FileInfo>(),
  isFileSelected: (path: string) => get().selectedFiles.has(path),
  toggleFileSelection: (path, name, size) =>
    set((state) => {
      const newSelectedFiles = new Map(state.selectedFiles);
      if (newSelectedFiles.has(path)) {
        newSelectedFiles.delete(path);
      } else {
        newSelectedFiles.set(path, { name, size });
      }
      return { selectedFiles: newSelectedFiles };
    }),
  clearSelection: () => set({ selectedFiles: new Map() }),
  getSelectedFiles: () =>
    Array.from(get().selectedFiles, ([path, { name, size }]) => ({
      path,
      name,
      size,
    })),
  isCheckboxVisible: false,
  toggleCheckboxVisibility: () =>
    set((state) => ({ isCheckboxVisible: !state.isCheckboxVisible })),
}));

export const getSelectedFilesCount = () =>
  useFileSelectionStore.getState().selectedFiles.size;

// initializeSelectedFilesStatus를 외부 함수로 분리
export const initializeSelectedFilesStatus = () => {
  const selectedFiles = useFileSelectionStore.getState().getSelectedFiles();
  useFileProcessStore.getState().resetFileStatuses();
  selectedFiles.forEach(({ path }) => {
    useFileProcessStore.getState().setFileStatus(path, "onWait");
  });
};
