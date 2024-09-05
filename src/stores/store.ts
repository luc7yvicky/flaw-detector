import { create } from "zustand";
import { fetchCodes } from "@/lib/api/repositories";
import { FileStatus, RepoContentItem } from "@/types/type";
import { generateLlm } from "@/lib/api/llama3";

interface FileProcessState {
  fileStatuses: Map<string, FileStatus>;
  setFileStatus: (path: string, status: FileStatus) => void;
  getFileStatus: (path: string) => FileStatus | undefined;
  resetFileStatuses: () => void;
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
}));

// 파일 처리 함수
export const processFiles = async (
  files: Array<{ path: string; name: string }>,
  username: string,
  repo: string,
  configName: string,
) => {
  const { setFileStatus } = useFileProcessStore.getState();
  const { fetchFileContent } = useFileViewerStore.getState();

  for (const file of files) {
    setFileStatus(file.path, "onCheck");
    try {
      const content = await fetchFileContent(username, repo, file.path);

      if (!content) {
        throw new Error(`${file.path}의 파일 내용을 가져오지 못했습니다.`);
      }

      const result = await generateLlm(configName, content);

      // TODO: 결과 처리 로직 구현
      // 예: await saveResult(file.path, result);

      setFileStatus(file.path, "success");
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      setFileStatus(file.path, "error");
    }
  }
};

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
  currentFile: string | null;
  fileContent: string | null;
  isLoading: boolean;
  error: string | null;
  contentPromise: Promise<string | null> | null;
  setCurrentFile: (file: string | null) => void;
  fetchFileContent: (
    owner: string,
    repo: string,
    path: string,
  ) => Promise<string | null>;
  resetFileViewer: () => void;
}

export const useFileViewerStore = create<FileViewerState>((set) => ({
  currentFile: null,
  fileContent: null,
  isLoading: false,
  error: null,
  contentPromise: null,
  setCurrentFile: (file) => set({ currentFile: file }),
  fetchFileContent: async (owner, repo, path) => {
    set({ isLoading: true, error: null });

    const contentPromise = new Promise<string | null>(
      async (resolve, reject) => {
        try {
          const content = await fetchCodes(owner, repo, path);
          set({ fileContent: content, isLoading: false });
          resolve(content);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          set({ error: errorMessage, isLoading: false });
          reject(errorMessage);
        }
      },
    );

    set({ contentPromise });
    return contentPromise;
  },
  resetFileViewer: () =>
    set({ currentFile: null, fileContent: null, error: null }),
}));
