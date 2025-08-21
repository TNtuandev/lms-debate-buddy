import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import API_CLIENT from "@/api/api-client";
import { queryClient } from "@/context/QueryBuilder";
import { Routes } from "@/lib/routes/routes";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await API_CLIENT.post("/auth/sign-out"); // ✅ Call logout API
    },
    onSuccess: async () => {
      console.log("signOut");
      await queryClient.invalidateQueries({ queryKey: ["user"] }); // ✅ Clear React Query cache
      logout(); // ✅ Clear Zustand store
      router.push(Routes.home); // ✅ Redirect to login page
    },
  });
};
