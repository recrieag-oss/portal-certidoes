import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import type { StatusHistoryEntry } from "@/lib/types";
import { sendStatusEmail, sendWhatsAppMessage } from "@/lib/notifications";

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

  const form = await request.formData();
  const file = form.get("pdf") as File | null;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Arquivo PDF inválido" }, { status: 400 });
  }

  // Read buffer (can only consume ReadableStream once)
  const pdfBuffer = Buffer.from(await file.arrayBuffer());

  // ── Upload to Vercel Blob ─────────────────────────────────────────────────
  const blob = await put(`certidoes/${params.id}.pdf`, pdfBuffer, {
    access:      "public",
    contentType: "application/pdf",
  });

  const prevHistory = (order.statusHistory as StatusHistoryEntry[]) ?? [];
  const newHistory: StatusHistoryEntry[] = [
    ...prevHistory,
    { status: "finalizado", date: new Date().toISOString(), note: "Documento disponível para download" },
  ];

  await prisma.order.update({
    where: { id: params.id },
    data:  {
      pdfPath:       blob.url,   // store the Blob URL instead of filename
      status:        "finalizado",
      statusHistory: newHistory,
    },
  });

  // ── Auto-notify client (non-blocking) ────────────────────────────────────
  const user = order.user;
  if (user) {
    const orderForNotify = {
      id:            order.id,
      tipo:          order.tipo as any,
      status:        "finalizado" as any,
      statusHistory: newHistory,
      createdAt:     order.createdAt.toISOString(),
      updatedAt:     new Date().toISOString(),
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

    Promise.allSettled([
      // Email with PDF attachment
      sendStatusEmail(orderForNotify, userForNotify, "finalizado", undefined, pdfBuffer),
      // WhatsApp with download link
      ...(user.whatsapp
        ? [sendWhatsAppMessage(user.whatsapp, orderForNotify, "finalizado")]
        : []),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[pdf-upload] notification[${i}] failed:`, r.reason);
        }
      });
    });
  }

  return NextResponse.json({ success: true, url: blob.url });
}
