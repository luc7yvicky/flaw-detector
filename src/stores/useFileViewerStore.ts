import { create } from "zustand";
interface FileViewerState {
  currentFile: string | null;
  currentRepo: string;
  detectedLines: number[]; // 취약점 검사 결과에서 위치 보기 버튼 클릭 시 해당되는 코드 라인
  setCurrentFile: (file: string | null) => void;
  setCurrentRepo: (repo: string) => void;
  resetFileViewer: () => void;
  setDetectedLines: (lines: number[]) => void;
}

export const useFileViewerStore = create<FileViewerState>((set) => ({
  currentFile: null,
  currentRepo: "",
  detectedLines: [],
  setCurrentFile: (file) => set({ currentFile: file }),
  setCurrentRepo: (repo) => set({ currentRepo: repo }),
  resetFileViewer: () => set({ currentFile: null, currentRepo: "" }),
  setDetectedLines: (lines: number[]) => set({ detectedLines: lines }),
}));
