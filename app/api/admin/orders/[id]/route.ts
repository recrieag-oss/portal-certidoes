import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendStatusEmail, sendWhatsAppMessage } from "@/lib/notifications";
import type { OrderStatus, StatusHistoryEntry } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const raw     = cookies().get("admin-session-id")?.value;
  const session = raw ? await getSession(raw) : null;

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where:   { id: params.id },
    include: { user: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const { status, note, notifyEmail, notifyWhatsApp } = (await request.json()) as {
    status:          OrderStatus;
    note?:           string;
    notifyEmail?:    boolean;
    notifyWhatsApp?: boolean;
  };

  const prevHistory = (order.statusHistory as StatusHistoryEntry[]) ?? [];
  const newHistory: StatusHistoryEntry[] = [
    ...prevHistory,
    { status, date: new Date().toISOString(), note },
  ];

  const updated = await prisma.order.update({
    where: { id: params.id },
    data:  { status, statusHistory: newHistory },
  });

  // ── Fire notifications (non-blocking) ──────────────────────────────────────
  const user = order.user;
  if (user) {
    // Build a compatible Order object for the notification helpers
    const orderForNotify = {
      id:            order.id,
      tipo:          order.tipo as any,
      status:        status,
      statusHistory: newHistory,
      createdAt:     order.createdAt.toISOString(),
      updatedAt:     updated.updatedAt.toISOString(),
      formData:      order.formData as any,
      pedidoResumo:  order.pedidoResumo as any,
      userId:        order.userId,
    };

    const userForNotify = {
      id:           user.id,
      email:        user.email,
      passwordHash: user.passwordHash,
      nome:         user.nome,
      cpf:          user.cpf,
      whatsapp:     user.whatsapp,
      createdAt:    user.createdAt.toISOString(),
      orderIds:     [],
    };

    const notifications: Promise<unknown>[] = [];

    if (notifyEmail !== false) {
      notifications.push(sendStatusEmail(orderForNotify, userForNotify, status, note));
    }

    if (notifyWhatsApp !== false && user.whatsapp) {
      notifications.push(sendWhatsAppMessage(user.whatsapp, orderForNotify, status, note));
    }

    Promise.allSettled(notifications).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[notify] notification[${i}] failed:`, r.reason);
        }
      });
    });
  }

  return NextResponse.json({ ...updated, _notified: !!user });
}
