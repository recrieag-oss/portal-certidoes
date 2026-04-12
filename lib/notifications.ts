import nodemailer from "nodemailer";
import { Order, User, ORDER_STATUS_LABELS, OrderStatus } from "./types";

// ─── SMTP Transporter ─────────────────────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
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
  note?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[notifications] SMTP not configured – skipping email");
    return { ok: false, error: "SMTP não configurado" };
  }

  const label = ORDER_STATUS_LABELS[newStatus];
  const color = STATUS_COLORS[newStatus];
  const portalUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const orderUrl = `${portalUrl}/portal/pedido/${order.id}`;

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
            <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">Atualização do seu pedido</p>
          </td>
        </tr>
        <!-- Status badge -->
        <tr>
          <td style="padding:36px 40px 0;text-align:center;">
            <span style="display:inline-block;background:${color};color:#fff;border-radius:999px;padding:8px 22px;font-size:14px;font-weight:600;">${label}</span>
            <h2 style="margin:20px 0 8px;font-size:22px;color:#0f172a;">Olá, ${user.nome}!</h2>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">
              O status do seu pedido <strong style="color:#002776;">${order.id}</strong> foi atualizado.
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
                  <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Novo status</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:${color};">${label}</p>
                  ${note ? `<p style="margin:8px 0 0;font-size:14px;color:#475569;">${note}</p>` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:0 40px 36px;text-align:center;">
            <a href="${orderUrl}" style="display:inline-block;background:#002776;color:#fff;text-decoration:none;border-radius:999px;padding:14px 36px;font-size:15px;font-weight:600;">
              Acompanhar meu pedido →
            </a>
          </td>
        </tr>
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
      from: `"Portal Certidões" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Pedido ${order.id} · ${label}`,
      html,
    });
    return { ok: true };
  } catch (err: any) {
    console.error("[notifications] Email error:", err.message);
    return { ok: false, error: err.message };
  }
}

// ─── WhatsApp Notification ────────────────────────────────────────────────────
// Compatible with: Evolution API, Z-API, Twilio WhatsApp, or any REST-based gateway.
// Configure via env vars:
//   WHATSAPP_API_URL   → e.g. https://api.z-api.io/instances/XXXX/token/YYYY/send-text
//   WHATSAPP_API_TOKEN → Bearer token or API key
//   WHATSAPP_API_TYPE  → "evolution" | "zapi" | "twilio" (default: "evolution")
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

  const label    = ORDER_STATUS_LABELS[newStatus];
  const portalUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const cleaned  = phone.replace(/\D/g, "");

  const message =
    `✅ *Portal Certidões*\n\n` +
    `Olá! Seu pedido *${order.id}* foi atualizado.\n\n` +
    `📋 *Status:* ${label}\n` +
    (note ? `📝 *Observação:* ${note}\n\n` : "\n") +
    `Acompanhe em: ${portalUrl}/portal/pedido/${order.id}`;

  try {
    let body: Record<string, unknown>;
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiType === "evolution") {
      // Evolution API v2 format
      body = { number: `55${cleaned}`, text: message };
      headers["apikey"] = apiToken;
    } else if (apiType === "zapi") {
      // Z-API format
      body = { phone: `55${cleaned}`, message };
      headers["Client-Token"] = apiToken;
    } else if (apiType === "twilio") {
      // Twilio expects form-encoded
      const params = new URLSearchParams({
        To: `whatsapp:+55${cleaned}`,
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM || ""}`,
        Body: message,
      });
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(apiToken).toString("base64")}`,
        },
        body: params.toString(),
      });
      return { ok: res.ok };
    } else {
      // Generic JSON gateway
      body = { phone: cleaned, message };
      headers["Authorization"] = `Bearer ${apiToken}`;
    }

    const res = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

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
