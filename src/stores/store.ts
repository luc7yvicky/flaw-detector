import { create } from 'zustand';
import { fetchCodes } from '@/lib/api/repositories';

interface FileViewerState {
  currentFile: string | null;
  fileContent: string | null;
  isLoading: boolean;
  error: string | null;
  setCurrentFile: (file: string) => void;
  fetchFileContent: (owner: string, repo: string, path: string) => Promise<void>;
  resetFileViewer: () => void; 
}

export const useFileViewerStore = create<FileViewerState>((set) => ({
  currentFile: null,
  fileContent: null,
  isLoading: false,
  error: null,
  setCurrentFile: (file) => set({ currentFile: file }),
  fetchFileContent: async (owner, repo, path) => {
    set({ isLoading: true, error: null });
    try {
      const content = await fetchCodes(owner, repo, path);
      set({ fileContent: content, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  resetFileViewer: () => set({ currentFile: null, fileContent: null, error: null }),
}));