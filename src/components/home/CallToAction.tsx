"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";
import { Row, Col } from "antd";

export function CallToAction() {
  const router = useRouter();

  const handleStartFree = () => {
    router.push(Routes.login);
  };

  const handleContact = () => {
    router.push(Routes.contact);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 mt-16 mb-20">
      <div
        className="bg-[#4E6CF4] rounded-3xl p-6 md:p-12 relative overflow-hidden"
        style={{
          boxShadow: "8px 8px 0 #B8FF28",
        }}
      >
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl text-white font-semibold mb-4 max-w-[450px]">
                Sẵn sàng khơi dậy tiềm năng tiếng Anh của bạn!
              </h2>
              <p className="text-base text-[#FFFFFFA3] mb-8 max-w-[500px]">
                Tham gia cùng hơn 60.000 người dùng để thấy lợi ích của việc học
                song ngữ, hoạt động ngoại khóa của Debate Buddy.
              </p>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3 w-full">
              <Button
                onClick={handleStartFree}
                className="bg-[#FFA10A] hover:bg-[#ffb733] text-white font-semibold px-6 py-2 rounded-lg text-sm sm:text-base !transition !duration-300 w-full sm:w-auto"
              >
                Bắt đầu miễn phí!
              </Button>
              <Button
                onClick={handleContact}
                className="bg-white hover:bg-[#f4f6f8] font-semibold px-6 py-2 rounded-lg text-sm sm:text-base border border-white/20 w-full sm:w-auto hover:!border-[#0E0F1C]"
              >
                Liên hệ chúng tôi
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
