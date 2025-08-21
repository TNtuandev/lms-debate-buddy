import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RegisterCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authAPI.register(credentials),
    onSuccess: () => {
      router.push("/verify-account")
    },
  });
}; 