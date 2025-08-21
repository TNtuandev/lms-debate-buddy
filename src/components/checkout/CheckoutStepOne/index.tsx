import React, { Dispatch, SetStateAction } from "react";
import CheckoutStepOneDesktop from "./desktop";
import { CartItem } from "@/store/slices/cart.slice";

interface ICheckoutStepOneProps {
  setStep: Dispatch<SetStateAction<number>>;
  cartData?: CartItem[];
}

export default function CheckoutStepOne({
  setStep,
  cartData,
}: ICheckoutStepOneProps) {
  return (
    <div className="w-full">
      <div>
        <CheckoutStepOneDesktop setStep={setStep} cartData={cartData} />
      </div>
    </div>
  );
}
