import React, { Dispatch, SetStateAction } from "react";
import CheckoutStepTwoDesktop from "@/components/checkout/CheckoutStepTwo/desktop";
import { CartItem } from "@/store/slices/cart.slice";

interface ICheckoutStepTwoProps {
  setStep: Dispatch<SetStateAction<number>>;
  cartData?: CartItem[];
}

export default function CheckoutStepTwo({
  setStep,
  cartData,
}: ICheckoutStepTwoProps) {
  return <CheckoutStepTwoDesktop setStep={setStep} cartData={cartData} />;
}
