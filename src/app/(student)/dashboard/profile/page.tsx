"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/slices/auth.slice";
import { useQueryClient } from "@tanstack/react-query";
import { InstructorProfile, LearnerProfile } from "@/api/types/intructor.type";
import { formatDateToCustomString } from "@/until";

function ProfilePage() {
  const { user } = useAuthStore.getState();
  const queryClient = useQueryClient();
  const data: LearnerProfile | undefined = queryClient.getQueryData([
    "studentId",
    user?.id,
  ]);

  const teacherData: InstructorProfile | undefined = queryClient.getQueryData([
    "teacherId",
    user?.id,
  ]);

  return (
    <Card className="bg-white border-0 rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Hồ sơ</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-2">
              <label className="block text-gray-500">Ngày đăng ký</label>
              <div className="text-gray-800 font-medium">
                {data?.data?._auditInfo?._createdAt ||
                teacherData?.data?.auditInfo?.createdAt
                  ? formatDateToCustomString(
                      data?.data?._auditInfo?._createdAt ??
                        (teacherData?.data?.auditInfo?.createdAt as string),
                    )
                  : "Chưa có thông tin"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Họ & tên</label>
              <div className="text-gray-800 font-medium">{user?.fullName}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Tên người dùng</label>
              <div className="text-gray-800 font-medium">{user?.username}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Email</label>
              <div className="text-gray-800 font-medium">{user?.email}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Số điện thoại</label>
              <div className="text-gray-800 font-medium">
                {teacherData?.data.mobilePhone ?? data?.data?._mobilePhone ?? "Chưa có thông tin"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-500">Kỹ năng/Nghề nghiệp</label>
              <div className="text-gray-800 font-medium">
                {user?.type === "learner" ? "Học viên" : "Giáo viên"}
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-gray-500">Giới thiệu</label>
              <div className="text-gray-800">
                {teacherData?.data?.bio ?? data?.data?._bio ?? "Chưa có thông tin"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePage;
