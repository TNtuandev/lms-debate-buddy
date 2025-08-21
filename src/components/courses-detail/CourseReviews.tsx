import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { ReviewDialog } from "@/components/courses/components/ReviewDialog";

interface Review {
  id: string;
  userId: string;
  rating: number;
  content: string;
  title?: string;
  createdAt: string;
  status: string;
  auditInfo: {
    createdAt: string;
  }
  user: {
    fullName: string;
  }
}

interface CourseReviewsProps {
  courseDetail: {
    ratingAvg?: number;
    ratingCnt: number;
  };
  reviewData?: {
    data?: Review[];
  };
  isCreatingReview: boolean;
  onUpdateReview: (rating: number, comment: string, title?: string) => void;
  reviewSummaryData?: any;
}

export const CourseReviews: React.FC<CourseReviewsProps> = ({
  reviewData,
  isCreatingReview,
  onUpdateReview,
  reviewSummaryData,
}) => {
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [openReview, setOpenReview] = useState(false);

  // Helper function to get rating distribution from reviewSummaryData
  const getRatingStats = () => {
    if (!reviewSummaryData) {
      return { ratingCounts: [0, 0, 0, 0, 0], totalReviews: 0 };
    }

    const ratingCounts = [
      reviewSummaryData.distribution["1"] || 0,
      reviewSummaryData.distribution["2"] || 0,
      reviewSummaryData.distribution["3"] || 0,
      reviewSummaryData.distribution["4"] || 0,
      reviewSummaryData.distribution["5"] || 0,
    ];

    return {
      ratingCounts,
      totalReviews: reviewSummaryData.totalCount || 0,
    };
  };

  // Helper function to render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex ">
        {Array.from({ length: rating }, (_, i) => (
          <span className="text-[#FFB145]" key={i}>
            ★
          </span>
        ))}
        {Array.from({ length: 5 - rating }, (_, i) => (
          <span key={i} className="text-gray-300">
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleUpdateReview = (
    rating: number,
    comment: string,
    title?: string,
  ) => {
    onUpdateReview(rating, comment, title);
    setOpenReview(false);
  };

  return (
    <>
      {/* Reviews Rating Section */}
      <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold mb-6">Đánh giá</h3>
          <Button
            onClick={() => setOpenReview(true)}
            className="flex py-2.5 px-4 border-none bg-[#919EAB14]/8 rounded-[10px]"
            size="lg"
            variant="outline"
          >
            <Edit size="20" color="#27272A" />
            <div className="text-sm font-semibold">Viết đánh giá</div>
          </Button>
          <ReviewDialog
            open={openReview}
            onOpenChange={setOpenReview}
            isLoading={isCreatingReview}
            onSubmit={handleUpdateReview}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-[#FFF8EE] p-6 rounded-lg text-center min-w-[200px]">
            <div className="text-6xl font-bold text-[#212B36] mb-2">
              {reviewSummaryData?.averageRating || 0}
            </div>
            <div className="text-sm text-gray-500">
              {reviewSummaryData?.totalCount?.toLocaleString() || 0}
              <br />
              Lượt đánh giá
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {(() => {
              const { ratingCounts, totalReviews } = getRatingStats();

              return [5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star - 1];
                const percentage =
                  totalReviews > 0
                    ? Math.round((count / totalReviews) * 100)
                    : 0;

                return (
                  <div key={star} className="flex items-center gap-2">
                    {renderStarRating(star)}
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-[#FFB145] rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-sm text-gray-600 text-right">
                      {percentage}%
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Featured Reviews */}
      <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-6">Đánh giá nổi bật</h3>

        {reviewData?.data && reviewData.data.length > 0 ? (
          <div className="space-y-3">
            {(() => {
              const reviewsToShow = showMoreReviews
                ? reviewData.data.filter(
                    (review) => review.status === "approved",
                  )
                : reviewData.data
                    .filter((review) => review.status === "approved")
                    .slice(0, 1);

              return reviewsToShow.map((review, index) => (
                <div
                  key={review.id}
                  className={`${
                    index < reviewsToShow.length - 1 && showMoreReviews
                      ? "border-b border-dashed pb-3"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-24 h-24 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-200">
                      {/* Placeholder for user avatar - you may need to fetch user data separately */}
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        User
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#212B36]">
                        {review.user.fullName}
                      </h4>
                      <div className="flex text-[#FFB145] mt-1">
                        {renderStarRating(review.rating)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(review?.auditInfo?.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      {review.title && (
                        <h5 className="font-medium text-[#212B36] mt-2">
                          {review.title}
                        </h5>
                      )}
                      <p className="text-gray-600 mt-2">{review.content}</p>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Chưa có đánh giá nào</p>
          </div>
        )}

        {reviewData?.data &&
          reviewData.data.filter((review) => review.status === "approved")
            .length > 1 && (
            <button
              onClick={() => setShowMoreReviews(!showMoreReviews)}
              className="text-[#2F57EF] flex items-center gap-2 mt-6 font-medium"
            >
              {showMoreReviews ? "Ẩn bớt" : "Hiển thị thêm"}
              {!showMoreReviews ? (
                <ArrowDown2 size="20" color="#2F57EF" />
              ) : (
                <ArrowUp2 size="20" color="#2F57EF" />
              )}
            </button>
          )}
      </div>
    </>
  );
};
