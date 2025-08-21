import React from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/courses/course-card";

interface RelatedCourse {
  id: string;
  product: {
    slug: string;
    title: string;
    thumbnail: string;
    totalLessons: number;
    enrollmentCnt: number;
    regularPrice: number;
    discountedPrice?: number;
    label?: string;
    owner: {
      fullName: string;
    };
  };
}

interface RelatedCoursesProps {
  relatedCoursesData?: {
    data?: RelatedCourse[];
  };
  isLoadingRelated: boolean;
  errorRelated?: Error | null;
}

export const RelatedCourses: React.FC<RelatedCoursesProps> = ({
  relatedCoursesData,
  isLoadingRelated,
  errorRelated,
}) => {
  const router = useRouter();

  return (
    <div className="bg-[background: linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 232, 210, 0.15) 49.52%, rgba(205, 223, 255, 0.15) 100%);] w-full px-4 md:px-20 md:py-20 py-14">
      <div className="flex flex-col gap-4">
        <div className="text-3xl font-bold text-[#212B36]">
          Các khóa học liên quan
        </div>

        {isLoadingRelated ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={32} />
            <span className="ml-2 text-gray-500">
              Đang tải khóa học liên quan...
            </span>
          </div>
        ) : errorRelated ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">
              Có lỗi xảy ra khi tải khóa học liên quan
            </p>
            <p className="text-gray-500 text-sm">
              {errorRelated?.message || "Vui lòng thử lại sau"}
            </p>
          </div>
        ) : relatedCoursesData?.data &&
          relatedCoursesData?.data.length > 0 ? (
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 flex flex-col mt-4">
            {relatedCoursesData?.data.map((relatedCourse) => {
              const course = relatedCourse.product;
              return (
                <div
                  key={relatedCourse.id}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => router.push(`/course/${course.slug}`)}
                >
                  <CourseCard
                    slug={course.slug}
                    gridNUmber={4}
                    title={course?.title}
                    imageUrl={course?.thumbnail}
                    category="Khóa học"
                    courseName={course?.title}
                    instructor={`Giảng viên: ${course?.owner?.fullName}`}
                    lessonCount={course?.totalLessons}
                    studentCount={course?.enrollmentCnt}
                    currentPrice={
                      course?.regularPrice
                        ? course.regularPrice.toLocaleString()
                        : course?.regularPrice.toLocaleString()
                    }
                    originalPrice={
                      course?.discountedPrice
                        ? course.discountedPrice.toLocaleString()
                        : ""
                    }
                    badge={course?.label}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Chưa có khóa học liên quan nào</p>
          </div>
        )}
      </div>
    </div>
  );
}; 