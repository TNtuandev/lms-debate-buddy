"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table } from "antd";
import "antd/dist/reset.css";
import {Edit, Trash} from "iconsax-react";

const dataSource = [
  {
    key: '1',
    date: '12/01/2025',
    time: '09:00 am',
    title: 'Thiết kế web',
    course: 'Thiết kế web',
  },
  {
    key: '2',
    date: '12/01/2025',
    time: '09:00 am',
    title: 'App Development',
    course: 'App Development',
  },
  {
    key: '3',
    date: '12/01/2025',
    time: '09:00 am',
    title: 'Announcement Title',
    course: 'Thiết kế web',
  },
];

const columns = [
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
    width: 180,
    render: (_: any, record: any) => (
      <div>
        <div className="font-medium text-[15px] text-[#222]">{record.date}</div>
        <div className="text-xs text-[#637381] mt-1">{record.time}</div>
      </div>
    ),
  },
  {
    title: 'Thông báo',
    dataIndex: 'title',
    key: 'title',
    render: (_: any, record: any) => (
      <div>
        <div className="font-semibold text-[#222] text-[15px]">{record.title}</div>
        <div className="text-xs text-[#919EAB] mt-1">Khóa học: {record.course}</div>
      </div>
    ),
  },
  {
    title: '',
    key: 'action',
    width: 80,
    align: 'right' as const,
    render: () => (
      <div className="flex gap-3 justify-end">
        <button className="p-2 hover:bg-[#F4F6F8] rounded" title="Sửa">
          <Edit size={20} color="#2F57EF"/>
        </button>
        <button className="p-2 hover:bg-[#F4F6F8] rounded" title="Xóa">
          <Trash size={20} color="#F44336"/>
        </button>
      </div>
    ),
  },
];

function NotificationPage() {
  return (
    <div className="p-6  rounded-2xl box-shadow-page">
      <div className="max-w-5xl mx-auto">
        <div className="font-bold text-[20px] mb-4 text-[#222]">Thông báo</div>
        {/* Box tạo thông báo */}
        <div className="bg-[#F4F6F8] rounded-xl flex flex-col md:flex-row md:items-center md:justify-between px-6 py-5 mb-6">
          <div>
            <div className="font-semibold text-[16px] text-[#222]">Tạo thông báo</div>
            <div className="text-xs text-[#637381] mt-1">Thông báo cho tất cả học sinh</div>
          </div>
          <Button className="mt-4 md:mt-0 bg-[#212B36] hover:bg-[#454F5B] font-semibold text-[14px] h-9 px-6 py-2 rounded-lg text-white">
            <span className="text-white">
              Thêm thông báo mới
            </span>
          </Button>
        </div>
        {/* Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <div className="flex-1">
            <div className="text-sm font-semibold pb-2">Khoá học</div>
            <Select>
              <SelectTrigger className="w-full h-[48px] border-[#E7E9ED] bg-white text-[#222] text-[15px]">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="web">Thiết kế web</SelectItem>
                <SelectItem value="app">App Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold pb-2">Sắp xếp</div>
            <Select>
              <SelectTrigger className="w-full h-[48px] border-[#E7E9ED] bg-white text-[#222] text-[15px]">
                <SelectValue placeholder="Mặc định" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="date">Ngày tạo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold pb-2">Giấy phép</div>
            <Select>
              <SelectTrigger className="w-full h-[48px] border-[#E7E9ED] bg-white text-[#222] text-[14px]">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="granted">Đã cấp phép</SelectItem>
                <SelectItem value="not-granted">Chưa cấp phép</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-[#E7E9ED] mt-8">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowClassName={() => "!bg-white hover:!bg-[#F4F6F8] border-b border-[#F4F6F8]"}
            className="custom-ant-table"
          />
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;
