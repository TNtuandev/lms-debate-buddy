import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserType } from "@/models/user.model";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUserDraft: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isTeacher?: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isTeacher: user?.type === UserType.INSTRUCTOR,
        }),
      setUserDraft: (user, token) =>
        set({ user, token, isAuthenticated: !!token }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isTeacher: state.isTeacher
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.token) {
          state.isAuthenticated = true;
        }
      },
    },
  ),
);
