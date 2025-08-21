import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ForgotPasswordCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) => authAPI.forgotPassword(credentials),
    onSuccess: () => {
      router.push("/verify-account");
    },
  });
}; 