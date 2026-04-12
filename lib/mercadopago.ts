import mercadopago from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const mp = mercadopago as any;
if (accessToken) {
  mp.configurations?.setAccessToken?.(accessToken);
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  "http://localhost:3000";

export async function createMercadoPagoPreference(payload: any) {
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não está definido");
  }

  const preference = await mp.preferences.create({
    items: payload.items,
    payer: payload.payer,
    back_urls: {
      success: `${baseUrl}/sucesso`,
      failure: `${baseUrl}/falha`,
      pending: `${baseUrl}/pendente`,
    },
    auto_return: "approved",
    payment_methods: {
      excluded_payment_types: [],
      installments: 12,
    },
    notification_url: `${baseUrl}/api/webhook`,
    external_reference: payload.external_reference,
    metadata: payload.metadata,
  });

  return preference;
}

export async function getMercadoPagoPayment(paymentId: string) {
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não está definido");
  }

  return mp.payment.findById(paymentId);
}
