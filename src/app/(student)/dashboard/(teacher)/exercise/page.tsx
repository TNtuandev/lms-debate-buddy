"use client";

import React from "react";
import { Table } from "antd";
import { useSubmissionTeacher } from "@/hooks/queries/dashboard/useTeacher";
import { useAuthStore } from "@/store/slices/auth.slice";

function ExcercisePage() {
  const { user, isTeacher } = useAuthStore.getState();
  const { data: teacherSubmissionData } = useSubmissionTeacher(
    user?.id || "",
    isTeacher,
  );

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

  const columns = [
    {
      title: "Bài kiểm tra",
      dataIndex: "lessonName",
      key: "lessonName",
      render: (_: any, record: any) => (
        <div>
          <div className="text-[#212B36] text-[14px]">{record.lessonName}</div>
          <div className="text-xs text-secondary mt-1">
            Khoá học:{" "}
            <span className="font-medium text-[#222]">{record.courseName}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Tổng điểm",
      dataIndex: "score",
      key: "score",
      align: "center" as const,
      width: 180,
      render: (ca: any) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {ca}
        </div>
      ),
    },
    {
      title: "Kết quả",
      dataIndex: "isPassed",
      key: "isPassed",
      align: "center" as const,
      width: 200,
      render: (result: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {renderResultBadge(result.isPassed ? "Đạt" : "Chưa đạt")}
        </div>
      ),
    },
    // {
    //   title: '',
    //   key: 'action',
    //   width: 100,
    //   align: 'center' as const,
    //   render: () => (
    //     <div style={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       gap: '12px',
    //     }}>
    //       <button className="p-2 hover:bg-[#F4F6F8] rounded" title="Sửa">
    //         <Edit2 size={20} color="#2F57EF"/>
    //       </button>
    //       <button className="p-2 hover:bg-[#F4F6F8] rounded" title="Xóa">
    //         <Trash2 size={20} color="#F44336"/>
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="p-6  rounded-2xl box-shadow-page">
      <div className="max-w-5xl mx-auto">
        <div className="font-bold text-[20px] mb-6 text-[#222]">Bài tập</div>

        {/* Filter */}
        {/*<div className="flex flex-col md:flex-row gap-4 mb-2">*/}
        {/*  <div className="flex-1">*/}
        {/*    <div className="text-sm font-semibold pb-2">Khoá học</div>*/}
        {/*    <Select>*/}
        {/*      <SelectTrigger className="w-full h-[48px] border-[#E7E9ED] bg-white text-[#222] text-[15px]">*/}
        {/*        <SelectValue placeholder="Tất cả" />*/}
        {/*      </SelectTrigger>*/}
        {/*      <SelectContent>*/}
        {/*        <SelectItem value="all">Tất cả</SelectItem>*/}
        {/*        <SelectItem value="web">Thiết kế web</SelectItem>*/}
        {/*        <SelectItem value="app">App Development</SelectItem>*/}
        {/*      </SelectContent>*/}
        {/*    </Select>*/}
        {/*  </div>*/}
        {/*  <div className="flex-1">*/}
        {/*    <div className="text-sm font-semibold pb-2">Sắp xếp</div>*/}
        {/*    <Select>*/}
        {/*      <SelectTrigger className="w-full h-[48px] border-[#E7E9ED] bg-white text-[#222] text-[15px]">*/}
        {/*        <SelectValue placeholder="Mặc định" />*/}
        {/*      </SelectTrigger>*/}
        {/*      <SelectContent>*/}
        {/*        <SelectItem value="default">Mặc định</SelectItem>*/}
        {/*        <SelectItem value="date">Ngày tạo</SelectItem>*/}
        {/*      </SelectContent>*/}
        {/*    </Select>*/}
        {/*  </div>*/}
        {/*  <div className="flex-1">*/}
        {/*    <div className="text-sm font-semibold pb-2">Giấy phép</div>*/}
        {/*    <Select>*/}
        {/*      <SelectTrigger className="w-full h-[48px] border-[#E7E9ED] bg-white text-[#222] text-[14px]">*/}
        {/*        <SelectValue placeholder="Tất cả" />*/}
        {/*      </SelectTrigger>*/}
        {/*      <SelectContent>*/}
        {/*        <SelectItem value="all">Tất cả</SelectItem>*/}
        {/*        <SelectItem value="granted">Đã cấp phép</SelectItem>*/}
        {/*        <SelectItem value="not-granted">Chưa cấp phép</SelectItem>*/}
        {/*      </SelectContent>*/}
        {/*    </Select>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-[#E7E9ED] mt-8">
          <Table
            dataSource={teacherSubmissionData?.data ?? []}
            columns={columns}
            pagination={false}
            rowClassName={() =>
              "!bg-white hover:!bg-[#F4F6F8] border-b border-[#F4F6F8]"
            }
            className="custom-ant-table"
          />
        </div>
      </div>
    </div>
  );
}

export default ExcercisePage;
