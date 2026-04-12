import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { tipo, formData, pedidoResumo } = await request.json();

    const email: string = formData.email;
    const senha: string = formData.senha;

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    // Create or reuse user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id:           randomBytes(16).toString("hex"),
          email,
          passwordHash: hashPassword(senha),
          nome:         formData.nomeSolicitante ?? "",
          cpf:          formData.cpfSolicitante  ?? "",
          whatsapp:     formData.whatsapp        ?? "",
        },
      });
    }

    // Strip password from stored form data
    const { senha: _s, confirmarSenha: _c, ...safeFormData } = formData;

    const orderId = pedidoResumo?.id ?? `CERT-${randomBytes(3).toString("hex").toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        id:            orderId,
        userId:        user.id,
        tipo,
        status:        "recebido",
        statusHistory: [{ status: "recebido", date: new Date().toISOString() }],
        formData:      safeFormData,
        pedidoResumo:  pedidoResumo ?? {},
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("POST /api/orders", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
