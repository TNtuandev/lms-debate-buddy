import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import { LoginCredentials, LoginGoogleCredentials } from "@/api/types/auth.type";
import { authAPI } from "@/api/endpoints/auth.api";
import { useMe } from "@/hooks/queries/auth/useMe";
import { useGetOtp } from "@/hooks/queries/auth/useGetOtp";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const userQuery = useMe();
  const { mutate: getOtp,  } = useGetOtp();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: (data) => {
      setAuth(data as any, data?.accessToken);
      userQuery.refetch().then(pis => {
        if (pis?.data) {
          setAuth(pis.data as any, data?.accessToken);
          if (pis.data.isEmailVerified) {
            router.push("/dashboard");
          } else {
            getOtp({email: pis.data.email});
          }
        }
      })
    },
  });
};

export const useLoginGoogleMain = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const userQuery = useMe();
  const { mutate: getOtp,  } = useGetOtp();

  return useMutation({
    mutationFn: (credentials: LoginGoogleCredentials) => authAPI.loginGoogle(credentials),
    onSuccess: (data) => {
      setAuth(data as any, data?.accessToken);
      userQuery.refetch().then(pis => {
        if (pis?.data) {
          setAuth(pis.data as any, data?.accessToken);
          if (pis.data.isEmailVerified) {
            router.push("/dashboard");
          } else {
            getOtp({email: pis.data.email});
          }
        }
      })
    },
  });
};
