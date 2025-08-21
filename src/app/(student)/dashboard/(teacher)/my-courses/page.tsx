"use client";

import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/courses/course-card";
import { useCoursesCMS } from "@/hooks/queries/course/useCourses";
import { CourseFilters } from "@/api/types/course.type";
import { EStatusCourse } from "@/hooks/queries/course/useStatusCourse";

const TABS = [
  { label: "Xuất bản", value: EStatusCourse.PUBLISHED },
  { label: "Lưu trữ", value: EStatusCourse.ARCHIVED },
  { label: "Nháp", value: EStatusCourse.DRAFT },
];

function MyCoursePage() {
  const [currentPage] = useState(1);
  const [tabActive, setTabActive] = useState(EStatusCourse.PUBLISHED);

  const apiFilters: CourseFilters = useMemo(() => {
    const filters: CourseFilters = {
      page: currentPage,
    };
    switch (tabActive) {
      case EStatusCourse.ARCHIVED:
        filters.status = EStatusCourse.ARCHIVED;
        break;
      case EStatusCourse.DRAFT:
        filters.status = EStatusCourse.DRAFT;
        break;
      case EStatusCourse.PUBLISHED:
        filters.status = EStatusCourse.PUBLISHED;
        break;
    }

    return filters;
  }, [currentPage, tabActive]);
  const { data: coursesData, isLoading } = useCoursesCMS(apiFilters);

  console.log("coursesData----", coursesData)

  return (
    <div className="p-6 bg-[#f9f6ff] min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4">Khóa học của tôi</h2>
        </div>
        <Tabs defaultValue={EStatusCourse.PUBLISHED} onValueChange={(value) => {
          setTabActive(value as EStatusCourse);
        }} className="w-full">
          <TabsList className="mb-6">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!isLoading && coursesData?.data.map((course, idx) => (
                  <div key={idx} className="flex flex-col h-full">
                    <CourseCard
                      slug={course.slug}
                      gridNUmber={4}
                      title={course.title}
                      imageUrl={course.thumbnail}
                      category="Khóa học"
                      courseName={course.title}
                      instructor={`Giảng viên: ${course?.owner.fullName}`}
                      lessonCount={course.totalLesson}
                      badge={course.label}
                      studentCount={course.enrollmentCnt}
                      currentPrice={
                        course.discountedPrice
                          ? course.discountedPrice.toLocaleString()
                          : course.regularPrice.toLocaleString()
                      }
                      originalPrice={
                        course?.discountedPrice
                          ? course.regularPrice.toLocaleString()
                          : ""
                      }
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default MyCoursePage;
