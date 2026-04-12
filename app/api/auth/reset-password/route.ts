import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { token, senha } = await req.json();

  if (!token || !senha || senha.length < 6) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { resetToken: token } });

  if (!user) {
    return NextResponse.json({ error: "Link inválido ou já utilizado" }, { status: 400 });
  }

  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return NextResponse.json({ error: "Este link expirou. Solicite um novo." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash:     hashPassword(senha),
      resetToken:       null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json({ ok: true });
}
