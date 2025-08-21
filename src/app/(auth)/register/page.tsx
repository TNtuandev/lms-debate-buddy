"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bannerSignIn, logoGoogle, logoMini } from "@/contants/images";
import { useRegister } from "@/hooks/queries/auth/useRegister";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginGoogleMain } from "@/hooks/queries/auth/useLogin";

// Schema validation for Register
const registerSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const { mutate: register, isPending, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUserDraft = useAuthStore((state) => state.setUserDraft);
  const {
    mutate: loginGoogle,
    isPending: isPendingGoogle,
    error: errorGoogle,
  } = useLoginGoogleMain();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const dataToRegister = {
      fullName: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      passwordConfirmation: data.password
    }
    setUserDraft({
      id: "",
      name: data.name.trim(),
      email: data.email.trim(),
    } as any, "")
    register(dataToRegister);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Google login success - call our API with access token
        loginGoogle({
          accessToken: response.access_token,
          idToken: '',
        });
      } catch (error) {
        console.error('Error processing Google login:', error);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
    },
    scope: 'openid profile email',
    flow: 'implicit',
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex w-full min-h-screen flex-col lg:flex-row">
      {/* Banner Image - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:block lg:w-[50%] xl:w-[60%]">
        <Image
          src={bannerSignIn}
          alt="banner"
          width={776}
          className="h-screen object-fill mx-auto"
        />
      </div>

      {/* Register Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[50%] xl:w-[40%] px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 py-8 lg:py-0 min-h-screen">
        {/* Logo */}
        <div className="w-full max-w-md mx-auto">
          <Image
              src={logoMini}
              alt="logmini"
              width={137}
              height={35}
              className="mx-auto mb-8"
          />

          {/* Welcome Text */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-[#212B36] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl mb-3 sm:mb-4">
              Bắt đầu hoàn toàn miễn phí
            </h1>
            <div className="flex justify-center gap-2 text-sm sm:text-base text-[#212B36]">
              <span>Bạn đã có tài khoản?</span>
              <span
                role="presentation"
                className="text-[#FFA10A] cursor-pointer hover:underline font-medium"
                onClick={() => router.push("/login")}
              >
                Đăng nhập
              </span>
            </div>
          </div>

          {/* Register Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              {/* Display API Error */}
              {(error || errorGoogle) && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error?.message ||
                    errorGoogle?.message ||
                    "Đã xảy ra lỗi khi đăng kí. Vui lòng thử lại."}
                </div>
              )}

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Họ và tên"
                        className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                        disabled={isPending || isPendingGoogle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                        disabled={isPending || isPendingGoogle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 pr-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                          disabled={isPending || isPendingGoogle}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isPending || isPendingGoogle}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms and Conditions */}
              <div className="text-center text-[#637381] text-xs sm:text-sm mt-4 space-y-1">
                <div>Bằng cách đăng ký, tôi đồng ý với</div>
                <div className="flex justify-center items-center gap-1 flex-wrap">
                  <span className="underline cursor-pointer hover:text-blue-600 transition-colors">
                    Điều khoản dịch vụ
                  </span>
                  <span className="text-[#637381]">và</span>
                  <span className="underline cursor-pointer hover:text-blue-600 transition-colors">
                    Chính sách bảo mật
                  </span>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isPending || isPendingGoogle}
                className="font-semibold text-white bg-[#FFA10A] hover:bg-[#FFA10A] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 text-sm sm:text-base transition-colors mt-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="text-center text-[#637381] text-sm my-5 sm:my-6">Hoặc</div>

          {/* Google Register Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isPending || isPendingGoogle}
            variant="outline"
            className="font-normal text-primary bg-[#919EAB14] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 flex justify-center items-center gap-2 border-none text-sm sm:text-base transition-colors"
          >
            <Image
              src={logoGoogle}
              alt="Google logo"
              className="h-5 w-5 sm:h-6 sm:w-6 object-cover"
            />
            Đăng ký với Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
