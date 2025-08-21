import React from "react";
import IconClock from "../../../public/icons/IconClock";
import IconPrize from "../../../public/icons/IconPrize";
import IconUser from "../../../public/icons/IconUser";

interface CourseHeaderProps {
  courseDetail: {
    category: { title: string };
    title: string;
    description: string;
    label?: string;
    ratingAvg?: number;
    ratingCnt: number;
    enrollmentCnt: number;
    owner: { fullName: string };
    updatedAt: string;
  };
  reviewSummaryData?: any
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ courseDetail, reviewSummaryData }) => {
  return (
    <div className="bg-[linear-gradient(90deg,rgba(255,252,247,1)_0%,rgba(255,241,222,1)_30%,rgba(238,240,255,1)_100%)] w-full py-12 md:py-20 md:mt-20 h-max">
      <div className="container mx-auto px-4 py-8 h-full flex flex-col justify-end w-full">
        <div className="text-[#2F57EF] mb-2 md:w-[50%] w-full">
          {courseDetail.category.title}
        </div>
        <div className="text-4xl font-bold text-[#212B36] mb-4 md:w-[50%] w-full">
          {courseDetail.title}
        </div>
        <p className="text-gray-600 mb-2 md:w-[60%] w-full">
          {courseDetail.description}
        </p>
        <div className="my-4 flex flex-wrap items-center gap-4">
          <div className="mt-2 w-max flex items-center gap-2 md:mt-0 font-light text-[#001AC7] border bg-[#DBE0FF] border-white px-4 py-2 rounded-full">
            <IconPrize /> {courseDetail.label || "Bestseller"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xl md:text-2xl font-medium text-[#FFB145]">
                {reviewSummaryData?.averageRating || 0}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = reviewSummaryData?.averageRating || 0;
                  if (index + 1 <= Math.floor(rating)) {
                    // Sao vàng đầy
                    return (
                      <span key={index} className="text-[#FFB145] text-xl md:text-2xl">★</span>
                    );
                  } else if (
                    index < rating &&
                    rating < index + 1 &&
                    rating % 1 >= 0.5
                  ) {
                    // Sao nửa vàng (có thể thay bằng biểu tượng riêng nếu muốn)
                    return (
                      <span key={index} className="text-[#FFB145] text-xl md:text-2xl">★</span>
                    );
                  } else {
                    // Sao xám
                    return (
                      <span key={index} className="text-[#D9D9D9] text-xl md:text-2xl">★</span>
                    );
                  }
                })}
              </div>
            </div>
            <span className="text-gray-500 bg-[#F4F6F8] text-sm md:text-base px-3 py-1 rounded-md whitespace-nowrap">
              {reviewSummaryData?.totalCount} Đánh giá
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconUser />
            <span className="text-sm text-gray-500">
              {courseDetail.enrollmentCnt} Người học
            </span>
          </div>
        </div>
        <div className="text-gray-600 text-sm mb-2">
          Giáo viên: {courseDetail.owner.fullName}
        </div>
        <div className="flex items-center gap-2">
          <IconClock />
          <div className="text-gray-600 text-sm">
            Cập nhật lần cuối{" "}
            {new Date(courseDetail.updatedAt).toLocaleDateString("vi-VN")}
          </div>
        </div>
      </div>
    </div>
  );
}; 