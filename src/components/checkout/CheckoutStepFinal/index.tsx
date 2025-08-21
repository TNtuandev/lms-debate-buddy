import CheckoutStepFinalDesktop from "@/components/checkout/CheckoutStepFinal/desktop";
import { CartItem } from "@/store/slices/cart.slice";

interface ICheckoutStepFinalProps {
  cartData?: CartItem[];
}

export default function CheckoutStepFinal({
  cartData,
}: ICheckoutStepFinalProps) {
  return <CheckoutStepFinalDesktop cartData={cartData} />;
}
