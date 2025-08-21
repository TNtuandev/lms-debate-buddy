'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCartStore } from "@/store/slices/cart.slice";
import IconPaypal from "../../../../../public/icons/IconPaypal";
import {formatCurrency} from "@/lib/utils";

export default function ExpandItem({totalPrice}: { totalPrice?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const { qrCodeUrl } = useCartStore();

  console.log("totalPrice---", totalPrice)

  return (
    <div className="w-full border border-[#D4D4D8] rounded-xl p-4 shadow-sm bg-[#F4F4F5]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full text-left font-[400] text-gray-800 border border-success p-[12px] ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
      >
        <div className="flex gap-2 items-center">
          <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 8.5C0 4.08172 3.58172 0.5 8 0.5H32C36.4183 0.5 40 4.08172 40 8.5V32.5C40 36.9183 36.4183 40.5 32 40.5H8C3.58172 40.5 0 36.9183 0 32.5V8.5Z"
              fill="#52525C" fillOpacity="0.04" />
            <path
              d="M10 18.25C9.59 18.25 9.25 17.91 9.25 17.5V15C9.25 12.1 11.61 9.75 14.5 9.75H17C17.41 9.75 17.75 10.09 17.75 10.5C17.75 10.91 17.41 11.25 17 11.25H14.5C12.43 11.25 10.75 12.93 10.75 15V17.5C10.75 17.91 10.41 18.25 10 18.25Z"
              fill="#00A63E" />
            <path
              d="M30 18.25C29.59 18.25 29.25 17.91 29.25 17.5V15C29.25 12.93 27.57 11.25 25.5 11.25H23C22.59 11.25 22.25 10.91 22.25 10.5C22.25 10.09 22.59 9.75 23 9.75H25.5C28.39 9.75 30.75 12.1 30.75 15V17.5C30.75 17.91 30.41 18.25 30 18.25Z"
              fill="#00A63E" />
            <path
              d="M25.5 31.25H24C23.59 31.25 23.25 30.91 23.25 30.5C23.25 30.09 23.59 29.75 24 29.75H25.5C27.57 29.75 29.25 28.07 29.25 26V24.5C29.25 24.09 29.59 23.75 30 23.75C30.41 23.75 30.75 24.09 30.75 24.5V26C30.75 28.9 28.39 31.25 25.5 31.25Z"
              fill="#00A63E" />
            <path
              d="M17 31.25H14.5C11.61 31.25 9.25 28.9 9.25 26V23.5C9.25 23.09 9.59 22.75 10 22.75C10.41 22.75 10.75 23.09 10.75 23.5V26C10.75 28.07 12.43 29.75 14.5 29.75H17C17.41 29.75 17.75 30.09 17.75 30.5C17.75 30.91 17.41 31.25 17 31.25Z"
              fill="#00A63E" />
            <path
              d="M17 19.75H15C13.59 19.75 12.75 18.91 12.75 17.5V15.5C12.75 14.09 13.59 13.25 15 13.25H17C18.41 13.25 19.25 14.09 19.25 15.5V17.5C19.25 18.91 18.41 19.75 17 19.75ZM15 14.75C14.41 14.75 14.25 14.91 14.25 15.5V17.5C14.25 18.09 14.41 18.25 15 18.25H17C17.59 18.25 17.75 18.09 17.75 17.5V15.5C17.75 14.91 17.59 14.75 17 14.75H15Z"
              fill="#00A63E" />
            <path
              d="M25 19.75H23C21.59 19.75 20.75 18.91 20.75 17.5V15.5C20.75 14.09 21.59 13.25 23 13.25H25C26.41 13.25 27.25 14.09 27.25 15.5V17.5C27.25 18.91 26.41 19.75 25 19.75ZM23 14.75C22.41 14.75 22.25 14.91 22.25 15.5V17.5C22.25 18.09 22.41 18.25 23 18.25H25C25.59 18.25 25.75 18.09 25.75 17.5V15.5C25.75 14.91 25.59 14.75 25 14.75H23Z"
              fill="#00A63E" />
            <path
              d="M17 27.75H15C13.59 27.75 12.75 26.91 12.75 25.5V23.5C12.75 22.09 13.59 21.25 15 21.25H17C18.41 21.25 19.25 22.09 19.25 23.5V25.5C19.25 26.91 18.41 27.75 17 27.75ZM15 22.75C14.41 22.75 14.25 22.91 14.25 23.5V25.5C14.25 26.09 14.41 26.25 15 26.25H17C17.59 26.25 17.75 26.09 17.75 25.5V23.5C17.75 22.91 17.59 22.75 17 22.75H15Z"
              fill="#00A63E" />
            <path
              d="M25 27.75H23C21.59 27.75 20.75 26.91 20.75 25.5V23.5C20.75 22.09 21.59 21.25 23 21.25H25C26.41 21.25 27.25 22.09 27.25 23.5V25.5C27.25 26.91 26.41 27.75 25 27.75ZM23 22.75C22.41 22.75 22.25 22.91 22.25 23.5V25.5C22.25 26.09 22.41 26.25 23 26.25H25C25.59 26.25 25.75 26.09 25.75 25.5V23.5C25.75 22.91 25.59 22.75 25 22.75H23Z"
              fill="#00A63E" />
          </svg>
          Quét QR CODE
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#71717B] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-[max-height] duration-300 border-b border-l border-r p-[12px] rounded-b-lg border-success ${
          isOpen ? 'max-h-max opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`text-center lg:text-left`}>
          <span>Mở ứng dụng Internet banking và chọn <span className="font-bold">Quét mã</span></span>
          <div className="flex gap-[32px] justify-center lg:justify-start mt-4 items-center flex-col md:flex-row">
            {qrCodeUrl && (
              <>
                <QRCodeSVG
                  className="hidden lg:block"
                  value={qrCodeUrl}
                  size={208}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  minVersion={4}
                  imageSettings={{
                    src: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
                    height: 24,
                    width: 24,
                    opacity: 1,
                    excavate: true,
                  }}
                />
                <QRCodeSVG
                  className="block lg:hidden"
                  value={qrCodeUrl}
                  size={140}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  minVersion={4}
                  imageSettings={{
                    src: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
                    height: 24,
                    width: 24,
                    opacity: 1,
                    excavate: true,
                  }}
                />
              </>
            )}
            <div className="flex flex-col gap-2">
              <span>Tài khoản VP Bank: <span className="font-semibold">03363826286</span></span>
              <span>Tên: <span className="font-semibold">Debate Buddy</span></span>
              <span>Số tiền: <span className="font-semibold">{formatCurrency(totalPrice)}đ</span></span>
              <span>Lời nhắn: <span className="font-semibold">YZ6GJ</span></span>
            </div>
          </div>
        </div>
      </div>
      <div className={`border border-[#D4D4D8] p-[12px] rounded-lg flex items-center cursor-pointer gap-2 ${isOpen ? 'mt-6' : ''}`}>
        <IconPaypal />
        <div>Thanh toán trực tuyến qua PayPal</div>
      </div>
    </div>
  );
}
