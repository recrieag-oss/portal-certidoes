"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, CheckCircle2, Circle, Clock, Download,
  FileText, AlertCircle, Loader2, ArrowRight,
} from "lucide-react";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

type HistoryEntry = { status: OrderStatus; label: string; date: string; note?: string };

type TrackResult = {
  id: string;
  tipo: string;
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
  hasPdf: boolean;
  statusHistory: HistoryEntry[];
};

const ALL_STATUSES: OrderStatus[] = [
  "recebido", "em_analise", "aguardando_cartorio", "em_tramitacao", "pronto", "finalizado",
];

const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; border: string; dot: string }> = {
  recebido:            { bg: "bg-slate-100",   text: "text-slate-700",   border: "border-slate-300",   dot: "bg-slate-400" },
  em_analise:          { bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-300",    dot: "bg-blue-500" },
  aguardando_cartorio: { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-300",   dot: "bg-amber-500" },
  em_tramitacao:       { bg: "bg-purple-50",   text: "text-purple-700",  border: "border-purple-300",  dot: "bg-purple-500" },
  pronto:              { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-400", dot: "bg-emerald-500" },
  finalizado:          { bg: "bg-green-50",    text: "text-green-700",   border: "border-green-400",   dot: "bg-green-500" },
};

const TIPO_LABEL: Record<string, string> = {
  nascimento: "Certidão de Nascimento",
  casamento:  "Certidão de Casamento",
  obito:      "Certidão de Óbito",
};

export default function AcompanharPage() {
  const [codigo, setCodigo]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<TrackResult | null>(null);
  const [error, setError]       = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const id = codigo.trim().toUpperCase();
    if (!id) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(id)}`);
      if (res.status === 404) { setError("Pedido não encontrado. Verifique o código e tente novamente."); return; }
      if (!res.ok) { setError("Erro ao consultar. Tente novamente."); return; }
      setResult(await res.json());
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const currentIdx = result ? ALL_STATUSES.indexOf(result.status) : -1;

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
      {/* Search card */}
      <div className="rounded-[32px] bg-white p-8 shadow-soft sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#002776]/10">
            <Search className="h-6 w-6 text-[#002776]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-950">Acompanhar pedido</h1>
          <p className="text-sm leading-6 text-slate-500">
            Digite o código recebido após a solicitação para consultar o status em tempo real.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ex: CERT-38109"
            className="flex-1 rounded-[18px] border border-slate-200 bg-slate-50 px-5 py-4 text-base font-mono tracking-wide text-slate-900 outline-none focus:border-[#002776] focus:ring-2 focus:ring-blue-100 transition"
          />
          <button
            type="submit"
            disabled={loading || !codigo.trim()}
            className="inline-flex items-center gap-2 rounded-[18px] bg-[#002776] px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && (() => {
        const st = STATUS_STYLE[result.status];
        return (
          <div className="mt-6 space-y-5">
            {/* Header */}
            <div className="rounded-[28px] bg-white p-6 shadow-soft sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#002776]">Pedido encontrado</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">{result.id}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {TIPO_LABEL[result.tipo] ?? result.tipo} &middot; {new Date(result.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${st.bg} ${st.text} ${st.border}`}>
                  <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                  {result.statusLabel}
                </span>
              </div>

              {/* PDF download */}
              {result.hasPdf && (
                <div className="mt-5 flex items-center justify-between gap-4 rounded-[18px] bg-emerald-500 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-white" />
                    <div>
                      <p className="font-bold text-white text-sm">Documento disponível para download</p>
                      <p className="text-xs text-emerald-100">Faça login para baixar seu arquivo.</p>
                    </div>
                  </div>
                  <Link href="/portal/login"
                    className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50">
                    Acessar portal <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-[28px] bg-white p-6 shadow-soft sm:p-8">
              <h3 className="mb-6 font-bold text-slate-900">Andamento do pedido</h3>
              <ol className="space-y-0">
                {ALL_STATUSES.map((s, i) => {
                  const done   = i <= currentIdx;
                  const isCurr = i === currentIdx;
                  const hist   = result.statusHistory.findLast((h) => h.status === s);
                  const isLast = i === ALL_STATUSES.length - 1;
                  return (
                    <li key={s} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          done
                            ? isCurr
                              ? "border-[#002776] bg-[#002776]"
                              : "border-emerald-500 bg-emerald-500"
                            : "border-slate-200 bg-white"
                        }`}>
                          {done
                            ? <CheckCircle2 className="h-4 w-4 text-white" />
                            : <Circle className="h-3.5 w-3.5 text-slate-300" />}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 my-1 flex-1 ${done && !isCurr ? "bg-emerald-400" : "bg-slate-200"}`} style={{ minHeight: 24 }} />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className={`text-sm font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>
                          {ORDER_STATUS_LABELS[s]}
                          {isCurr && (
                            <span className="ml-2 inline-block rounded-full bg-[#002776] px-2 py-0.5 text-[10px] font-bold text-white">
                              Atual
                            </span>
                          )}
                        </p>
                        {hist && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {new Date(hist.date).toLocaleString("pt-BR")}
                            {hist.note && <span className="ml-1 italic text-slate-500">· {hist.note}</span>}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Login CTA */}
            <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">Acompanhe com mais detalhes</p>
                <p className="text-xs text-slate-400">Acesse a área do cliente para ver todas as informações do pedido.</p>
              </div>
              <Link href="/portal/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#002776] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-900">
                Entrar <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
