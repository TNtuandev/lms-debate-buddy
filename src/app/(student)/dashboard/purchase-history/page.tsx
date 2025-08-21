"use client";

import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "iconsax-react";
import dayjs from "dayjs";
import { useGetOrders } from "@/hooks/queries/order/useOrder";
import { formatCurrency } from "@/lib/utils";

// interface PurchaseOrder {
//   id: string;
//   courseName: string;
//   purchaseDate: string;
//   price: string;
//   status: "Thành công" | "Đang xử lý" | "Đang chờ" | "Đã hủy";
// }

function PurchaseHistoryPage() {
  const { data } = useGetOrders();

  // const totalPrice = (orderDetail: OrderPayment) => {
  //   return orderDetail?.items?.reduce((total, item) => {
  //     return (
  //       total + (item?.discountedPrice * item?.quantity || 0)
  //     );
  //   }, 0);
  // }
  //
  // console.log("data---", totalPrice);

  const handleEdit = (orderId: string) => {
    console.log("Edit order:", orderId);
  };

  // const handleDelete = (orderId: string) => {
  //   console.log("Delete order:", orderId);
  // };

  const renderNameStatusBadge = useCallback(
    (status: "pending" | "completed" | "failed") => {
      switch (status) {
        case "completed":
          return "Thành công";
        case "pending":
          return "Đang chờ";
        case "failed":
          return "Thất bại";
        default:
          return;
      }
    },
    [],
  );

  const renderStatusBadge = (status: "pending" | "completed" | "failed") => {
    const statusConfig = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${statusConfig[status]}`}
      >
        {renderNameStatusBadge(status)}
      </span>
    );
  };

  return (
    <div className="bg-white shadow h-max p-6 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                ID
              </th>
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                Khóa học
              </th>
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                Ngày
              </th>
              <th className="text-left py-4 px-2 text-gray-600 font-medium">
                Giá
              </th>
              <th className="text-center py-4 px-2 text-gray-600 font-medium">
                Trạng thái
              </th>
              <th className="text-right py-4 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((order) => (
              <tr key={order.id} className="border-b border-gray-100">
                <td className="py-6 px-2">
                  <span className="text-gray-900 font-medium">
                    #{order.id.split("-")[0]}
                  </span>
                </td>
                <td className="py-6 px-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-gray-900 font-medium">
                      {index + 1}: {item?.product?.title}
                    </div>
                  ))}
                </td>
                <td className="py-6 px-2">
                  <div>
                    <div className="text-gray-900">
                      {dayjs(order?.createdAt, "YYYY-MM-DDTHH:mm:ssZ").format(
                        "DD/MM/YYYY",
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {dayjs(order?.createdAt, "YYYY-MM-DDTHH:mm:ssZ").format(
                        "HH:mm",
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-6 px-2">
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(order?.payment?.amount)}đ
                  </span>
                </td>
                <td className="py-6 px-2 text-center">
                  {renderStatusBadge(order?.payment?.status)}
                </td>
                <td className="py-6 px-2">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(order.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye size="20" color="#2F57EF" />
                    </Button>
                    {/*<Button*/}
                    {/*  variant="ghost"*/}
                    {/*  size="sm"*/}
                    {/*  onClick={() => handleDelete(order.id)}*/}
                    {/*  className="text-red-600 hover:text-red-700 hover:bg-red-50"*/}
                    {/*>*/}
                    {/*  <Trash size={20} color="#F44336" />*/}
                    {/*</Button>*/}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có lịch sử mua hàng nào.</p>
        </div>
      )}
    </div>
  );
}

export default PurchaseHistoryPage;
