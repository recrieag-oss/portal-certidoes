import { MercadoPagoCheckout } from "@/components/checkout/MercadoPagoCheckout";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Checkout</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Revise seu pedido e conclua o pagamento
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Confira os dados da solicitação à esquerda e finalize o pagamento com segurança no painel ao lado.
        </p>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_380px]">
        <OrderSummary />
        <MercadoPagoCheckout />
      </div>
    </main>
  );
}
