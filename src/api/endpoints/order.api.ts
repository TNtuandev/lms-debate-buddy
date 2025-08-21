import api from "@/api/api";
import {OrderPayment} from "@/hooks/queries/order/order.type";
import _ from "lodash";

export const orderAPI = {
  // Tạo order mới
  createOrder: async (data: any): Promise<any> => {
    const { data: res } = await api.post(`/orders`, data);
    return res;
  },

  // Lấy danh sách orders
  getOrders: async (): Promise<OrderPayment[]> => {
    const { data: res } = await api.get(`/orders`);
    return _.orderBy(res, ['createdAt'], ['desc']);
  },

  // Lấy chi tiết order theo ID
  getOrderById: async (orderId: string): Promise<OrderPayment> => {
    const { data: res } = await api.get(`/orders/${orderId}`);
    return res;
  },

  // Cập nhật order
  updateOrder: async (orderId: string, data: any): Promise<any> => {
    const { data: res } = await api.patch(`/orders/${orderId}`, data);
    return res;
  },

  // Xóa order
  deleteOrder: async (orderId: string): Promise<any> => {
    const { data: res } = await api.delete(`/orders/${orderId}`);
    return res;
  },
}; 