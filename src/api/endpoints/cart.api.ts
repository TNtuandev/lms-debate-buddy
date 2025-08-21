import api from "@/api/api";

export const cartAPI = {
  // 0. Lấy thông tin cart
  getCart: async (): Promise<any> => {
    const { data: res } = await api.get(`/carts/active`);
    return res.data;
  },

  // 1. Tạo cart mới
  createCart: async (data?: any): Promise<any> => {
    const { data: res } = await api.post(`/carts`, data);
    return res.data;
  },

  // 2. Thêm item vào cart
  addItemToCart: async (cartId: string, data: any): Promise<any> => {
    const { data: res } = await api.post(`/carts/${cartId}/items`, data);
    return res;
  },

  // 3. Cập nhật item trong cart
  updateCartItem: async (cartId: string, cartItemId: string, data: any): Promise<any> => {
    const { data: res } = await api.patch(`/carts/${cartId}/items/${cartItemId}`, data);
    return res;
  },

  // 4. Xóa item khỏi cart
  removeCartItem: async (cartId: string, cartItemId: string): Promise<any> => {
    const { data: res } = await api.delete(`/carts/${cartId}/items/${cartItemId}`);
    return res;
  },

  // 5. Xóa tất cả items trong cart
  clearCart: async (cartId: string): Promise<any> => {
    const { data: res } = await api.delete(`/carts/${cartId}/items/clear`);
    return res;
  },
}; 