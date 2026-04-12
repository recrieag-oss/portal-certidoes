"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { Bell, Mail, MessageCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const ALL_STATUSES: OrderStatus[] = [
  "recebido","em_analise","aguardando_cartorio","em_tramitacao","pronto","finalizado",
];

const STATUS_DOT: Record<OrderStatus, string> = {
  recebido:            "bg-slate-400",
  em_analise:          "bg-blue-400",
  aguardando_cartorio: "bg-amber-400",
  em_tramitacao:       "bg-purple-400",
  pronto:              "bg-emerald-400",
  finalizado:          "bg-green-400",
};

export function StatusUpdateForm({
  orderId,
  currentStatus,
  hasEmail,
  hasWhatsapp,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  hasEmail: boolean;
  hasWhatsapp: boolean;
}) {
  const router = useRouter();
  const [status, setStatus]       = useState<OrderStatus>(currentStatus);
  const [note, setNote]           = useState("");
  const [notifyEmail, setNEmail]  = useState(true);
  const [notifyWA, setNWA]        = useState(true);
  const [loading, setLoading]     = useState(false);
  const [feedback, setFeedback]   = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note, notifyEmail, notifyWhatsApp: notifyWA }),
      });
      if (!res.ok) throw new Error();
      setFeedback({ ok: true, msg: "Status atualizado e notificações enviadas!" });
      setNote("");
      router.refresh();
    } catch {
      setFeedback({ ok: false, msg: "Erro ao atualizar status." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[20px] border border-white/10 bg-[#1a2235] p-6">
      <div className="mb-5 flex items-center gap-2">
        <Bell className="h-4 w-4 text-blue-400" />
        <h2 className="text-sm font-bold text-white">Atualizar status</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status select */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Novo status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-[#1a2235] text-white">
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Observação (opcional)</label>
          <textarea
            rows={2}
            placeholder="Ex: Certidão localizada, aguardando expedição..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
          />
        </div>

        {/* Notification toggles */}
        <div className="rounded-[12px] border border-white/10 bg-white/5 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Notificar cliente</p>
          <label className={`flex items-center gap-3 cursor-pointer ${!hasEmail ? "opacity-40" : ""}`}>
            <div
              onClick={() => hasEmail && setNEmail((v) => !v)}
              className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                notifyEmail && hasEmail ? "border-blue-500 bg-blue-500" : "border-white/20 bg-white/5"
              }`}
            >
              {notifyEmail && hasEmail && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
            </div>
            <Mail className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-slate-300">
              E-mail {!hasEmail && <span className="text-slate-500">(não configurado)</span>}
            </span>
          </label>
          <label className={`flex items-center gap-3 cursor-pointer ${!hasWhatsapp ? "opacity-40" : ""}`}>
            <div
              onClick={() => hasWhatsapp && setNWA((v) => !v)}
              className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                notifyWA && hasWhatsapp ? "border-emerald-500 bg-emerald-500" : "border-white/20 bg-white/5"
              }`}
            >
              {notifyWA && hasWhatsapp && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
            </div>
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-slate-300">
              WhatsApp {!hasWhatsapp && <span className="text-slate-500">(sem número)</span>}
            </span>
          </label>
        </div>

        {feedback && (
          <div className={`flex items-center gap-2 rounded-[12px] px-4 py-3 text-sm ${
            feedback.ok
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            {feedback.ok
              ? <CheckCircle2 className="h-4 w-4 shrink-0" />
              : <AlertCircle className="h-4 w-4 shrink-0" />}
            {feedback.msg}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-[12px] bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
          {loading ? "Salvando..." : "Salvar e notificar"}
        </button>
      </form>
    </div>
  );
}
