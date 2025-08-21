"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import IconBookDashBoard from "../../../../public/icons/dashboard/IconBookDashBoard";
import IconBookOrange from "../../../../public/icons/dashboard/IconBookOrange";
import IconBookGreen from "../../../../public/icons/dashboard/IconBookGreen";
// import TableMyCourse from "@/components/dashboard/component/TableMyCourse";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useStudent } from "@/hooks/queries/dashboard/useStudent";
import {useTeacher} from "@/hooks/queries/dashboard/useTeacher";
import {MoneyRecive, Profile2User} from "iconsax-react";
import {Book} from "lucide-react";

function DashboardPage() {
  const { isTeacher, user } = useAuthStore();
  const { data: learnerProfileData } = useStudent(user?.id || "", !isTeacher);
  const { data: teacherData } = useTeacher(user?.id || "", isTeacher);

  return (
    <>
      <div className="bg-white shadow h-max rounded-2xl">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Tổng quan</h2>
        </div>

        {/* Statistics Cards */}
        { isTeacher ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-4 pt-6">
              {/* Card 1 */}
              <Card className="bg-[#919EAB14] border-0">
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-[#F4433629] rounded-xl mb-4">
                    <Profile2User size={24} color="#F44336" />
                  </div>
                  <h3 className="text-5xl font-bold text-red-500">{teacherData?.data.totalStudents}</h3>
                  <p className="mt-2 text-sm text-center">Tổng số học viên</p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-[#919EAB14] border-0">
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-[#D14EA829] rounded-xl mb-4">
                    <Book size={24} color="#D14EA8" />
                  </div>
                  <h3 className="text-5xl font-bold text-[#D14EA8]">{teacherData?.data.totalCourses}</h3>
                  <p className="mt-2 text-sm text-center">Tổng khóa học</p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-[#919EAB14] border-0">
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-[#2F57EF29] rounded-xl mb-4">
                    <MoneyRecive size={24} color="#2F57EF" />
                  </div>
                  <h3 className="text-5xl font-bold text-[#2F57EF]">{teacherData?.data.totalPrices ?? 0}</h3>
                  <p className="mt-2 text-sm text-center">Tổng thu nhập (Triệu)</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-4 pt-6">
              {/* Card 1 */}
              <Card className="bg-blue-50 border-0">
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-blue-100 rounded-xl mb-4">
                    <IconBookDashBoard />
                  </div>
                  <h3 className="text-5xl font-bold text-blue-500">{learnerProfileData?.data._totalCoursesEnrolled}</h3>
                  <p className="mt-2 text-sm text-center">Khóa học đã đăng ký</p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-amber-50 border-0">
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-amber-100 rounded-xl mb-4">
                    <IconBookOrange />
                  </div>
                  <h3 className="text-5xl font-bold text-amber-500">{learnerProfileData?.data._totalCoursesInProgress}</h3>
                  <p className="mt-2 text-sm text-center">Khóa học Đang học</p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-green-50 border-0">
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-xl mb-4">
                    <IconBookGreen />
                  </div>
                  <h3 className="text-5xl font-bold text-green-500">{learnerProfileData?.data._totalCoursesCompleted}</h3>
                  <p className="mt-2 text-sm text-center">Khóa học Hoàn thành</p>
                </CardContent>
              </Card>
            </div>
          )
        }
      </div>

      {/*<div className="bg-white shadow h-max rounded-2xl mt-10">*/}
      {/*  <div className="p-4 border-b border-gray-200">*/}
      {/*    <h2 className="text-xl font-semibold mb-6">Khoá học của tôi</h2>*/}
      {/*  </div>*/}
      {/*  <TableMyCourse />*/}
      {/*</div>*/}
    </>
  );
}

export default DashboardPage;
