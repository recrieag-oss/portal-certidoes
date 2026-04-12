import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import type { StatusHistoryEntry } from "@/lib/types";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const raw     = cookies().get("admin-session-id")?.value;
  const session = raw ? await getSession(raw) : null;

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("pdf") as File | null;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Arquivo PDF inválido" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "data", "pdfs");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const fileName = `${params.id}.pdf`;
  writeFileSync(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));

  const prevHistory = (order.statusHistory as StatusHistoryEntry[]) ?? [];
  const newHistory: StatusHistoryEntry[] = [
    ...prevHistory,
    { status: "finalizado", date: new Date().toISOString(), note: "Documento disponível para download" },
  ];

  await prisma.order.update({
    where: { id: params.id },
    data:  {
      pdfPath:       fileName,
      status:        "finalizado",
      statusHistory: newHistory,
    },
  });

  return NextResponse.json({ success: true });
}
