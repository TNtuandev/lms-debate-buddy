"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { bannerSignIn, logoMini } from "@/contants/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useVerify } from "@/hooks/queries/auth/useVerify";
import { useGetOtp } from "@/hooks/queries/auth/useGetOtp";
import { useAuthStore } from "@/store/slices/auth.slice";

function VerifyAccountPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const router = useRouter();
  const user = useAuthStore.getState().user;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  console.log(user, "----user");

  const { mutate: verify, isPending, error } = useVerify();
  const { mutate: resendOtp, isPending: isResendingOtp } = useGetOtp();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      return;
    }
    if (!user?.email) {
      return;
    }

    verify({
      email: user.email,
      code: verificationCode,
    });
  };

  const handleResendCode = () => {
    if (user?.email) {
      resendOtp({ email: user.email });
    }
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

      {/* Verify Account Form Section */}
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
              Xác thực tài khoản
            </h1>
            <p className="text-[#637381] text-sm sm:text-base leading-relaxed">
              Chúng tôi đã gửi mã xác nhận gồm 6 chữ số qua email. Vui lòng nhập
              mã vào ô bên dưới để xác minh email của bạn.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6 text-center">
              {error.message || "Mã xác thực không hợp lệ. Vui lòng thử lại."}
            </div>
          )}

          {/* Verification Code Inputs */}
          <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-10 justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                maxLength={1}
                disabled={isPending}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isPending || code.some((digit) => !digit) || !user?.email}
            className="font-semibold text-white bg-[#FFA10A] hover:bg-[#FFA10A] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl w-full h-11 sm:h-12 text-sm sm:text-base transition-colors mb-6"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              "Xác thực tài khoản"
            )}
          </Button>

          {/* Resend Code */}
          <div className="text-center text-sm sm:text-base mb-6 sm:mb-8">
            <span className="text-[#637381]">Bạn không nhận được mã? </span>
            <button
              onClick={handleResendCode}
              className="text-[#2F57EF] hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              disabled={isPending || isResendingOtp || !user?.email}
            >
              {isResendingOtp ? "Đang gửi..." : "Gửi lại mã"}
            </button>
          </div>

          {/* Back to Login */}
          <button
            onClick={() => router.push("/login")}
            className="text-[#637381] text-sm sm:text-base hover:text-[#2F57EF] cursor-pointer flex items-center justify-center gap-2 w-full transition-colors"
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

export default VerifyAccountPage;
