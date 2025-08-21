import { create } from "zustand";

interface UIState {
  isLoading: boolean;
  isSidebarOpen: boolean;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  isSidebarOpen: true,
  setLoading: (isLoading) => set({ isLoading }),
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),
}));
