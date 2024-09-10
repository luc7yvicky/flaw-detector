import { generateLlm } from "@/lib/api/llama3";
import { fetchCodes } from "@/lib/api/repositories";
import { convertEscapedCharacterToRawString } from "@/lib/utils";
import { FileResultFailProps, FileResultProps, FileStatus } from "@/types/file";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

interface FileProcessState {
  fileStatuses: Map<string, FileStatus>;
  currentDetectedFile: string;
  fileDetectedResults: FileResultProps[] | FileResultFailProps | null;
  setFileStatus: (path: string, status: FileStatus) => void;
  getFileStatus: (path: string) => FileStatus;
  resetFileStatuses: () => void;
  setCurrentDetectedFile: (path: string) => void;
  setFileDetectedResults: (results: FileResultProps[] | null) => void;
  processFiles: (
    files: Array<{ path: string; name: string }>,
    username: string,
    repo: string,
    action: string,
  ) => Promise<void>;
}

export const useFileProcessStore = create<FileProcessState>((set, get) => ({
  fileStatuses: new Map(),
  currentDetectedFile: "",
  fileDetectedResults: null,
  setFileStatus: (path, status) =>
    set((state) => {
      const newFileStatuses = new Map(state.fileStatuses);
      newFileStatuses.set(path, status);
      return { fileStatuses: newFileStatuses };
    }),
  getFileStatus: (path) => get().fileStatuses.get(path) ?? null,
  resetFileStatuses: () => set({ fileStatuses: new Map() }),
  setCurrentDetectedFile: (path: string) => set({ currentDetectedFile: path }),
  setFileDetectedResults: (results) => set({ fileDetectedResults: results }),
  processFiles: async (files, username, repo, action) => {
    const processFile = async (file: { path: string; name: string }) => {
      try {
        get().setFileStatus(file.path, "onCheck");
        const content = await fetchCodes(username, repo, file.path);

        // LLM 분석 수행
        const res = await generateLlm("analyze", content);
        // 파싱 가능한 문자열로 변환 (JSON)
        const jsonStr = convertEscapedCharacterToRawString(res);
        // 파싱
        const data = JSON.parse(jsonStr);
        const results: FileResultProps[] = data.map(
          (result: FileResultProps) => ({
            ...result,
            id: uuidv4(),
          }),
        );
        // 결과 대상 파일 저장
        get().setCurrentDetectedFile(file.path);
        // 결과 저장
        get().setFileDetectedResults(results);
        // 파일 검사 상태 변경
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
