import { create } from "zustand";

interface LessonState {
  isQuizStarted: boolean;
  setQuizStarted: (started: boolean) => void;
}

export const useQuizStore = create<LessonState>((set) => ({
  isQuizStarted: false,
  setQuizStarted: (started: boolean) => set({ isQuizStarted: started }),
}));