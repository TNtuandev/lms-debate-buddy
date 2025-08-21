import {Table } from "antd";
import {Star, Trash2} from "lucide-react";
import React from "react";
import {Edit2} from "iconsax-react";

const TableMyCourse = () => {
  const columns = [
    {
      key: '1',
      title: 'Khoá học',
      dataIndex: 'title'
    },
    {
      key: '2',
      title: 'Đã đăng kí',
      dataIndex: 'count',
    },
    {
      key: '3',
      title: 'Đánh giá',
      dataIndex: 'rating',
      render: () => (
        <div>
          {renderStars(4)}
        </div>
      ),
    },
    {
      key: '4',
      title: '',
      dataIndex: 'rating',
      render: () => (
        <div className="flex gap-4">
          <div>
            <Edit2 size={24} color="#2F57EF"/>
          </div>
          <div>
            <Trash2 size={24} color="#F44336"/>
          </div>
        </div>
      ),
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
            color={star <= rating ? "#fbbf24" : "#e5e7eb"}
          />
        ))}
      </div>
    );
  };

  const data = [
    {
      key: '1',
      title: 'Speaking Korean for Beginners',
      count: 50,
    },
    {
      key: '2',
      title: 'Introduction to Calculus',
      count: 40,
    },
    {
      key: '3',
      title: 'How to Write Your First Novel',
      count: 75,
    },
    {
      key: '4',
      title: 'How to Write Your First Novel',
      count: 20,
    },
  ]


  return (
    <Table columns={columns} dataSource={data} />
  )
}

export default TableMyCourse;