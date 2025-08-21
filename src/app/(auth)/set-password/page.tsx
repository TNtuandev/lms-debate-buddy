"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bannerSignIn, logoMini } from "@/contants/images";
import { useLogin } from "@/hooks/queries/auth/useLogin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Schema validation for Set Password
const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

function SetPasswordPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: login, isPending, error } = useLogin();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (data: SetPasswordFormData) => {
    console.log(data, "----");
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

      {/* Set Password Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[50%] xl:w-[40%] px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 py-8 lg:py-0 min-h-screen">
        {/* Content Container */}
        <div className="w-full max-w-md mx-auto">
          <Image
            src={logoMini}
            alt="logmini"
            width={137}
            height={35}
            className="mx-auto mb-8"
          />

          {/* Title and Description */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-[#212B36] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl mb-4 sm:mb-6">
              Đặt lại mật khẩu
            </h1>
            <p className="text-[#637381] text-sm sm:text-base">
              Yêu cầu đặt lại mật khẩu.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 sm:space-y-5"
            >
              {/* Display API Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error.message ||
                    "Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại."}
                </div>
              )}

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
                          placeholder="Mật khẩu mới"
                          className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 pr-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                          disabled={isPending}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isPending}
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

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Xác nhận mật khẩu"
                          className="w-full border border-gray-200 rounded-[10px] px-4 py-2 h-11 sm:h-12 pr-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                          disabled={isPending}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isPending}
                        >
                          {showConfirmPassword ? (
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="font-semibold text-white bg-[#FFA10A] hover:bg-[#FFA10A] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 text-sm sm:text-base transition-colors mt-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang đặt lại mật khẩu...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          </Form>

          {/* Back to Login Button */}
          <button
            onClick={() => router.push("/login")}
            className="mt-6 sm:mt-8 text-sm sm:text-base text-[#637381] hover:text-[#2F57EF] cursor-pointer flex items-center justify-center gap-2 w-full transition-colors"
            disabled={isPending}
          >
            <span>←</span>
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetPasswordPage;
