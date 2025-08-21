"use client";
import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/slices/cart.slice";
import { Routes } from "@/lib/routes/routes";
import { Loader2 } from "lucide-react";
import {
  useCourseBySlug,
  useFAQUser,
  useInstructorProfile,
  useModule,
  useRelatedCourses,
  useReview,
  useReviewSummary,
} from "@/hooks/queries/course/useCourses";
import { useCreateReview } from "@/hooks/queries/course/useCreateRview";
import {
  CourseContent,
  CourseDetails,
  CourseFAQ,
  CourseHeader,
  CourseInstructor,
  CourseOverview,
  CourseReviews,
  CourseSidebar,
  OtherCourses,
  RelatedCourses,
} from "@/components/courses-detail";
import {
  useAddItemToCart,
  useRefetchCart,
} from "@/hooks/queries/cart/useCartApi";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.id as string;
  const { cartId } = useCartStore();

  // Fetch course data by slug
  const { data: courseDetail, isLoading, error } = useCourseBySlug(slug);

  // Initialize createReview hook with courseDetail.id for query invalidation
  const { createReview, isLoading: isCreatingReview } = useCreateReview(
    courseDetail?.id,
    () => {
      // Review creation success callback
    },
  );

  // Fetch related courses when we have course detail
  const {
    data: relatedCoursesData,
    isLoading: isLoadingRelated,
    error: errorRelated,
  } = useRelatedCourses(courseDetail?.id || "");

  // Fetch FAQs when we have course detail
  const {
    data: faqsData,
    isLoading: isLoadingFAQs,
    error: errorFAQs,
  } = useFAQUser(courseDetail?.id || "");

  // Fetch FAQs when we have course detail
  const { data: moduleData } = useModule(courseDetail?.id || "");
  const { data: reviewData } = useReview(courseDetail?.id || "");
  const { data: reviewSummaryData, refetch } = useReviewSummary(
    courseDetail?.id || "",
  );
  const { data: instructorProfileData } = useInstructorProfile(
    courseDetail?.owner?.id || "",
  );

  // Add state for active tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "content" | "details" | "instructor" | "reviews"
  >("overview");

  // Add refs for each section
  const overviewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const instructorRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { refetchCart } = useRefetchCart();

  const addToCart = useAddItemToCart();

  // Function to scroll to section
  const scrollToSection = (
    section: "overview" | "content" | "details" | "instructor" | "reviews",
  ) => {
    setActiveTab(section);

    let ref;
    switch (section) {
      case "overview":
        ref = overviewRef;
        break;
      case "content":
        ref = contentRef;
        break;
      case "details":
        ref = detailsRef;
        break;
      case "instructor":
        ref = instructorRef;
        break;
      case "reviews":
        ref = reviewsRef;
        break;
    }

    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-gray-400" size={48} />
        <span className="ml-2 text-gray-500">
          Đang tải thông tin khóa học...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">
            Có lỗi xảy ra khi tải thông tin khóa học
          </p>
          <p className="text-gray-500 text-sm">
            {error?.message || "Vui lòng thử lại sau"}
          </p>
        </div>
      </div>
    );
  }

  // Course not found
  if (!courseDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Không tìm thấy khóa học</p>
          <button
            onClick={() => router.push("/course")}
            className="text-blue-500 hover:underline"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  const handleCourseClick = (courseSlug: string) => {
    router.push(`/course/${courseSlug}`);
  };

  const handleCheckoutCourse = () => {
    addToCart.mutate(
      {
        cartId,
        data: {
          productId: courseDetail.id,
          quantity: 1,
        },
      },
      {
        onSuccess: () => {
          refetchCart();
          router.push(Routes.checkout);
        },
      },
    );
  };

  const handlePushToCart = () => {
    addToCart.mutate(
      {
        cartId,
        data: {
          productId: courseDetail.id,
          quantity: 1,
        },
      },
      {
        onSuccess: () => {
          refetchCart();
        },
      },
    );
  };

  const handleUpdateReview = (
    rating: number,
    comment: string,
    title?: string,
  ) => {
    if (!courseDetail?.id) {
      console.error("Course ID not available");
      return;
    }

    const reviewData = {
      data: {
        rating: rating,
        content: comment,
        title: title || "",
      },
      productId: courseDetail.id,
    };

    createReview.mutate(reviewData, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <CourseHeader
        courseDetail={courseDetail}
        reviewSummaryData={reviewSummaryData}
      />

      {/* Sidebar */}
      <CourseSidebar
        courseDetail={courseDetail}
        onCheckoutCourse={handleCheckoutCourse}
        handlePushToCart={handlePushToCart}
      />

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white py-4">
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "overview" ? "bg-[#2F57EF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("overview")}
              >
                Tổng quan
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "content" ? "bg-[#2F57EF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("content")}
              >
                Nội dung
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "details" ? "bg-[#2F57EF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("details")}
              >
                Chi tiết
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "instructor" ? "bg-[#2F57EF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("instructor")}
              >
                Người hướng dẫn
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full ${activeTab === "reviews" ? "bg-[#2F57EF] text-white" : "bg-[#F4F6F8] text-gray-500 hover:bg-gray-200"}`}
                onClick={() => scrollToSection("reviews")}
              >
                Đánh giá
              </button>
            </div>

            {/* Tab Content */}
            <div ref={overviewRef}>
              <CourseOverview courseDetail={courseDetail.overview} />
            </div>

            <div ref={contentRef}>
              <CourseContent moduleData={moduleData} slug={slug} />
            </div>

            <div ref={detailsRef}>
              <CourseDetails courseDetail={courseDetail} />
            </div>

            <div ref={instructorRef}>
              <CourseInstructor
                courseDetail={courseDetail}
                instructorProfileData={instructorProfileData}
              />
            </div>

            <div ref={reviewsRef}>
              <CourseReviews
                courseDetail={courseDetail}
                reviewData={reviewData as any}
                isCreatingReview={isCreatingReview}
                onUpdateReview={handleUpdateReview}
                reviewSummaryData={reviewSummaryData}
              />
            </div>

            <CourseFAQ
              faqsData={faqsData}
              isLoadingFAQs={isLoadingFAQs}
              errorFAQs={errorFAQs}
            />

            <OtherCourses
              instructorName={courseDetail.owner.fullName}
              instructorId={courseDetail.owner.id}
              currentCourseId={courseDetail.id}
              onCourseClick={handleCourseClick}
            />
          </div>
        </div>
      </div>

      <RelatedCourses
        relatedCoursesData={relatedCoursesData}
        isLoadingRelated={isLoadingRelated}
        errorRelated={errorRelated}
      />
    </div>
  );
}
