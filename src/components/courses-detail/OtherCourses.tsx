import React from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/courses/course-card";
import { useCourses } from "@/hooks/queries/course/useCourses";
import { CourseFilters } from "@/api/types/course.type";
import { Loader2 } from "lucide-react";

interface OtherCoursesProps {
  instructorName: string;
  instructorId: string; // Thêm instructorId để filter courses
  currentCourseId?: string; // ID của khóa học hiện tại để loại bỏ khỏi danh sách
  onCourseClick: (courseSlug: string) => void;
}

export const OtherCourses: React.FC<OtherCoursesProps> = ({ 
  instructorName, 
  instructorId,
  currentCourseId,
  onCourseClick 
}) => {
  const router = useRouter();

  // Cấu hình filter cho API
  const filters: CourseFilters = {
    owner_id: instructorId,
    page: 1,
  };

  // Gọi API để lấy courses của instructor
  const { data: coursesData, isLoading, error } = useCourses(filters);

  const handleCourseClick = (courseSlug: string) => {
    onCourseClick(courseSlug);
  };

  const handleViewAll = () => {
    // Chuyển đến trang courses với filter theo instructor
    router.push(`/course?instructor=${encodeURIComponent(instructorName)}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="md:text-3xl text-sm font-bold text-[#212B36]">
            Khóa học khác của{" "}
            <span className="text-[#2F57EF]">
              {instructorName}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-gray-400" size={32} />
          <span className="ml-2 text-gray-500">Đang tải khóa học...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="md:text-3xl text-sm font-bold text-[#212B36]">
            Khóa học khác của{" "}
            <span className="text-[#2F57EF]">
              {instructorName}
            </span>
          </div>
        </div>
        <div className="text-center py-10">
          <p className="text-red-500">Có lỗi xảy ra khi tải khóa học</p>
          <p className="text-gray-500 text-sm mt-2">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  // Filter ra current course và lấy các courses khác
  const allCourses = coursesData?.data || [];
  const otherCourses = currentCourseId 
    ? allCourses.filter(course => course.id !== currentCourseId)
    : allCourses;
  
  if (otherCourses.length === 0) {
    return null; // Không hiển thị section nếu không có khóa học khác
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="md:text-3xl text-sm font-bold text-[#212B36]">
          Khóa học khác của{" "}
          <span className="text-[#2F57EF]">
            {instructorName}
          </span>
        </div>
        {otherCourses.length > 2 && (
          <button
            type="button"
            onClick={handleViewAll}
            className="font-semibold cursor-pointer text-xs md:text-base border rounded-lg px-2 py-1 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Xem tất cả
          </button>
        )}
      </div>

      <div className="md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 flex flex-col mt-4">
        {otherCourses.slice(0, 2).map((course) => (
          <div
            key={course.id}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCourseClick(course.slug)}
          >
            <CourseCard
              slug={course.slug}
              gridNUmber={2}
              title={course.title}
              imageUrl={course.thumbnail}
              category="Khóa học"
              courseName={course.title}
              instructor={course.owner.fullName}
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
          </div>
        ))}
      </div>
    </div>
  );
}; 