import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const raw     = cookies().get("admin-session-id")?.value;
  const session = raw ? await getSession(raw) : null;

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { nome: true, email: true, whatsapp: true, cpf: true } } },
  });

  return NextResponse.json(orders);
}
