"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import EnrolledCourseCard from "@/components/courses/enrolled-course-card";
import { PlayCircle, MoreHorizontal } from "lucide-react";
import {useGetEnrollments} from "@/hooks/queries/enrollments/useEnrollments";
import {useRouter} from "next/navigation";
import {Routes} from "@/lib/routes/routes";

type TabType = "all" | "in-progress" | "completed";

function EnrolledCoursesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const { data } = useGetEnrollments();
  const router = useRouter();


  console.log("Enrolled courses data:", data);


  // Mock data for enrolled courses

  // Current course for continue learning section
  const currentCourse = {
    imageUrl: "/images/banner-sign-in.png",
    category: "Khóa học Thiết kế",
    courseName: "Thiết kế giao diện người dùng và trải nghiệm (UI/UX)",
    progress: 30,
    currentLesson: "Ý nghĩa của màu sắc trong thiết kế web",
    lessonDuration: "15 phút",
  };

  const handleContinue = (courseId: string) => {
    router.push(`${Routes.course}/${courseId}`)
  };

  const handleEdit = (courseId: string) => {
    console.log("Edit course:", courseId);
  };

  return (
    <div className="bg-white shadow h-max p-6 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Khóa học đã đăng ký</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            Tất cả
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "in-progress"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("in-progress")}
          >
            Đang học
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "completed"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {/* Continue Learning Section */}
      {activeTab !== "completed" && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Tiếp tục học</h3>
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Course Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={currentCourse.imageUrl}
                    alt={currentCourse.courseName}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                  />
                </div>

                {/* Course Info */}
                <div className="flex-grow">
                  <div className="text-blue-600 text-sm mb-1">{currentCourse.category}</div>
                  <h4 className="font-semibold text-lg mb-2">{currentCourse.courseName}</h4>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Hoàn thành: {currentCourse.progress}%</span>
                  </div>
                  <Progress value={currentCourse.progress} className="h-2 mb-3" />

                  <div className="flex items-center text-sm text-gray-600">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    <span>{currentCourse.currentLesson} • {currentCourse.lessonDuration}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Tiếp tục
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((item) => (
          <EnrolledCourseCard
            key={item.course.id}
            imageUrl={item.course?.thumbnail}
            category={item.course.category.title || "Khóa học"}
            courseName={item.course?.title}
            instructor={"Anh Tuấn, Quang Anh"}
            lessonCount={item.course?.totalLessons}
            studentCount={item.course?.enrollmentCnt}
            progress={item.course.totalCompletedLessons}
            status={'in-progress'}
            onContinue={() => handleContinue(item.course?.slug)}
            onEdit={() => handleEdit(item?.course?.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default EnrolledCoursesPage;
