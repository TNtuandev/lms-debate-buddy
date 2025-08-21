import React from "react";
import IconBook from "../../../../public/icons/IconBook";
import IconUser from "../../../../public/icons/IconUser";
import { Edit } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/slices/auth.slice";

interface CourseCardProps {
  badge?: string;
  title: string;
  imageUrl: string;
  category: string;
  courseName: string;
  instructor: string;
  lessonCount: number;
  studentCount: number;
  currentPrice?: string;
  originalPrice?: string;
  gridNUmber?: number;
  slug?: string;
}

function CourseCard({
  badge,
  title,
  slug,
  imageUrl,
  category,
  courseName,
  instructor,
  lessonCount,
  studentCount,
  currentPrice,
  originalPrice,
  gridNUmber = 3,
}: CourseCardProps) {
  const router = useRouter();
  const user = useAuthStore();

  const getBadgeColor = () => {
    switch (badge) {
      case "NEW":
        return "bg-cyan-400";
      case "BEST_SELLER":
        return "bg-green-500";
      case "FEATURED":
        return "bg-red-500";
      case "HOT":
        return "bg-yellow-500";
      default:
        return "bg-cyan-400";
    }
  };

  const onNavigateEditCourse = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    router.push(`/create-courses?slug=${slug}`);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div
      onClick={() => handleCourseClick(slug as string)}
      className="p-2 bg-white flex cursor-pointer flex-col rounded-2xl overflow-hidden shadow-md"
    >
      {/* Card Title with Image */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Course image */}
        <img
          src={imageUrl}
          alt={title}
          className={`object-cover w-full ${gridNUmber === 3 ? "h-64" : "h-48"}`}
          style={{ aspectRatio: "16/9" }}
        />

        {/* Badge */}
        {badge && (
          <div
            className={`absolute top-4 left-4 ${getBadgeColor()} text-white text-xs font-bold px-2 py-1 rounded`}
          >
            {badge}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 bg-white">
        <div className="text-[#FFA10A] text-sm mb-2">{category}</div>
        <h4 className="font-semibold text-lg mb-2">{courseName}</h4>
        <div className="text-gray-600 text-sm mb-2">{instructor}</div>

        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center text-gray-500">
            <span className="mr-1">
              <IconBook />
            </span>{" "}
            {lessonCount} Bài học
          </div>
          <div className="flex items-center text-gray-500">
            <span className="mr-1">
              <IconUser />
            </span>{" "}
            {studentCount} Người học
          </div>
        </div>
        <div className="flex items-center">
          {currentPrice && (
            <span className="text-lg font-medium mr-2">{currentPrice}₫</span>
          )}

          {originalPrice && (
            <span className="text-gray-400 line-through text-sm">
              {originalPrice}₫
            </span>
          )}
        </div>
        {user?.user?.type === "instructor" && (
          <Button
            onClick={(event) => onNavigateEditCourse(event)}
            className="mt-4 hover:bg-secondary/24 cursor-pointer flex items-center w-fit  min-w-6 h-6 gap-2 bg-secondary/16 rounded-lg px-2"
          >
            <Edit size={16} color="#637381" />
            <span className="text-secondary text-sm font-bold">Chỉnh sửa</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
