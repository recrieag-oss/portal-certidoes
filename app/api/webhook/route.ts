import { NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { sendStatusEmail, sendWhatsAppMessage } from "@/lib/notifications";
import type { StatusHistoryEntry } from "@/lib/types";

/* ── Mercado Pago sends both POST (IPN) and GET (ownership check) ────
   Always return 200 quickly — MP retries on non-200. */

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  try {
    const body  = await request.json().catch(() => ({}));
    const topic = (body.type || body.topic || "") as string;

    if (!topic.startsWith("payment")) {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id ?? body.data?.object?.id ?? body.id ?? null;
    if (!paymentId) return NextResponse.json({ received: true });

    const payment = await getMercadoPagoPayment(paymentId);
    console.log(`[webhook] payment ${paymentId} status=${payment.status} ref=${payment.external_reference}`);

    if (payment.status !== "approved") {
      return NextResponse.json({ received: true });
    }

    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({
      where:   { id: orderId },
      include: { user: true },
    });

    if (!order || order.status !== "recebido") {
      return NextResponse.json({ received: true });
    }

    /* Advance status → em_analise */
    const newEntry: StatusHistoryEntry = {
      status: "em_analise",
      date:   new Date().toISOString(),
      note:   `Pagamento aprovado via Mercado Pago (ID: ${paymentId})`,
    };

    const prevHistory = (order.statusHistory as StatusHistoryEntry[]) ?? [];
    const newHistory  = [...prevHistory, newEntry];

    const updated = await prisma.order.update({
      where: { id: orderId },
      data:  { status: "em_analise", statusHistory: newHistory },
    });

    /* Notify the client */
    const user = order.user;
    if (user) {
      const fd = order.formData as Record<string, string>;

      const orderForNotify = {
        id:            order.id,
        tipo:          order.tipo as any,
        status:        "em_analise" as const,
        statusHistory: newHistory,
        createdAt:     order.createdAt.toISOString(),
        updatedAt:     updated.updatedAt.toISOString(),
        formData:      order.formData as any,
        pedidoResumo:  order.pedidoResumo as any,
        userId:        order.userId,
      };

      const userForNotify = {
        id:           user.id,
        email:        fd.email || user.email,
        passwordHash: user.passwordHash,
        nome:         user.nome,
        cpf:          user.cpf,
        whatsapp:     fd.whatsapp || user.whatsapp,
        createdAt:    user.createdAt.toISOString(),
        orderIds:     [] as string[],
      };

      const notifications: Promise<unknown>[] = [
        sendStatusEmail(orderForNotify, userForNotify, "em_analise", newEntry.note),
      ];
      if (user.whatsapp) {
        notifications.push(
          sendWhatsAppMessage(user.whatsapp, orderForNotify, "em_analise", newEntry.note)
        );
      }

      await Promise.allSettled(notifications);
    }

    console.log(`[webhook] order ${orderId} → em_analise ✓`);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("[webhook] unhandled error:", error);
    return NextResponse.json({ received: true }); // always 200 so MP won't retry
  }
}
