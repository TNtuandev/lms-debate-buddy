import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes/routes";
import { CartItem, useCartStore } from "@/store/slices/cart.slice";
import { formatCurrency } from "@/lib/utils";
import { Trash } from "iconsax-react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {useRefetchCart, useRemoveCartItem} from "@/hooks/queries/cart/useCartApi";
import { useCreateOrder } from "@/hooks/queries/order/useOrder";

interface ICheckoutStepOneDesktopProps {
  setStep: Dispatch<SetStateAction<number>>;
  cartData?: CartItem[];
}
export default function CheckoutStepOneDesktop({
  setStep,
  cartData,
}: ICheckoutStepOneDesktopProps) {
  const { setQrCodeUrl, setOrderId, setVoucher, cartId } =
    useCartStore();
  const { refetchCart } = useRefetchCart();
  const router = useRouter();
  const [selectedVoucher] = useState<string | null>(null);

  const deleteItem = useRemoveCartItem();
  const orderCart = useCreateOrder();

  const handleNavigateToHome = () => {
    router.push(Routes.home);
  };

  const handleDeleteItem = (id: string) => {
    console.log("Delete item with id:", id);
    deleteItem.mutate(
      {
        cartId,
        cartItemId: id,
      },
      {
        onSuccess: () => {
          console.log("Item deleted successfully");
          refetchCart();
        },
      },
    );
  };

  const handleOrder = () => {
    orderCart.mutate(
      {
        cartId,
        paymentMethod: "momo",
      },
      {
        onSuccess: (data) => {
          console.log("Order created successfully:", data);
          setOrderId(data.data.id);
          setQrCodeUrl(
            data?.data.payment?.gatewayPayment?.qrCodeUrl,
          );
          setStep(1);
          setVoucher("");
        },
        onError: (error) => {
          console.error("Error creating order:", error);
        },
      },
    );
  };

  const totalPrice = useMemo(() => {
    return cartData?.reduce((total, item) => {
      return total + Number(item?.product.course.discountedPrice * item?.quantity || 0);
    }, 0);
  }, [cartData]);

  const voucher = useMemo(() => {
    return 0;
  }, [totalPrice, selectedVoucher]);

  const totalSale = useMemo(() => {
    if (voucher && totalPrice) {
      return totalPrice - voucher;
    }
    return totalPrice;
  }, [voucher, totalPrice]);

  return (
    <div className="md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto flex lg:gap-10 w-full lg:flex-row flex-col gap-6 px-6">
      <div className="w-full lg:w-[75%]">
        <div className="w-full">
          <div className="rounded-lg w-full overflow-scroll">
            <table className="w-full border-collapse rounded">
              <thead className="">
                <tr className="bg-gray-100 text-left text-sm rounded-xl boxShadow">
                  <th className="py-3 px-4 text-secondary">Sản phẩm</th>
                  <th className="py-3 px-4 text-secondary">Giá</th>
                  <th className="py-3 px-4 text-secondary">Số lượng</th>
                  <th className="py-3 px-4 text-secondary">Tổng</th>
                  <th className="py-3 px-4 text-secondary text-right"></th>
                </tr>
              </thead>
              <tbody className="mt-8 boxShadow">
                {cartData?.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`${index === 0 ? "border-t-[8px] border-white bg-[#F4F4F5]" : "border-t bg-[#F4F4F5] border-[#E4E4E7]"}`}
                  >
                    <td className="py-3 px-4 text-sm min-w-[300px]">
                      <div className="flex gap-4 items-center font-semibold">
                        <img
                          className="h-12 w-16 rounded-sm"
                          src={transaction.product.thumbnail}
                          alt=""
                        />
                        <div className="text-sm text-primary-contrastText font-light">
                          {transaction?.product.title}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-sm">
                      <div>
                        <div>
                          {formatCurrency(transaction?.product.course.discountedPrice)}đ
                        </div>
                        <div className="font-normal text-[#71717B] line-through">
                          {formatCurrency(transaction?.product.course.regularPrice)}đ
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-center text-sm">
                      {transaction?.quantity}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary-main text-sm">
                      {formatCurrency(transaction?.product.course.discountedPrice * transaction?.quantity)}đ
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => handleDeleteItem(transaction?.id)}
                      >
                        <Trash size="20" color="#637381" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="text-black my-4 flex cursor-pointer"
            onClick={handleNavigateToHome}
          >
            <ArrowLeft size="20" color="#212B36" />
            <span className="ml-2">Tiếp tục mua hàng</span>
          </button>
        </div>
      </div>
      <div>
        <div className="pt-4 bg-[#F4F4F5] p-[24px] rounded-xl text-sm">
          <h3 className="font-bold text-lg">Chi tiết thanh toán</h3>
          <div className="flex justify-between mt-2 gap-2">
            <span className="text-[#71717B]">Tổng</span>
            <span>{formatCurrency(totalPrice)}đ</span>
          </div>
          <div className="flex justify-between mt-2 gap-2">
            <span className="text-[#71717B]">Giảm giá</span>
            <span>{formatCurrency(voucher)}đ</span>
          </div>
          <div className="flex justify-between mt-2 gap-2">
            <span className="text-[#71717B]">Tổng tiền</span>
            <span>{formatCurrency(totalSale)}đ</span>
          </div>
          <div className="flex flex-col mt-[16px]">
            <Button
              className="text-white px-4 py-2 rounded-lg"
              onClick={handleOrder}
            >
              Thanh toán
            </Button>
          </div>
        </div>

        <div className="bg-[#F4F4F5] mt-6 p-[24px] flex justify-between rounded-xl mb-16 lg:mb-0">
          <div className="w-full">
            <div className="text-lg font-semibold">Khuyến mại</div>
            <div className="flex gap-4 mt-2">
              <Input className="h-10 flex-1" placeholder="Mã khuyến mại" />
              <Button
                variant="default"
                className="h-10 px-4 rounded-xl text-white"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
