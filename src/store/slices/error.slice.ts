import { create } from "zustand";

interface ErrorState {
  error: Error | null;
  setError: (error: Error | null) => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (error) => set({ error }),
}));
