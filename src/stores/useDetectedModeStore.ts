import { create } from "zustand";

export type Mode = "undetected" | "detected";

type DetectedModeStore = {
  modes: { [filePath: string]: Mode };
  setMode: (filePath: string, mode: Mode) => void;
  getMode: (filePath: string) => Mode;
};

export const useDetectedModeStore = create<DetectedModeStore>((set, get) => ({
  modes: {},
  setMode: (filePath: string, mode: Mode) =>
    set((state) => ({
      modes: { ...state.modes, [filePath]: mode },
    })),
  getMode: (filePath: string) => {
    return get().modes[filePath] || "undetected";
  },
}));
