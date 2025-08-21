"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";

export function Banner() {
  const router = useRouter();

  const handleNavigateToCourse = () => {
    router.push(Routes.courses);
  };

  const handleNavigateToLogin = () => {
    router.push(Routes.login);
  };

  return (
    <section className="bg-white mt-20">
      <div className="container mx-auto px-6 lg:px-20">
        <Row gutter={[32, 32]} align="middle" className="mb-4">
          <Col xs={24} md={12}>
            <Image
              src="/images/home/title.png"
              alt="Debate Buddy"
              width={232}
              height={80}
              className="mx-auto md:mx-0 mb-4 md:mb-6"
            />
            <div className="font-semibold text-[32px] leading-tight md:text-6xl mb-6 md:mb-10 text-center lg:text-left text-[#0E0F1C]">
              Khơi Dậy Niềm Vui <br /> Học Tiếng Anh
            </div>
            <p className="lg:text-lg text-[#637381] mb-6 md:mb-10 text-center lg:text-left">
              Chương trình học tiếng Anh sáng tạo, giúp con phát triển toàn diện
              kỹ năng nghe, nói, đọc, viết và tự tin giao tiếp.
            </p>
            <div className="flex justify-center lg:justify-start gap-3 mb-6 md:mb-10 flex-wrap">
              <Button
                onClick={handleNavigateToLogin}
                className="h-10 px-5 rounded-full text-white font-bold shadow-sm bg-[#FFA10A] hover:bg-[#ffb733] !hover:bg-[#ffb733] transition-all"
              >
                Đăng ký ngay!
              </Button>
              <Button
                onClick={handleNavigateToCourse}
                className="h-10 px-5 rounded-full border border-[#DFE3E8] text-[#212B36] bg-white font-bold hover:bg-[#F4F6F8] hover:!border-[#0E0F1C] transition-all"
              >
                Xem khóa học
              </Button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Image
                src="/images/home/img_1.png"
                alt="Counter"
                width={136}
                height={56}
              />
              <div className="text-left">
                <div className="text-xl font-bold text-[#6D5DFB]">60K+</div>
                <div className="text-sm text-[#0E0F1C]">Học viên</div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-[600px] aspect-[600/571.7] relative rounded-[32px] overflow-hidden">
                <Image
                  src="/images/home/banner-img.png"
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
