import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import _ from 'lodash';

interface PromotionDialogProps {
  setSelectedVoucher: (voucher: string) => void;
  selectedVoucher: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PromotionDialog({setSelectedVoucher, selectedVoucher, open, setOpen}: PromotionDialogProps) {
  const [promoCode, setPromoCode] = useState("");

  console.log("selectedVoucher", selectedVoucher);
  // Giả sử value là một đối tượng chứa thông tin voucher đã chọn
  console.log("promoCode", promoCode);
  const [value] = useState('')

  const debounceSearch = _.debounce((value: string) => {
    setPromoCode(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value);
  };

  const handleApply = () => {
    setSelectedVoucher(value);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedVoucher('');
    setPromoCode("");
    setOpen(false);
  };
  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-[30px] text-sm">
          Chọn mã
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[440px] lg:w-[612px]">
        <DialogHeader>
          <DialogTitle>Mã khuyến mại</DialogTitle>
        </DialogHeader>

        <div className="">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              className="w-full p-2.5 pr-24 border border-zinc-300 rounded-md"
              onChange={handleSearchChange}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1.5 text-white bg-green-600 rounded-md text-sm">
              Áp dụng
            </button>
          </div>

          <h3 className="font-medium mb-2">Mã giảm giá có sẵn</h3>
          <p className="text-gray-600 text-sm mb-4">
            Chọn một phiếu giảm giá từ danh sách dưới đây và áp dụng cho đơn
            hàng của bạn.
          </p>

          <div className="text-sm text-gray-600 mt-4">
            {value ? 1 : 0} Voucher đã được chọn
          </div>

          <div className="flex gap-3 mt-4">
            <button
              className="cursor-pointer font-semibold flex-1 py-3 border-primary-light text-primary border rounded-md text-center"
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              className="cursor-pointer font-semibold flex-1 py-3 bg-[#CD9B69] text-white rounded-md text-center"
              onClick={handleApply}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}