"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Book,
  FileText,
  Heart,
  History,
  Home,
  LogOut,
  Settings,
  Star,
  User,
} from "lucide-react";
import IconBookWhite from "../../../../public/icons/IconBookWhite";
import {
  DocumentText,
  MessageText,
  NotificationBing,
  Profile2User,
} from "iconsax-react";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useStudent } from "@/hooks/queries/dashboard/useStudent";
import { UserType } from "@/models/user.model";
import { Button } from "@/components/ui/button";
import { useTeacher } from "@/hooks/queries/dashboard/useTeacher";
import { InstructorProfile, LearnerProfile } from "@/api/types/intructor.type";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, isTeacher } = useAuthStore();
  const router = useRouter();
  const user = useAuthStore.getState().user;
  const [learnerProfileData, setLearnerProfileData] = React.useState<
    LearnerProfile | InstructorProfile | undefined
  >(undefined);

  const { data: teacherData } = useTeacher(user?.id || "", isTeacher);
  const { data: studentData } = useStudent(user?.id || "", !isTeacher);

  useEffect(() => {
    if (isTeacher) {
      setLearnerProfileData(teacherData as InstructorProfile);
    } else {
      setLearnerProfileData(studentData as LearnerProfile);
    }
  }, [studentData, teacherData, isTeacher]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const renderStars = (rating: number | string) => {
    return (
      <div className="flex items-center gap-1 my-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Number(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
            color={star <= Number(rating) ? "#fbbf24" : "#e5e7eb"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-20">
      {/* Colorful Banner/Header */}
      <div className="bg-[linear-gradient(90deg,rgba(255,252,247,1)_0%,rgba(255,241,222,1)_30%,rgba(238,240,255,1)_100%)] w-full h-[300px] relative"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[160px] relative z-10">
        {/* Profile Info Section */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard/banner-profile.png"
            alt="profile banner"
            className="h-full w-max"
          />
          <div className="absolute bottom-10 left-10 text-center flex items-end justify-between right-20">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user?.avatarUrl ??
                  "https://i.pinimg.com/736x/00/7c/bb/007cbbb03fa1405a7bd2b8a353e16242.jpg"
                }
                alt={user?.fullName}
                width={120}
                height={120}
                className="rounded-full border-4 border-white h-[120px] w-[120px]"
              />
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-bold mt-4 text-white">
                  {user?.fullName}
                </h1>
                {isTeacher ? (
                  <>
                    {renderStars(
                      (learnerProfileData as InstructorProfile)?.data
                        ?.ratingAverage,
                    )}
                    <div className="flex items-center gap-2 text-white">
                      <div className="flex items-center mt-2 gap-2 text-white">
                        <IconBookWhite />
                        <span className="text-sm text-white">
                          {
                            (learnerProfileData as InstructorProfile)?.data
                              ?.totalCourses
                          }{" "}
                          Khóa học
                        </span>
                      </div>
                      <div className="flex items-center mt-2 gap-2 text-white">
                        <Profile2User size={20} color="white" />
                        <span className="text-sm text-white">
                          {
                            (learnerProfileData as InstructorProfile)?.data
                              ?.totalStudents
                          }{" "}
                          Người học
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center mt-2 gap-2 text-white">
                    <IconBookWhite />
                    <span className="text-sm text-white">
                      {isTeacher
                        ? (learnerProfileData as InstructorProfile)?.data
                            ?.totalCourses
                        : (learnerProfileData as LearnerProfile)?.data
                            ?._totalCoursesEnrolled}{" "}
                      Khóa học đã đăng ký
                    </span>
                  </div>
                )}
              </div>
            </div>
            {isTeacher && (
              <Button className="text-white">
                <Link href="/create-courses" className="text-white">Tạo khoá học mới</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm font-medium uppercase text-gray-500 mb-4">
              CHÀO MỪNG, {user?.fullName}
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className={`flex items-center px-3 py-3 ${
                  isActive("/dashboard")
                    ? "text-blue-600 bg-[#2F57EF14]"
                    : "text-gray-700 hover:bg-gray-50"
                } rounded-lg`}
              >
                <Home
                  className="w-5 h-5 mr-3"
                  color={isActive("/dashboard") ? "#155dfc" : "#364153"}
                />
                <span
                  className={
                    isActive("/dashboard") ? "font-medium text-blue-600" : ""
                  }
                >
                  Tổng quan
                </span>
              </Link>

              <Link
                href="/dashboard/profile"
                className={`flex items-center px-3 py-3 ${
                  isActive("/dashboard/profile")
                    ? "text-blue-600 bg-[#2F57EF14]"
                    : "text-gray-700 hover:bg-gray-50"
                } rounded-lg`}
              >
                <User
                  className="w-5 h-5 mr-3"
                  color={isActive("/dashboard/profile") ? "#155dfc" : "#364153"}
                />
                <span
                  className={
                    isActive("/dashboard/profile")
                      ? "font-medium text-blue-600"
                      : ""
                  }
                >
                  Hồ sơ
                </span>
              </Link>

              {!isTeacher && (
                <Link
                  href="/dashboard/courses"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/courses")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <Book
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/courses") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/courses")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Khóa học đã đăng ký
                  </span>
                </Link>
              )}

              {!isTeacher && (
                <Link
                  href="/dashboard/favorites"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/favorites")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <Heart
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/favorites") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/favorites")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Yêu thích
                  </span>
                </Link>
              )}

              <Link
                href="/dashboard/reviews"
                className={`flex items-center px-3 py-3 ${
                  isActive("/dashboard/reviews")
                    ? "text-blue-600 bg-[#2F57EF14]"
                    : "text-gray-700 hover:bg-gray-50"
                } rounded-lg`}
              >
                <Star
                  className="w-5 h-5 mr-3"
                  color={isActive("/dashboard/reviews") ? "#155dfc" : "#364153"}
                />
                <span
                  className={
                    isActive("/dashboard/reviews")
                      ? "font-medium text-blue-600"
                      : ""
                  }
                >
                  Đánh giá
                </span>
              </Link>

              {!isTeacher && (
                <Link
                  href="/dashboard/test-scores"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/test-scores")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <FileText
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/test-scores") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/test-scores")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Điểm kiểm tra
                  </span>
                </Link>
              )}

              {!isTeacher && (
                <Link
                  href="/dashboard/purchase-history"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/purchase-history")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <History
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/purchase-history")
                        ? "#155dfc"
                        : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/purchase-history")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Lịch sử mua hàng
                  </span>
                </Link>
              )}
            </nav>

            {user?.type === UserType.INSTRUCTOR && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm font-medium uppercase text-gray-500 mb-4">
                  GIÁO VIÊN
                </div>

                <Link
                  href="/dashboard/my-courses"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/my-courses")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <Book
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/my-courses") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/my-courses")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Khoá học của tôi
                  </span>
                </Link>

                <Link
                  href="/dashboard/notification"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/notification")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <NotificationBing
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/notification")
                        ? "#155dfc"
                        : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/notification")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Thông báo
                  </span>
                </Link>

                <Link
                  href="/dashboard/test"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/test")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <DocumentText
                    className="w-5 h-5 mr-3"
                    color={isActive("/dashboard/test") ? "#155dfc" : "#364153"}
                  />
                  <span
                    className={
                      isActive("/dashboard/test")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Bài kiểm tra
                  </span>
                </Link>

                <Link
                  href="/dashboard/exercise"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/exercise")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <MessageText
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/exercise") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/exercise")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Bài tập
                  </span>
                </Link>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm font-medium uppercase text-gray-500 mb-4">
                CÁ NHÂN
              </div>

              <nav className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center px-3 py-3 ${
                    isActive("/dashboard/settings")
                      ? "text-blue-600 bg-[#2F57EF14]"
                      : "text-gray-700 hover:bg-gray-50"
                  } rounded-lg`}
                >
                  <Settings
                    className="w-5 h-5 mr-3"
                    color={
                      isActive("/dashboard/settings") ? "#155dfc" : "#364153"
                    }
                  />
                  <span
                    className={
                      isActive("/dashboard/settings")
                        ? "font-medium text-blue-600"
                        : ""
                    }
                  >
                    Cài đặt
                  </span>
                </Link>

                <div
                  role="presentation"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex cursor-pointer items-center px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Đăng xuất</span>
                </div>
              </nav>
            </div>
          </div>

          {/* Page Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
