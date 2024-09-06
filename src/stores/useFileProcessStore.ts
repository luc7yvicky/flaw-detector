import { generateLlm } from "@/lib/api/llama3";
import { fetchCodes } from "@/lib/api/repositories";
import { FileStatus } from "@/types/file";
import { create } from "zustand";

interface FileProcessState {
  fileStatuses: Map<string, FileStatus>;
  fileDetectedResults: string | null;
  setFileStatus: (path: string, status: FileStatus) => void;
  getFileStatus: (path: string) => FileStatus;
  resetFileStatuses: () => void;
  setFileDetectedResults: (results: string) => void;
  processFiles: (
    files: Array<{ path: string; name: string }>,
    username: string,
    repo: string,
    action: string,
  ) => Promise<void>;
}

export const useFileProcessStore = create<FileProcessState>((set, get) => ({
  fileStatuses: new Map(),
  fileDetectedResults: null,
  setFileStatus: (path, status) =>
    set((state) => {
      const newFileStatuses = new Map(state.fileStatuses);
      newFileStatuses.set(path, status);
      return { fileStatuses: newFileStatuses };
    }),
  getFileStatus: (path) => get().fileStatuses.get(path) ?? null,
  resetFileStatuses: () => set({ fileStatuses: new Map() }),
  setFileDetectedResults: (results) => set({ fileDetectedResults: results }),
  processFiles: async (files, username, repo, action) => {
    const processFile = async (file: { path: string; name: string }) => {
      try {
        get().setFileStatus(file.path, "onCheck");
        const content = await fetchCodes(username, repo, file.path);

        // LLM 분석 수행
        const results = await generateLlm("analyze", content);
        // TODO: result 처리 (alert)
        console.log(`File ${file.name} analysis result:`, results);
        get().setFileDetectedResults(results);
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
