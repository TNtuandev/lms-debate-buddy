import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { VerifyEmailCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";

export const useVerify = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: VerifyEmailCredentials) => authAPI.verifyEmail(credentials),
    onSuccess: () => {
      router.push("/login");
    },
  });
};
