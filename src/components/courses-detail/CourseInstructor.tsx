import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import IconUser from "../../../public/icons/IconUser";
import IconVideo from "../../../public/icons/IconVideo";

interface CourseInstructorProps {
  courseDetail: {
    owner: {
      fullName: string;
    };
  };
  instructorProfileData?: {
    data?: {
      totalReviews?: string;
      ratingAverage?: string;
      bio?: string;
    };
  };
}

export const CourseInstructor: React.FC<CourseInstructorProps> = ({ 
  courseDetail, 
  instructorProfileData 
}) => {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
      <h3 className="text-xl font-bold mb-6">Người hướng dẫn</h3>
      <div className="flex flex-col">
        <div className="flex gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative">
            <Image
              src="/images/banner-sign-in.png"
              alt={courseDetail.owner.fullName}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
          <div>
            <h4 className="font-bold text-lg">
              {courseDetail?.owner?.fullName}
            </h4>
            <p className="text-gray-600 mb-2">
              Nhà thiết kế và Giảng viên chính
            </p>
            <div className="flex flex-wrap gap-4 items-center mt-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600">
                  {instructorProfileData?.data?.totalReviews} Nhận xét
                </span>
              </div>
              <div className="bg-[#919EAB29] p-1 rounded">
                <span className="text-sm text-gray-500 font-semibold">
                  {instructorProfileData?.data?.ratingAverage} Đánh giá
                </span>
              </div>

              <div className="flex items-center gap-1">
                <IconUser />
                <span className="text-sm text-gray-600">
                  768 Người học
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IconVideo />
                <span className="text-sm text-gray-600">
                  15 Khóa học
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-4 ${!showFullBio ? "line-clamp-3" : ""}`}>
          <p className="text-gray-600">
            {instructorProfileData?.data?.bio}
          </p>
        </div>

        {instructorProfileData?.data?.bio && (
          <button
            onClick={() => setShowFullBio(!showFullBio)}
            className="text-[#2F57EF] flex items-center gap-2 mt-4 font-medium"
          >
            Hiển thị thêm
            {!showFullBio ? (
              <ArrowDown2 size="20" color="#2F57EF" />
            ) : (
              <ArrowUp2 size="20" color="#2F57EF" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}; 