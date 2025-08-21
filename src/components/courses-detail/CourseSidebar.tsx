import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown2, ArrowUp2, Backward5Seconds } from "iconsax-react";
import { formatToHourUnit } from "@/until";

interface CourseSidebarProps {
  courseDetail: {
    id: string;
    thumbnail: string;
    category: { title: string };
    title: string;
    ratingAvg?: number;
    ratingCnt: number;
    enrollmentCnt: number;
    discountedPrice?: number;
    regularPrice: number;
    duration?: number;
    totalLessons?: number;
    certification?: boolean;
    totalCompletedLessons?: number;
    language?: string;
  };
  onCheckoutCourse: () => void;
  handlePushToCart: () => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseDetail,
  onCheckoutCourse,
  handlePushToCart,
}) => {
  const [showMoreCardProduct, setShowMoreCardProduct] = useState(false);

  return (
    <div className="lg:w-1/4 block md:absolute right-[5%] top-[20%] h-full">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="w-full h-[250px] relative rounded-lg overflow-hidden mb-8">
          <Image
            src={courseDetail.thumbnail}
            alt={courseDetail.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="text-[#2F57EF] font-semibold mb-1">
          {courseDetail.category.title}
        </div>
        <h2 className="text-xl font-bold mb-4">{courseDetail.title}</h2>

        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-700">
              {courseDetail.ratingAvg || 0}
            </span>
            <span className="ml-1 text-gray-500">
              ({courseDetail.ratingCnt})
            </span>
          </div>
          <div className="mx-3 text-gray-300">|</div>
          <div className="text-gray-700">
            {courseDetail.enrollmentCnt} học viên
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="text-2xl font-bold text-[#2F57EF]">
            {(
              courseDetail.discountedPrice || courseDetail.regularPrice
            ).toLocaleString()}
            đ
          </div>
          {courseDetail.discountedPrice && (
            <div className="ml-2 text-gray-500 line-through text-sm">
              {courseDetail.regularPrice.toLocaleString()}đ
            </div>
          )}
        </div>

        <button
          onClick={handlePushToCart}
          className="bg-[#2F57EF] text-white w-full py-3 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
        >
          Thêm vào giỏ hàng
        </button>
        <button
          onClick={onCheckoutCourse}
          className="bg-white border border-[#919EAB52] mt-2 text-primary w-full py-3 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          Mua ngay
        </button>
        <div className="flex gap-2 justify-center text-secondary mt-2 text-sm items-center">
          <Backward5Seconds size="24" color="#637381" />
          Đảm bảo hoàn tiền trong 30 ngày
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Thời lượng</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-gray-500 font-semibold">
                {courseDetail?.duration
                  ? formatToHourUnit(courseDetail.duration)
                  : "0"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Đã đăng ký</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-gray-500 font-semibold">100</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Bài giảng</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-gray-500 font-semibold">
                {courseDetail?.totalLessons}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
            <div className="text-secondary font-semibold">Cấp độ</div>
            <div className="bg-[#919EAB29] px-2 rounded">
              <span className="text-xs text-gray-500 font-semibold">
                Cơ bản
              </span>
            </div>
          </div>

          {showMoreCardProduct && (
            <>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Ngôn ngữ</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-gray-500 font-semibold">
                    {courseDetail?.language || "Tiếng Việt"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Bài kiểm tra</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-gray-500 font-semibold">
                    {courseDetail?.totalLessons}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Chứng chỉ</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-gray-500 font-semibold">
                    {courseDetail?.certification ? "Có" : "Không"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-dashed border-b-gray-200 mb-4">
                <div className="text-secondary font-semibold">Hoàn thành</div>
                <div className="bg-[#919EAB29] px-2 rounded">
                  <span className="text-xs text-gray-500 font-semibold">
                    {courseDetail?.totalCompletedLessons}
                  </span>
                </div>
              </div>
            </>
          )}
          <button
            onClick={() => setShowMoreCardProduct(!showMoreCardProduct)}
            className="text-[#2F57EF] flex items-center gap-2 mt-4 font-medium"
          >
            {!showMoreCardProduct ? "Hiển thị thêm" : "Ẩn bớt"}
            {!showMoreCardProduct ? (
              <ArrowDown2 size="20" color="#2F57EF" />
            ) : (
              <ArrowUp2 size="20" color="#2F57EF" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};