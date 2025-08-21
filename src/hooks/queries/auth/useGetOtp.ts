import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ForgotPasswordCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";

export const useGetOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: ForgotPasswordCredentials) => authAPI.sendVerification(credentials),
    onSuccess: () => {
      router.push("/verify-account");
    },
  });
};
