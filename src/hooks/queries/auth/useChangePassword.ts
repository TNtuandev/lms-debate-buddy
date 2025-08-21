import { useMutation } from "@tanstack/react-query";
import { ChangePasswordCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (credentials: ChangePasswordCredentials) => authAPI.changePassword(credentials),
  });
}; 