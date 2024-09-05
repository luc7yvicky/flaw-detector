import { create } from "zustand";
import { fetchCodes } from "@/lib/api/repositories";
import { FileStatus, RepoContentItem } from "@/types/type";
import { generateLlm } from "@/lib/api/llama3";

interface FileProcessState {
  fileStatuses: Map<string, FileStatus>;
  setFileStatus: (path: string, status: FileStatus) => void;
  getFileStatus: (path: string) => FileStatus;
  resetFileStatuses: () => void;
  processFiles: (
    files: Array<{ path: string; name: string }>,
    username: string,
    repo: string,
    action: string,
  ) => Promise<void>;
}

export const useFileProcessStore = create<FileProcessState>((set, get) => ({
  fileStatuses: new Map(),
  setFileStatus: (path, status) =>
    set((state) => {
      const newFileStatuses = new Map(state.fileStatuses);
      newFileStatuses.set(path, status);
      return { fileStatuses: newFileStatuses };
    }),
  getFileStatus: (path) => get().fileStatuses.get(path) ?? null,
  resetFileStatuses: () => set({ fileStatuses: new Map() }),
  processFiles: async (files, username, repo, action) => {
    const processFile = async (file: { path: string; name: string }) => {
      try {
        get().setFileStatus(file.path, "onCheck");
        const content = await fetchCodes(username, repo, file.path);

        // LLM 분석 수행
        const result = await generateLlm("analyze", content);
        // TODO: result 처리 (alert)
        console.log(`File ${file.name} analysis result:`, result);

        get().setFileStatus(file.path, "success");
      } catch (error) {
        get().setFileStatus(file.path, "error");
        console.error(`Error processing file ${file.name}:`, error);
      }
    };

    // 파일을 순차적으로 처리
    for (const file of files) {
      await processFile(file);
    }
  },
}));

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
