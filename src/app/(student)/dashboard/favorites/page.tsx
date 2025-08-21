"use client";

import React, { useState } from "react";
import Pagination from "@/components/ui/pagination";
import { useWishList } from "@/hooks/queries/dashboard/useStudent";
import { useAuthStore } from "@/store/slices/auth.slice";
import CourseCard from "@/components/courses/course-card";
import { useRouter } from "next/navigation";

function FavoritesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const user = useAuthStore.getState().user;
  const { data: wishListData, isLoading, error } = useWishList(user?.id || "");
  const router = useRouter();

  // Calculate pagination based on actual data from BE
  const totalItems = wishListData?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;

  // Get current page data
  const currentPageData = wishListData?.data?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white shadow h-max p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">Yêu thích</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải danh sách khóa học yêu thích...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow h-max p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">Yêu thích</h2>
        <div className="text-center py-12">
          <p className="text-red-500">Có lỗi xảy ra khi tải danh sách khóa học yêu thích.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow h-max p-6 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Yêu thích</h2>

      {/* Course Grid */}
      {currentPageData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPageData.map((course: any) => (
            <div
              key={course.id}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => handleCourseClick(course.course.slug)}
            >
              <CourseCard
                slug={course.course.slug}
                gridNUmber={3}
                title={course.course.title}
                imageUrl={course.course.thumbnail}
                category={course?.course?.category?.title}
                courseName={course.course.title}
                instructor={`Giảng viên: ${course?.course?.owner?.fullName || "American Instructor"}`}
                lessonCount={course.course?.totalLessons}
                badge={course.course.label}
                studentCount={course.course.enrollmentCnt}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có khóa học yêu thích nào.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
