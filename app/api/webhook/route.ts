import { NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/mercadopago";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = body.type || body.topic || "";

    if (topic === "payment" || topic === "payment.created") {
      const paymentId = body.data?.id || body.data?.object?.id || body.id;
      if (paymentId) {
        const payment = await getMercadoPagoPayment(paymentId);
        console.log("Webhook Mercado Pago: pagamento", payment);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook do Mercado Pago", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
