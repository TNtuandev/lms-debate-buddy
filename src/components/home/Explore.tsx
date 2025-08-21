"use client";

import Image from "next/image";
import { Row, Col } from "antd";
import React from "react";

function FeatureBlock({
  icon,
  title,
  description,
  bgColor,
  shadowColor,
  textColor = "#ffffff",
}: {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  shadowColor: string;
  textColor?: string;
}) {
  return (
    <div
      className="rounded-[20px] px-6 py-8 shadow-lg"
      style={{
        backgroundColor: bgColor,
        boxShadow: `8px 8px 0 ${shadowColor}`,
        color: textColor,
      }}
    >
      <div className="mb-5">
        <Image src={icon} alt="icon" width={60} height={60} />
      </div>
      <h4
        className="text-2xl md:text-3xl font-semibold mb-2"
        style={{ color: textColor }}
      >
        {title}
      </h4>
      <p className="text-lg leading-relaxed" style={{ color: textColor }}>
        {description}
      </p>
    </div>
  );
}

export function Explore() {
  return (
    <section className="bg-white mt-20 lg:mt-[120px] mb-20 md:mb-[120px]">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-3xl md:text-5xl font-semibold text-center mb-8 md:mb-12">
          Vì sao Funlingo là lựa chọn tốt nhất?
        </h2>

        <Row gutter={[40, 40]} align="stretch">
          <Col xs={24} md={8}>
            <FeatureBlock
              icon="/images/home/icon-learn-progress.png"
              title="Phương pháp"
              description="Học qua trò chơi, bài hát, kể chuyện, hoạt động nhóm."
              bgColor="#FFA10A"
              shadowColor="#B8FF28"
              textColor="#212B36"
            />
          </Col>
          <Col xs={24} md={8}>
            <FeatureBlock
              icon="/images/home/icon-learn-certificate.png"
              title="Giáo viên"
              description="Giáo viên có chuyên môn, được đào tạo chuyên sâu."
              bgColor="#5067FF"
              shadowColor="#B8FF28"
              textColor="#FFFFFF"
            />
          </Col>
          <Col xs={24} md={8}>
            <div className=" text-base sm:text-lg leading-relaxed h-full flex items-center">
              <p>
                Tại Funlingo, chúng tôi tin rằng học tiếng Anh phải là một hành
                trình đầy niềm vui và hứng khởi. Chúng tôi xây dựng môi trường
                học tập an toàn, thân thiện, nơi mỗi đứa trẻ được khuyến khích
                khám phá và phát triển tiềm năng ngôn ngữ của mình.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
