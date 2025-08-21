"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bannerSignIn, logoMini } from "@/contants/images";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/queries/auth/useForgotPassword";

// Schema validation for Login
const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});

type ForgotPasswordFormData = z.infer<typeof forgotSchema>;

function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
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

      {/* Forgot Password Form Section */}
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
              Quên mật khẩu
            </h1>
            <p className="text-[#637381] text-sm sm:text-base leading-relaxed">
              Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn và
              chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
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
                    "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại."}
                </div>
              )}

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
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="font-semibold text-white bg-[#FFA10A] hover:bg-[#FFA10A] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 text-sm sm:text-base transition-colors"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang gửi yêu cầu...
                  </>
                ) : (
                  "Gửi yêu cầu"
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

export default ForgotPasswordPage;
