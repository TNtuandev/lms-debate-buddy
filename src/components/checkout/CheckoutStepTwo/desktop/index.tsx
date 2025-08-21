import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ExpandItem from "@/components/checkout/CheckoutStepTwo/expand-item";
import { CartItem, useCartStore } from "@/store/slices/cart.slice";
import { formatCurrency } from "@/lib/utils";

interface ICheckoutStepTwoDesktopProps {
  setStep: Dispatch<SetStateAction<number>>;
  cartData?: CartItem[];
}

export default function CheckoutStepTwoDesktop({
  setStep,
  cartData,
}: ICheckoutStepTwoDesktopProps) {
  const { voucher, clearCart } = useCartStore();

  const totalPrice = useMemo(() => {
    return cartData?.reduce((total, item) => {
      return (
        total + (item?.product.course.discountedPrice * item?.quantity || 0)
      );
    }, 0);
  }, [cartData]);

  const voucherSale = useMemo(() => {
    return 0;
  }, [totalPrice, voucher]);

  const totalSale = useMemo(() => {
    if (voucherSale && totalPrice) {
      return totalPrice - voucherSale;
    }
    return totalPrice;
  }, [voucherSale, totalPrice]);

  const handleSubmit = () => {
    setStep(2);
    clearCart()
  }

  return (
    <div className="flex gap-[40px] w-full px-[5%] mb-[100px] lg:flex-row flex-col">
      <div className="w-full lg:w-[75%] h-max">
        <div className="w-full h-max bg-gray-100 rounded-lg p-[24px] mb-5">
          <div className="text-2xl font-semibold mb-[12px]">
            Chi tiết đơn hàng
          </div>
          <div>
            {cartData?.map((transaction, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <div className="flex gap-4 items-center flex-1">
                  <img
                    className="h-12 w-16 rounded-sm"
                    src={transaction.product.thumbnail}
                    alt=""
                  />
                  <div className="text-sm text-primary-contrastText flex-1">
                    {transaction?.product.title}
                  </div>
                </div>
                <div className="py-3 px-4">{transaction?.quantity}</div>
                <div className="py-3 px-4 font-semibold text-primary-main text-sm w-1/4 text-end">
                  {formatCurrency(transaction?.product.course.discountedPrice * transaction.quantity)}đ
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-max bg-gray-100 rounded-lg p-[24px]">
          <div className="text-2xl font-semibold mb-[24px]">
            Chọn phương thức thanh toán
          </div>
          <ExpandItem totalPrice={totalPrice} />
        </div>
      </div>
      <div className="flex-1">
        {/*<div className="bg-[#F4F4F5] p-[24px] mb-6 flex justify-between rounded-xl">*/}
        {/*  <div className="flex gap-2 items-center">*/}
        {/*    <IconVoucher />*/}
        {/*    <div>*/}
        {/*      <div className="text-lg font-semibold">Voucher</div>*/}
        {/*      <div className="text-sm font-normal text-[#71717B]">Chọn mã áp dụng ưu đãi</div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <PromotionDialog />*/}
        {/*</div>*/}
        <div className="pt-4 bg-[#F4F4F5] p-[24px] rounded-xl text-sm">
          <h3 className="font-bold text-lg">Thông tin thanh toán</h3>
          <div className="flex justify-between mt-4 gap-2">
            <span className="text-secondary">Thông tin thanh toán</span>
            <span>{cartData?.length} khoá học</span>
          </div>
          <div className="flex justify-between mt-4 gap-2">
            <span className="text-secondary">Tổng</span>
            <span>{formatCurrency(totalPrice)}0đ</span>
          </div>
          <div className="flex justify-between mt-4 gap-2 border-b border-[#E4E4E7] pb-4">
            <span className="text-secondary">Giảm giá</span>
            <span>{formatCurrency(voucherSale)}đ</span>
          </div>
          <div className="flex justify-between mt-4 gap-2">
            <span className="text-primary-contrastText font-semibold">
              Tổng cộng
            </span>
            <span className="text-secondary-main font-semibold">
              {formatCurrency(totalSale)}đ
            </span>
          </div>
          <div className="flex flex-col mt-[16px]">
            <Button
              className="text-white px-4 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Đã chuyển khoản
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
