import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/store/slices/auth.slice";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useMe = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authAPI.me(),
    enabled: isAuthenticated,
  });
};
