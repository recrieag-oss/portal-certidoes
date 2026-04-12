import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFileSync, existsSync } from "fs";
import path from "path";

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

  const filePath = path.join(process.cwd(), "data", "pdfs", order.pdfPath);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }

  const buffer = readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="certidao-${params.id}.pdf"`,
    },
  });
}
