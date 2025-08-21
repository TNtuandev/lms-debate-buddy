"use client";

import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";

export function WhatYouGet() {
  return (
    <section className="bg-[#212B36] py-20 overflow-hidden relative lg:mt-[120px] mb-20 md:mb-[120px]">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl text-white font-semibold  mb-4">
            Bạn sẽ nhận được gì?
          </h2>
          <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-2">
            <p className="text-[#637381] text-base md:text-lg text-center md:text-left">
              Tự tin giao tiếp, yêu tiếng Anh, phát triển toàn diện.
            </p>
            <span className="bg-[#5067FF] text-white text-base md:text-lg font-bold px-3 py-1 rounded-full">
              Lợi ích!
            </span>
          </div>
        </div>

        <Row gutter={[24, 24]} justify="center" className="mb-16">
          <Col xs={24} md={8}>
            <div className="bg-white rounded-2xl p-8 text-center h-full">
              <Image
                src="/images/home/communication.png"
                alt="Khả năng giao tiếp"
                width={120}
                height={120}
                className="mx-auto mb-8"
              />
              <h4 className="text-3xl font-semibold mb-2">
                Khả năng giao tiếp
              </h4>
              <p className="text-lg text-[#637381]">
                Nâng cao khả năng tự tin nói tiếng Anh tự nhiên.
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="bg-white rounded-2xl p-8 text-center h-full">
              <Image
                src="/images/home/creativity.png"
                alt="Phát triển tư duy"
                width={120}
                height={120}
                className="mx-auto mb-8"
              />
              <h4 className="text-3xl font-semibold mb-2">Phát triển tư duy</h4>
              <p className="text-lg text-[#637381]">
                Kích thích sự sáng tạo, tư duy phản biện.
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="bg-white rounded-2xl p-8 text-center h-full">
              <Image
                src="/images/home/skills.png"
                alt="Nền tảng vững chắc"
                width={120}
                height={120}
                className="mx-auto mb-8"
              />
              <h4 className="text-3xl font-semibold mb-2">
                Nền tảng vững chắc
              </h4>
              <p className="text-lg text-[#637381]">
                Sẵn sàng cho các kỳ thi quốc tế hoặc học lên cao hơn.
              </p>
            </div>
          </Col>
        </Row>
      </div>

      <div className="relative overflow-hidden py-2">
        <div className="whitespace-nowrap animate-marquee text-[#637381] font-semibold tracking-widest text-5xl z-10 relative">
          Khả năng giao tiếp ✦ Phát triển tư duy ✦ Nền tảng vững chắc ✦
        </div>
      </div>
    </section>
  );
}
