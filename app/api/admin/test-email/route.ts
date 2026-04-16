import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  // Apenas admin pode chamar
  const raw     = cookies().get("admin-session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { to } = await request.json() as { to: string };

  const host   = process.env.SMTP_HOST   || "";
  const port   = Number(process.env.SMTP_PORT) || 587;
  const user   = process.env.SMTP_USER   || "";
  const pass   = process.env.SMTP_PASS   || "";
  const secure = port === 465;

  if (!host || !user || !pass) {
    return NextResponse.json({
      ok:      false,
      error:   "Variáveis SMTP não configuradas no Vercel",
      missing: { host: !host, user: !user, pass: !pass },
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host, port, secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    await transporter.sendMail({
      from:    `"Portal Certidões" <${user}>`,
      to,
      subject: "✅ Teste de email — Portal Certidões",
      html: `
        <div style="font-family:sans-serif;padding:32px;max-width:480px;margin:auto;border-radius:12px;border:1px solid #e2e8f0;">
          <h2 style="color:#002776;margin:0 0 16px">Email funcionando! ✅</h2>
          <p style="color:#475569;margin:0">Este é um teste automático do sistema de notificações do Portal Certidões.</p>
          <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">SMTP: ${host}:${port} — secure: ${secure}</p>
        </div>`,
    });

    return NextResponse.json({ ok: true, host, port, secure, from: user, to });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, host, port, secure });
  }
}
