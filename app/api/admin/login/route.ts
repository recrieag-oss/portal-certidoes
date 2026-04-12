import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@portal.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin2026";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (email !== ADMIN_EMAIL || senha !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const cookieValue = await createSession("admin", "admin");

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-session-id", cookieValue, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   24 * 60 * 60,
      path:     "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
