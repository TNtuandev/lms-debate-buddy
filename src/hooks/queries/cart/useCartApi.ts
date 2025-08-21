import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "@/api/endpoints/cart.api";
import toast from "react-hot-toast";
import {CartItem, useCartStore} from "@/store/slices/cart.slice";

// 0. Hook lấy thông tin cart
export const useGetCart = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartAPI.getCart(),
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled: enabled,
  });
};

export const useRefetchCart = () => {
  const queryClient = useQueryClient()
  const {setListCart} = useCartStore()

  const refetchCart = async () => {
    try {
      const result: {items: CartItem[]} = await queryClient.fetchQuery({
        queryKey: ["cart"]
      })
      setListCart(result?.items || [])
    } catch (err) {
      console.log("err---", err)
    }
  }

  return { refetchCart }
}

// 1. Hook tạo cart mới
export const useCreateCart = () => {
  return useMutation({
    mutationFn: (data?: any) => cartAPI.createCart(data),
    onSuccess: (data) => {
      console.log("Cart created successfully:", data);
      // toast.success("Tạo giỏ hàng thành công!");
    },
    onError: (error) => {
      console.error("Error creating cart:", error);
      toast.error("Có lỗi xảy ra khi tạo giỏ hàng!");
    },
  });
};

// 2. Hook thêm item vào cart
export const useAddItemToCart = () => {
  return useMutation({
    mutationFn: ({ cartId, data }: { cartId: string; data: any }) => 
      cartAPI.addItemToCart(cartId, data),
    onSuccess: (data) => {
      console.log("Item added to cart successfully:", data);
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    },
    onError: (error) => {
      console.error("Error adding item to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    },
  });
};

// 3. Hook cập nhật item trong cart
export const useUpdateCartItem = () => {
  return useMutation({
    mutationFn: ({ cartId, cartItemId, data }: { cartId: string; cartItemId: string; data: any }) => 
      cartAPI.updateCartItem(cartId, cartItemId, data),
    onSuccess: (data) => {
      console.log("Cart item updated successfully:", data);
      toast.success("Cập nhật giỏ hàng thành công!");
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
      toast.error("Có lỗi xảy ra khi cập nhật giỏ hàng!");
    },
  });
};

// 4. Hook xóa item khỏi cart
export const useRemoveCartItem = () => {
  return useMutation({
    mutationFn: ({ cartId, cartItemId }: { cartId: string; cartItemId: string }) => 
      cartAPI.removeCartItem(cartId, cartItemId),
    onSuccess: (data) => {
      console.log("Cart item removed successfully:", data);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    },
    onError: (error) => {
      console.error("Error removing cart item:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng!");
    },
  });
};

// 5. Hook xóa tất cả items trong cart
export const useClearCart = () => {
  return useMutation({
    mutationFn: (cartId: string) => cartAPI.clearCart(cartId),
    onSuccess: (data) => {
      console.log("Cart cleared successfully:", data);
      toast.success("Đã xóa tất cả sản phẩm trong giỏ hàng!");
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast.error("Có lỗi xảy ra khi xóa giỏ hàng!");
    },
  });
};
