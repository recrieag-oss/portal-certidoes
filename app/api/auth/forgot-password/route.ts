import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token     = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data:  { resetToken: token, resetTokenExpiry: expiresAt },
  });

  const baseUrl   = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/portal/redefinir-senha?token=${token}`;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || "smtp.gmail.com",
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#002776;padding:28px 40px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:20px;font-weight:700;">PORTAL CERTIDÕES</p>
            <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">Redefinição de senha</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;text-align:center;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Esqueceu sua senha?</h2>
            <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.6;">
              Recebemos uma solicitação para redefinir a senha da conta <strong>${user.email}</strong>.<br/>
              Clique no botão abaixo — o link é válido por <strong>1 hora</strong>.
            </p>
            <a href="${resetLink}" style="display:inline-block;background:#002776;color:#fff;text-decoration:none;border-radius:999px;padding:14px 36px;font-size:15px;font-weight:600;">
              Redefinir minha senha
            </a>
            <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
              Se você não solicitou isso, ignore este e-mail. Sua senha não será alterada.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:18px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;">Portal Certidões · Este link expira em 1 hora</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from:    `"Portal Certidões" <${process.env.SMTP_USER}>`,
      to:      user.email,
      subject: "Redefinição de senha — Portal Certidões",
      html,
    });
  }

  return NextResponse.json({ ok: true });
}
