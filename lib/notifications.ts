import nodemailer from "nodemailer";
import { Order, User, ORDER_STATUS_LABELS, OrderStatus } from "./types";

// ─── SMTP Transporter ─────────────────────────────────────────────────────────
function getTransporter() {
  const port   = Number(process.env.SMTP_PORT) || 587;
  const secure = port === 465;          // SSL em 465, STARTTLS em 587
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    tls: { rejectUnauthorized: false },  // aceita cert. do TurboCloud
  });
}

// ─── Status color map ─────────────────────────────────────────────────────────
const STATUS_COLORS: Record<OrderStatus, string> = {
  recebido:             "#6B7280",
  em_analise:           "#3B82F6",
  aguardando_cartorio:  "#F59E0B",
  em_tramitacao:        "#8B5CF6",
  pronto:               "#10B981",
  finalizado:           "#002776",
};

// ─── Email Notification ───────────────────────────────────────────────────────
export async function sendStatusEmail(
  order: Order,
  user: User,
  newStatus: OrderStatus,
  note?: string,
  pdfBuffer?: Buffer          // ← PDF attachment when finalizado
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[notifications] SMTP not configured – skipping email");
    return { ok: false, error: "SMTP não configurado" };
  }

  const label      = ORDER_STATUS_LABELS[newStatus];
  const color      = STATUS_COLORS[newStatus];
  const portalUrl  = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const orderUrl   = `${portalUrl}/portal/pedido/${order.id}`;
  const isFinal    = newStatus === "finalizado";

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#002776;padding:32px 40px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:.5px;">PORTAL CERTIDÕES</p>
            <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">${isFinal ? "Seu documento está pronto! 🎉" : "Atualização do seu pedido"}</p>
          </td>
        </tr>
        <!-- Status badge -->
        <tr>
          <td style="padding:36px 40px 0;text-align:center;">
            <span style="display:inline-block;background:${color};color:#fff;border-radius:999px;padding:8px 22px;font-size:14px;font-weight:600;">${label}</span>
            <h2 style="margin:20px 0 8px;font-size:22px;color:#0f172a;">Olá, ${user.nome}!</h2>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">
              ${isFinal
                ? `Sua certidão referente ao pedido <strong style="color:#002776;">${order.id}</strong> está pronta e disponível para download.`
                : `O status do seu pedido <strong style="color:#002776;">${order.id}</strong> foi atualizado.`
              }
            </p>
          </td>
        </tr>
        <!-- Details -->
        <tr>
          <td style="padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="padding:18px 24px;border-bottom:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Pedido</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#0f172a;">${order.id}</p>
                </td>
                <td style="padding:18px 24px;border-bottom:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Tipo</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#0f172a;text-transform:capitalize;">${order.tipo}</p>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:18px 24px;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Status</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:${color};">${label}</p>
                  ${note ? `<p style="margin:8px 0 0;font-size:14px;color:#475569;">${note}</p>` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:0 40px ${isFinal ? "20px" : "36px"};text-align:center;">
            <a href="${orderUrl}" style="display:inline-block;background:#002776;color:#fff;text-decoration:none;border-radius:999px;padding:14px 36px;font-size:15px;font-weight:600;">
              ${isFinal ? "Acessar meu pedido →" : "Acompanhar meu pedido →"}
            </a>
          </td>
        </tr>
        ${isFinal && pdfBuffer ? `
        <!-- PDF download callout -->
        <tr>
          <td style="padding:0 40px 36px;text-align:center;">
            <div style="border:2px dashed #10B981;border-radius:16px;padding:20px 24px;background:#f0fdf4;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#065f46;">📎 Certidão em anexo</p>
              <p style="margin:0;font-size:13px;color:#047857;">O arquivo PDF da sua certidão está anexado a este e-mail.</p>
            </div>
          </td>
        </tr>` : ""}
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Portal Certidões · Dúvidas? Fale com nossa equipe de suporte.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from:    `"Portal Certidões" <${process.env.SMTP_USER}>`,
      to:      user.email,
      subject: isFinal
        ? `✅ Sua certidão está pronta — Pedido ${order.id}`
        : `Pedido ${order.id} · ${label}`,
      html,
      // Attach PDF if provided
      ...(pdfBuffer
        ? {
            attachments: [{
              filename:    `certidao-${order.id}.pdf`,
              content:     pdfBuffer,
              contentType: "application/pdf",
            }],
          }
        : {}),
    });
    return { ok: true };
  } catch (err: any) {
    console.error("[notifications] Email error:", err.message);
    return { ok: false, error: err.message };
  }
}

// ─── WhatsApp Notification ────────────────────────────────────────────────────
export async function sendWhatsAppMessage(
  phone: string,
  order: Order,
  newStatus: OrderStatus,
  note?: string
): Promise<{ ok: boolean; error?: string }> {
  const apiUrl   = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const apiType  = process.env.WHATSAPP_API_TYPE || "evolution";

  if (!apiUrl || !apiToken) {
    console.warn("[notifications] WhatsApp API not configured – skipping");
    return { ok: false, error: "WhatsApp API não configurada" };
  }

  const label     = ORDER_STATUS_LABELS[newStatus];
  const portalUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const cleaned   = phone.replace(/\D/g, "");
  const isFinal   = newStatus === "finalizado";
  const orderUrl  = `${portalUrl}/portal/pedido/${order.id}`;

  const message = isFinal
    ? `✅ *Portal Certidões*\n\n` +
      `Olá! Sua certidão está *pronta para download*! 🎉\n\n` +
      `📋 *Pedido:* ${order.id}\n` +
      `📄 *Tipo:* ${order.tipo}\n` +
      (note ? `📝 *Observação:* ${note}\n\n` : "\n") +
      `👇 *Acesse agora para baixar seu documento:*\n` +
      `${orderUrl}\n\n` +
      `_Faça login com seu e-mail e senha cadastrados._`
    : `✅ *Portal Certidões*\n\n` +
      `Olá! Seu pedido *${order.id}* foi atualizado.\n\n` +
      `📋 *Status:* ${label}\n` +
      (note ? `📝 *Observação:* ${note}\n\n` : "\n") +
      `Acompanhe em: ${orderUrl}`;

  try {
    let body: Record<string, unknown>;
    let headers: Record<string, string> = { "Content-Type": "application/json" };

    if (apiType === "evolution") {
      body = { number: `55${cleaned}`, text: message };
      headers["apikey"] = apiToken;
    } else if (apiType === "zapi") {
      body = { phone: `55${cleaned}`, message };
      headers["Client-Token"] = apiToken;
    } else if (apiType === "twilio") {
      const params = new URLSearchParams({
        To:   `whatsapp:+55${cleaned}`,
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM || ""}`,
        Body: message,
      });
      const res = await fetch(apiUrl, {
        method:  "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:  `Basic ${Buffer.from(apiToken).toString("base64")}`,
        },
        body: params.toString(),
      });
      return { ok: res.ok };
    } else {
      body = { phone: cleaned, message };
      headers["Authorization"] = `Bearer ${apiToken}`;
    }

    const res = await fetch(apiUrl, { method: "POST", headers, body: JSON.stringify(body) });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status}: ${txt}`);
    }
    return { ok: true };
  } catch (err: any) {
    console.error("[notifications] WhatsApp error:", err.message);
    return { ok: false, error: err.message };
  }
}
