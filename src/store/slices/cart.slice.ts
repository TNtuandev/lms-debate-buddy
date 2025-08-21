import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
}

export interface Product {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  type: string;
  categoryId: string;
  ownerId: string;
  thumbnail: string;
  label: string;
  status: string;
  ratingAvg: number;
  ratingCnt: number;
  enrollmentCnt: number;
  course: Course;
}

export interface Course {
  id: string;
  regularPrice: number;
  discountedPrice: number;
  requirements: string;
  learningOutcomes: string;
  previewVideo: string;
  previewImg: string;
  difficulty: string;
  maxEnrollment: number;
  tags: any;
  isAllowFaq: boolean;
  isDripContent: boolean;
  overview: any[];
  language: string;
  certification: boolean;
  totalCompletedLessons: number;
}
interface CartState {
  count: number;
  orderId: string;
  cartId: string;
  setOrderId: (orderId: string) => void;
  listCart: CartItem[];
  setCount: (count: number) => void;
  setCartId: (idCart: string) => void;
  setListCart: (list: CartItem[]) => void;
  pushToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  qrCodeUrl: string;
  setQrCodeUrl: (url: string) => void;
  voucher: string;
  setVoucher: (voucher: string) => void;
  isItemAdded: (productId: string) => boolean;
}
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      count: 0,
      listCart: [],
      qrCodeUrl: "",
      orderId: "",
      voucher: "",
      cartId: "",

      setVoucher: (voucher: string) => set({ voucher }),
      setCartId: (cartId: string) => {
        console.log("setCartId---", cartId);
        return set({ cartId });
      },
      setOrderId: (orderId: string) => {
        console.log("setOrderId---", orderId);
        return set({ orderId });
      },
      setQrCodeUrl: (url: string) => set({ qrCodeUrl: url }),
      setCount: (count: number) => set({ count }),
      setListCart: (list: CartItem[]) => {
        set({ listCart: [...list], count: list?.length });
      },
      pushToCart: (product: CartItem) =>
        set((state) => ({
          listCart: [...state.listCart, product],
          count: state.count + 1,
        })),
      removeFromCart: (productId: string) =>
        set((state) => ({
          listCart: state.listCart.filter((item) => item.id !== productId),
          count: state.count - 1,
        })),
      clearCart: () => set({ listCart: [], count: 0 }),
      isItemAdded: (productId: string) => {
        return get().listCart.some((item: CartItem) => item.id === productId);
      },
    }),
    {
      name: "cart-storage", // key trong localStorage
      partialize: (state) => ({
        listCart: state.listCart,
        count: state.count,
        cartId: state.cartId,
        orderId: state.orderId,
        voucher: state.voucher,
        qrCodeUrl: state.qrCodeUrl,
      }),
    },
  ),
);