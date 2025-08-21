"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/slices/auth.slice";
import {
  useAttemptsUser,
  useSubmissionUser,
} from "@/hooks/queries/dashboard/useStudent";
import { formatDateToCustomString } from "@/until";

type TabType = "attempts" | "submission";

function TestScoresPage() {
  const { user, isTeacher } = useAuthStore.getState();
  const [activeTab, setActiveTab] = useState<TabType>("attempts");

  const { data: attemptsData } = useAttemptsUser(user?.id || "", !isTeacher);
  const { data: submissionData } = useSubmissionUser(
    user?.id || "",
    !isTeacher,
  );

  console.log("attemptsData", attemptsData);

  const renderResultBadge = (result: "Đạt" | "Chưa đạt") => {
    const isPass = result === "Đạt";
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
          isPass ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
        }`}
      >
        {result}
      </span>
    );
  };

  return (
    <div className="bg-white shadow h-max p-6 rounded-2xl">
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "attempts"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("attempts")}
          >
            Điểm kiểm tra
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "submission"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("submission")}
          >
            Bài tập
          </button>
        </div>
      </div>
      {activeTab === "attempts" ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 text-gray-600 font-medium">
                    Khóa học
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Qus
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    TM
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    CA
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Kết quả
                  </th>
                </tr>
              </thead>
              <tbody>
                {attemptsData?.data?.map((test) => (
                  <tr key={test.id} className="border-b border-gray-100">
                    <td className="py-6 px-2">
                      <div>
                        <div className="text-gray-900 font-medium mb-1">
                          {test.courseTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateToCustomString(test.attemptAt)}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.totalAnswer}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.score}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.correctAnswer}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      {renderResultBadge(test.isPassed ? "Đạt" : "Chưa đạt")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Empty State */}
          {attemptsData?.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có điểm kiểm tra nào.</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 text-gray-600 font-medium">
                    Bài tập
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Tổng điểm
                  </th>
                  <th className="text-center py-4 px-2 text-gray-600 font-medium">
                    Kết quả
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissionData?.data?.map((test) => (
                  <tr key={test.id} className="border-b border-gray-100">
                    <td className="py-6 px-2">
                      <div>
                        <div className="text-gray-900 font-medium mb-1">
                          {test.lessonName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {test.courseName}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {test.score}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-center">
                      {renderResultBadge(test.isPassed ? "Đạt" : "Chưa đạt")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Empty State */}
          {submissionData?.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có điểm kiểm tra nào.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TestScoresPage;
