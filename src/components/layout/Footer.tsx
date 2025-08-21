import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Routes } from "@/lib/routes/routes";
import { MdLocationOn, MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className="footer bg-white border-[1px] border-[#919EAB3D]">
      <div className="md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto pt-16 pb-8 px-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Image
              src="/images/logo-white.png"
              alt="Logo"
              width={171}
              height={40}
            />
            <div className="mt-8 text-base">
              Debate Buddy là nền tảng học tập trực tuyến hiện đại, mang đến trải
              nghiệm giáo dục linh hoạt và hiệu quả cho học sinh ở mọi lứa tuổi.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-2">
              <div className="text-xl font-semibold">Tài khoản</div>
              <Link
                href={Routes.home}
                className="md:mt-6 cursor-pointer hover:text-primary-main hover:underline"
              >
                Khám phá
              </Link>
              <Link
                href={Routes.home}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Giỏ hàng
              </Link>
              <Link
                href={Routes.home}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Yêu thích
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xl font-semibold">Debate Buddy</div>
              <Link
                href={Routes.abouts}
                className="md:mt-6 cursor-pointer hover:text-primary-main hover:underline"
              >
                Giới thiệu
              </Link>
              <Link
                href={Routes.contact}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Liên hệ
              </Link>
              <Link
                href={Routes.instructors}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                Giảng viên
              </Link>
              <Link
                href={Routes.faq}
                className="cursor-pointer hover:text-primary-main hover:underline"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 text-sm my-4">
          <div className="flex gap-2 items-center flex-1">
            <MdLocationOn className="text-cyan-400 footer-icon" size={18} />
            <div className="text-base">Hà Nội, Việt Nam</div>
          </div>

          <div className="flex gap-2 items-center flex-1">
            <MdEmail className="text-cyan-400 footer-icon" size={18} />
            <div className="text-lg font-bold">debatebuddy@gmail.com</div>
          </div>
        </div>

        <div className="my-8 w-full h-[1px] bg-[#919EAB3D]"></div>
        <div className="lg:flex items-center justify-between">
          <div className="text-sm">
            2025 <span className="font-semibold">Debate Buddy.</span>.
          </div>
          <div className="text-zinc-400 text-sm">
            <Link
              href={Routes.termOfUse}
              className="hover:text-primary-main hover:underline"
            >
              Điều khoản & Điền kiện
            </Link>
            <Link
              href={Routes.policy}
              className="ml-8 hover:text-primary-main hover:underline"
            >
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
