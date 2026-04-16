import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000");

function getClient() {
  if (!accessToken) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN não está definido nas variáveis de ambiente."
    );
  }
  return new MercadoPagoConfig({ accessToken });
}

/* ── Preference (Checkout Pro — redireciona para página do MP) ─────── */
export async function createMercadoPagoPreference(payload: {
  items:              Array<{ title: string; quantity: number; unit_price: number }>;
  payer?:             { name?: string; email?: string; identification?: { type: string; number: string } };
  external_reference?: string;
  metadata?:          Record<string, unknown>;
}) {
  const client     = getClient();
  const preference = new Preference(client);

  const response = await preference.create({
    body: {
      items: payload.items.map((item) => ({
        id:          item.title,
        title:       item.title,
        quantity:    item.quantity,
        unit_price:  item.unit_price,
        currency_id: "BRL",
      })),
      payer: payload.payer,
      back_urls: {
        success: `${baseUrl}/sucesso`,
        failure: `${baseUrl}/falha`,
        pending: `${baseUrl}/pendente`,
      },
      auto_return: "approved",
      payment_methods: {
        // Permite PIX, cartão de crédito, débito e boleto
        excluded_payment_types: [],
        installments: 12,           // até 12x no cartão
      },
      notification_url:  `${baseUrl}/api/webhook`,
      external_reference: payload.external_reference,
      metadata: payload.metadata,
    },
  });

  return response;
}

/* ── Consultar pagamento pelo ID (usado no webhook) ─────────────────── */
export async function getMercadoPagoPayment(paymentId: string | number) {
  const client  = getClient();
  const payment = new Payment(client);
  return payment.get({ id: Number(paymentId) });
}
