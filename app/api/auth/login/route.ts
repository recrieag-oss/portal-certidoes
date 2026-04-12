"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(senha, user.passwordHash)) {
      return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
    }

    const cookieValue = await createSession(user.id, "client");

    const response = NextResponse.json({ success: true });
    response.cookies.set("session-id", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
