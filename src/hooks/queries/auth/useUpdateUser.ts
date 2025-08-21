import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/api/endpoints/auth.api";
import { User } from "@/api/types/auth.type";

interface UpdateUserData {
  id: string;
  userData: Partial<User>;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: UpdateUserData) => authAPI.updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}; 