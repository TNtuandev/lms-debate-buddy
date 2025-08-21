import { useQuery } from "@tanstack/react-query";
import { authAPI } from "@/api/endpoints/auth.api";

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => authAPI.getUserById(id),
    enabled: !!id,
  });
}; 