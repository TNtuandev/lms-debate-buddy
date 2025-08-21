"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/effect-cards';
import CourseCard from "@/components/courses/course-card";
import React from "react";
import {useCourses} from "@/hooks/queries/course";

export default function EffectCardSwiper() {
  const { data: coursesData } = useCourses({
    page: 1,
    perPage: 3,
  });

  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
      className="mySwiper"
    >
      {coursesData?.data?.map((course) => (
        <SwiperSlide className="rounded-2xl" key={course.slug}>
          <CourseCard
            slug={course.slug}
            title={course.title}
            imageUrl={course.thumbnail}
            category="Khóa học"
            courseName={course.title}
            instructor={`Giảng viên: ${course?.owner.fullName}`}
            lessonCount={course.totalLesson}
            badge={course.label}
            studentCount={course.enrollmentCnt}
            currentPrice={
              course.pricing.discounted
                ? course.pricing.discounted.toLocaleString()
                : course.pricing.regular.toLocaleString()
            }
            originalPrice={
              course.pricing.discounted
                ? course.pricing.regular.toLocaleString()
                : ""
            }
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
