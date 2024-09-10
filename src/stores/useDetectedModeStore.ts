import { create } from "zustand";

export type Mode = "undetected" | "detected";

type DetectedModeStore = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export const useDetectedModeStore = create<DetectedModeStore>((set) => ({
  mode: "undetected",
  setMode: (mode: Mode) => set({ mode }),
}));
