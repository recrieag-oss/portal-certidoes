import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, type OrderStatus, type StatusHistoryEntry } from "@/lib/types";
import {
  ArrowLeft, Download, CheckCircle2, Circle, LogOut,
  FileText, MapPin, User, Calendar, Package, CreditCard, UserCircle2,
} from "lucide-react";

const STATUS_STYLE: Record<OrderStatus, { ring: string; bg: string; text: string }> = {
  recebido:             { ring: "border-slate-300",    bg: "bg-slate-100",   text: "text-slate-600"  },
  em_analise:           { ring: "border-blue-400",     bg: "bg-blue-50",     text: "text-blue-700"   },
  aguardando_cartorio:  { ring: "border-amber-400",    bg: "bg-amber-50",    text: "text-amber-700"  },
  em_tramitacao:        { ring: "border-purple-400",   bg: "bg-purple-50",   text: "text-purple-700" },
  pronto:               { ring: "border-emerald-400",  bg: "bg-emerald-50",  text: "text-emerald-700"},
  finalizado:           { ring: "border-[#009B3A]",    bg: "bg-green-50",    text: "text-green-700"  },
};

const ALL_STATUSES: OrderStatus[] = [
  "recebido", "em_analise", "aguardando_cartorio", "em_tramitacao", "pronto", "finalizado",
];

const TIPO_LABEL: Record<string, string> = {
  nascimento: "Nascimento",
  casamento:  "Casamento",
  obito:      "Óbito",
};

export default async function PortalPedidoPage({ params }: { params: { id: string } }) {
  const raw     = cookies().get("session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  if (!session || session.role !== "client") redirect("/portal/login");

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) notFound();

  const user       = await prisma.user.findUnique({ where: { id: session.userId } });
  const status     = order.status as OrderStatus;
  const currentIdx = ALL_STATUSES.indexOf(status);
  const st         = STATUS_STYLE[status];
  const fd         = order.formData as Record<string, any>;
  const history    = (order.statusHistory as StatusHistoryEntry[]) ?? [];

  // Derive the registered name based on certificate type
  const nomeLabel =
    order.tipo === "obito"    ? "Nome do falecido" :
    order.tipo === "casamento" ? "Cônjuges"        : "Nome do registrado";

  const nomeValue =
    order.tipo === "obito"    ? (fd.nomeFalecido ?? "—")   :
    order.tipo === "casamento" ? [fd.nomeConjuge1, fd.nomeConjuge2].filter(Boolean).join(" & ") || "—"
                               : (fd.nomeCompleto ?? "—");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Portal top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#009B3A]/10">
              <UserCircle2 className="h-4 w-4 text-[#009B3A]" />
            </div>
            <div className="leading-none">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Meu painel</p>
              <p className="text-sm font-semibold text-slate-900">{user?.nome}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </form>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <Link
          href="/portal"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Meus pedidos
        </Link>

        {/* Payment pending banner */}
        {status === "recebido" && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[20px] bg-amber-50 border border-amber-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Pagamento pendente</p>
                <p className="text-sm text-slate-500">Confirme o pagamento para iniciarmos a busca.</p>
              </div>
            </div>
            <button
              disabled
              className="flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white opacity-60"
            >
              <CreditCard className="h-4 w-4" /> Pagar para confirmar
            </button>
          </div>
        )}

        {/* PDF download banner */}
        {status === "finalizado" && order.pdfPath && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[20px] bg-emerald-50 border border-emerald-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Documento pronto!</p>
                <p className="text-sm text-slate-500">Seu arquivo está disponível para download.</p>
              </div>
            </div>
            <a
              href={`/api/orders/${order.id}/download`}
              className="flex shrink-0 items-center gap-2 rounded-full bg-[#009B3A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#007A2F]"
            >
              <Download className="h-4 w-4" /> Baixar PDF
            </a>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* ── Left column ─────────────────────────────────── */}
          <div className="space-y-5">

            {/* Header card */}
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              {/* Green accent bar */}
              <div className="h-[3px] bg-[#009B3A]" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#009B3A]">Pedido</p>
                    <h1 className="mt-1 text-2xl font-black text-slate-900">{order.id}</h1>
                    <p className="mt-1 text-sm text-slate-400 capitalize">
                      Certidão de {TIPO_LABEL[order.tipo] ?? order.tipo}
                      {" · "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${st.ring} ${st.bg} ${st.text}`}>
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-sm font-bold text-slate-900">Andamento do pedido</h2>
              <ol className="relative space-y-0">
                {ALL_STATUSES.map((s, i) => {
                  const done   = i <= currentIdx;
                  const isCurr = i === currentIdx;
                  const hist   = history.filter((h) => h.status === s).at(-1);
                  const isLast = i === ALL_STATUSES.length - 1;
                  return (
                    <li key={s} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            done
                              ? isCurr
                                ? "border-[#009B3A] bg-[#009B3A]"
                                : "border-emerald-400 bg-emerald-400"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          {done
                            ? <CheckCircle2 className="h-4 w-4 text-white" />
                            : <Circle className="h-3.5 w-3.5 text-slate-300" />}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 my-1 ${done && !isCurr ? "bg-emerald-300" : "bg-slate-100"}`}
                            style={{ minHeight: 24 }}
                          />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className={`text-sm font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>
                          {ORDER_STATUS_LABELS[s]}
                          {isCurr && (
                            <span className="ml-2 inline-block rounded-full bg-[#009B3A] px-2 py-0.5 text-[10px] font-bold text-white">
                              Atual
                            </span>
                          )}
                        </p>
                        {hist && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {new Date(hist.date).toLocaleString("pt-BR")}
                            {hist.note && <span className="ml-1 italic">· {hist.note}</span>}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────── */}
          <div className="space-y-5 h-fit">

            {/* Order details */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-bold text-slate-900">Detalhes do pedido</h2>
              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-[#009B3A]" />
                  <div>
                    <dt className="text-xs text-slate-400">{nomeLabel}</dt>
                    <dd className="text-sm font-semibold text-slate-900">{nomeValue}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#009B3A]" />
                  <div>
                    <dt className="text-xs text-slate-400">Cartório / Cidade</dt>
                    <dd className="text-sm font-semibold text-slate-900">
                      {fd.cartorio || "A localizar"}
                      <br />
                      <span className="font-normal text-slate-500">
                        {fd.cidade} – {fd.estado}
                      </span>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-[#009B3A]" />
                  <div>
                    <dt className="text-xs text-slate-400">Formato</dt>
                    <dd className="text-sm font-semibold text-slate-900">
                      {fd.formato === "fisica" ? "Físico (Correios)" : "Digital (Download)"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#009B3A]" />
                  <div>
                    <dt className="text-xs text-slate-400">Data do pedido</dt>
                    <dd className="text-sm font-semibold text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Requester */}
            {user && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold text-slate-900">Solicitante</h2>
                <p className="text-sm font-semibold text-slate-900">{user.nome}</p>
                <p className="mt-0.5 text-xs text-slate-400">{user.email}</p>
                {user.whatsapp && (
                  <p className="mt-0.5 text-xs text-slate-400">{user.whatsapp}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
