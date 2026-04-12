import { MercadoPagoCheckout } from "@/components/checkout/MercadoPagoCheckout";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <OrderSummary />
        <MercadoPagoCheckout />
      </div>
    </main>
  );
}
