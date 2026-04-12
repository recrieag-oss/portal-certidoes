import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import type { StatusHistoryEntry } from "@/lib/types";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.trim().toUpperCase();

  if (!id) {
    return NextResponse.json({ error: "Código não informado" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const status        = order.status as keyof typeof ORDER_STATUS_LABELS;
  const statusHistory = (order.statusHistory as StatusHistoryEntry[]) ?? [];

  // Return only public-safe fields — no personal data exposed
  return NextResponse.json({
    id:          order.id,
    tipo:        order.tipo,
    status,
    statusLabel: ORDER_STATUS_LABELS[status],
    createdAt:   order.createdAt,
    hasPdf:      order.status === "finalizado" && !!order.pdfPath,
    statusHistory: statusHistory.map((h) => ({
      status: h.status,
      label:  ORDER_STATUS_LABELS[h.status],
      date:   h.date,
      note:   h.note,
    })),
  });
}
