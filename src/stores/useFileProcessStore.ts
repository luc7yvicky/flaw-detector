import { generateLlm } from "@/lib/api/llama3";
import {
  addFileResults,
  fetchCodes,
  updateRepoStatus,
} from "@/lib/api/repositories";
import { convertEscapedCharacterToRawString } from "@/lib/utils";
import { FileResultFailProps, FileResultProps, FileStatus } from "@/types/file";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { FILE_INSPECTION_STATUS_KEY } from "../lib/const";

// 파일 검사 여부 있는 경우, 로컬 스토리지에 저장
const saveFileStatusesToLocalStorage = (
  fileStatuses: Map<string, FileStatus>,
) => {
  if (typeof window !== "undefined") {
    const serializedStatuses = JSON.stringify(
      Array.from(fileStatuses.entries()),
    );
    localStorage.setItem(FILE_INSPECTION_STATUS_KEY, serializedStatuses);
  }
};

const loadFileStatusesFromLocalStorage = (): Map<string, FileStatus> => {
  if (typeof window !== "undefined") {
    const serializedStatuses = localStorage.getItem(FILE_INSPECTION_STATUS_KEY);
    if (serializedStatuses) {
      return new Map(JSON.parse(serializedStatuses));
    }
  }
  return new Map();
};

interface FileProcessState {
  fileStatuses: Map<string, FileStatus>;
  currentDetectedFile: string | null;
  fileDetectedResults: FileResultProps[] | FileResultFailProps | null;
  isInspectionRunning: boolean;
  setFileStatus: (path: string, status: FileStatus) => void;
  getFileStatus: (path: string) => FileStatus | null;
  resetFileStatuses: () => void;
  setCurrentDetectedFile: (path: string | null) => void;
  setFileDetectedResults: (results: FileResultProps[] | null) => void;
  setIsInspectionRunning: (isRunning: boolean) => void;
  processFile: (
    username: string,
    repo: string,
    file: { path: string; name: string },
  ) => Promise<void>;
  processFiles: (
    files: Array<{ path: string; name: string }>,
    username: string,
    repo: string,
    action: string,
  ) => Promise<void>;
}

export const useFileProcessStore = create<FileProcessState>((set, get) => ({
  fileStatuses: loadFileStatusesFromLocalStorage(),
  currentDetectedFile: null,
  fileDetectedResults: null,
  isInspectionRunning: false,
  setFileStatus: (path, status) =>
    set((state) => {
      const newFileStatuses = new Map(state.fileStatuses);
      newFileStatuses.set(path, status);
      saveFileStatusesToLocalStorage(newFileStatuses);
      return { fileStatuses: newFileStatuses };
    }),
  getFileStatus: (path) => get().fileStatuses.get(path) ?? null,
  resetFileStatuses: () => set({ fileStatuses: new Map() }),
  setCurrentDetectedFile: (path: string | null) =>
    set({ currentDetectedFile: path }),
  setFileDetectedResults: (results) => set({ fileDetectedResults: results }),
  setIsInspectionRunning: (isRunning: boolean) =>
    set({ isInspectionRunning: isRunning }),
  processFile: async (username, repo, file: { path: string; name: string }) => {
    try {
      // 파일 검사 상태 초기화
      get().setFileDetectedResults(null);
      get().setFileStatus(file.path, "onCheck");
      const content = await fetchCodes(username, repo, file.path);

      try {
        // LLM 분석 수행
        const res = await generateLlm("analyze", content);
        // 파싱 가능한 문자열로 변환 (JSON)
        const jsonStr = convertEscapedCharacterToRawString(res);
        // 파싱
        const data = await JSON.parse(jsonStr);

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

        try {
          // 결과 DB에 저장
          await addFileResults(username, repo, file.path, results);
        } catch (err) {
          get().setFileStatus(file.path, "error");
          return;
        }
      } catch (error) {
        console.error(`Error parsing JSON:`, error);
        get().setFileStatus(file.path, "error");
        return;
      }

      try {
        // 파일 검사 상태 DB에 저장
        await updateRepoStatus(username, repo, "onProgress");
      } catch (err) {
        console.error(`Error updating repo status:`, err);
        get().setFileStatus(file.path, "error");
        return;
      }

      // 파일 검사 상태 변경
      get().setFileStatus(file.path, "success");
    } catch (error) {
      get().setFileStatus(file.path, "error");
      console.error(`Error processing file ${file.name}:`, error);
      return;
    }
  },
  processFiles: async (files, username, repo, action) => {
    // 파일을 순차적으로 처리
    for (const file of files) {
      await get().processFile(username, repo, file);
    }
    set({ isInspectionRunning: false });
  },
}));
