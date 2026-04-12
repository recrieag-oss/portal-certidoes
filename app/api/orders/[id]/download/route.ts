import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const raw     = cookies().get("session-id")?.value;
  const session = raw ? await getSession(raw) : null;

  if (!session || session.role !== "client") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  if (!order.pdfPath) {
    return NextResponse.json({ error: "PDF não disponível" }, { status: 404 });
  }

  // pdfPath now holds a Vercel Blob URL — redirect the client directly to it
  return NextResponse.redirect(order.pdfPath);
}
