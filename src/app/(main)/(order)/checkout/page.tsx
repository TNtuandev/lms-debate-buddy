'use client'
import { useState } from 'react';
import CheckoutStepOne from '@/components/checkout/CheckoutStepOne';
import CheckoutStepTwo from '@/components/checkout/CheckoutStepTwo';
import CheckoutStepFinal from '@/components/checkout/CheckoutStepFinal';
import { useCartStore } from "@/store/slices/cart.slice";

export default function Checkout() {
  const [step, setStep] = useState(0)

  const {listCart} = useCartStore();

  const renderStep = () => {
    switch (step) {
      case 0:
        return <CheckoutStepOne setStep={setStep} cartData={listCart}/>
      case 1:
        return <CheckoutStepTwo setStep={setStep} cartData={listCart}/>
      default:
        return <CheckoutStepFinal cartData={listCart}/>
    }
  }

  return(
    <div className="mt-[100px] w-full">{renderStep()}</div>
  )
}
